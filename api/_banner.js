// Shared helpers for talking to UTM's public (anonymous, no student login
// involved) Banner 9 Self-Service "Browse Classes" endpoints. Used by
// banner.js's "details" (resolve a section to full info) and
// "course-search"/"section-search" (live autocomplete) actions.

export function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"');
}

export function bannerHeaders(accept) {
  return {
    Accept: accept,
    Connection: "close",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0",
    ...(process.env.UTM_COOKIE ? { Cookie: process.env.UTM_COOKIE } : {}),
  };
}

// Module-scope caches. The server is one long-running Node process, so these
// persist across every lookup, turning a multi-request Banner round trip
// into a single fast call after the first one.
const TERM_CODE_TTL_MS = 60 * 60 * 1000; // term list barely changes
const SESSION_TTL_MS = 8 * 60 * 1000; // conservative vs Banner's actual session timeout
const termCodeCache = new Map(); // normalized label -> { code, expires }
const sessionCache = new Map(); // termCode -> { cookie, expires }

// Banner's searchResults endpoint cross-contaminates under concurrent requests
// on the same session cookie (one request's response can carry a different
// request's data). Rather than chase Banner's exact session semantics, just
// never let two searchResults calls on the same cookie be in flight at once.
const cookieLocks = new Map(); // cookie -> tail of the queue for that session

function withCookieLock(cookie, fn) {
  const prior = cookieLocks.get(cookie) || Promise.resolve();
  const settled = prior.catch(() => {});
  const run = settled.then(fn);
  const tracked = run.catch(() => {});
  cookieLocks.set(cookie, tracked);
  // Sessions get replaced when they expire, so without this cleanup each
  // retired cookie would leave a dead entry here forever.
  tracked.finally(() => { if (cookieLocks.get(cookie) === tracked) cookieLocks.delete(cookie); });
  return run;
}

export async function resolveTermCode(termLabel) {
  const label = String(termLabel || "").trim();
  if (!label) return null;
  if (/^\d{6}$/.test(label)) return label;

  const normalize = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const cacheKey = normalize(label);
  const cached = termCodeCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.code;

  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?offset=1&max=50&searchTerm=${encodeURIComponent(label)}`;
  const response = await fetch(url, { headers: bannerHeaders("application/json, text/javascript, */*; q=0.01") });
  if (!response.ok) { await response.text().catch(() => {}); return null; }
  const terms = await response.json();
  if (!Array.isArray(terms)) return null;

  const target = cacheKey;
  const exact = terms.find((t) => normalize(t.description) === target);
  const loose = exact ? null : terms.find((t) => normalize(t.description).includes(target) || target.includes(normalize(t.description)));
  const found = exact || loose;
  if (!found) return null;

  termCodeCache.set(cacheKey, { code: found.code, expires: Date.now() + TERM_CODE_TTL_MS });
  return found.code;
}

let termListCache = null; // { terms: [{code, description}], expires }

// Raw list of terms UTM's registration system currently offers (newest
// first), for populating a term picker. Descriptions still carry Banner's
// "(View Only)" suffix here; callers that display these should strip it.
export async function listTermsRaw() {
  if (termListCache && termListCache.expires > Date.now()) return termListCache.terms;

  const url = "https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?offset=1&max=20&searchTerm=";
  const response = await fetch(url, { headers: bannerHeaders("application/json, text/javascript, */*; q=0.01") });
  if (!response.ok) { await response.text().catch(() => {}); return []; }
  const terms = await response.json();
  if (!Array.isArray(terms)) return [];

  termListCache = { terms, expires: Date.now() + TERM_CODE_TTL_MS };
  return terms;
}

function cookieFromResponse(response) {
  const raw = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie")].filter(Boolean);
  return raw.map((c) => c.split(";")[0]).join("; ");
}

async function openFreshSearchSession(termCode) {
  const base = "https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb";
  const common = { "User-Agent": "Mozilla/5.0" };

  const page = await fetch(`${base}/classSearch/classSearch?term=${encodeURIComponent(termCode)}`, {
    headers: common,
    redirect: "follow",
  });
  await page.text().catch(() => {});
  const cookie = cookieFromResponse(page);
  if (!cookie) return null;

  const withCookie = { ...common, Cookie: cookie };

  const termSelect = await fetch(`${base}/term/search?mode=search`, {
    method: "POST",
    headers: { ...withCookie, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ term: termCode }).toString(),
  });
  await termSelect.text().catch(() => {});

  const reset = await fetch(`${base}/classSearch/resetDataForm`, {
    method: "POST",
    headers: withCookie,
  });
  await reset.text().catch(() => {});

  return cookie;
}

// Banner's class search is anonymous but stateful: a session has to be opened
// and pointed at a term before searchResults returns anything. Opening one
// costs three round trips, so we keep one per term instead of redoing it per
// keystroke.
//
// cacheKey defaults to termCode, but callers that would otherwise share a
// session with unrelated concurrent searches (notably the bulk catalog
// warm-up) pass a distinct key, since sharing let an unfiltered bulk request
// return wrong results for a filtered one racing it on the same cookie.
//
// In-flight opens for the same cacheKey, so concurrent callers await one
// shared open instead of each starting their own cookie.
const sessionOpening = new Map();

async function openSearchSession(termCode, { cacheKey = termCode } = {}) {
  const cached = sessionCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.cookie;

  if (sessionOpening.has(cacheKey)) return sessionOpening.get(cacheKey);

  const opening = (async () => {
    const cookie = await openFreshSearchSession(termCode);
    if (cookie) sessionCache.set(cacheKey, { cookie, expires: Date.now() + SESSION_TTL_MS });
    return cookie;
  })();

  sessionOpening.set(cacheKey, opening);
  try {
    return await opening;
  } finally {
    sessionOpening.delete(cacheKey);
  }
}

// Returns null (not []) when the request itself failed, so the caller can
// tell "Banner said no results" apart from "this session is dead".
async function searchSections(termCode, cookie, { subject, courseNumber } = {}) {
  const base = "https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb";
  // 500 is Banner's own per-page maximum. At 100, big subjects were cut off:
  // MATH has 167 sections, so only 6 of its 18 courses ever showed up.
  const params = new URLSearchParams({
    txt_term: termCode,
    pageOffset: "0",
    pageMaxSize: "500",
  });
  if (subject) params.set("txt_subject", subject);
  if (courseNumber) params.set("txt_courseNumber", courseNumber);

  return withCookieLock(cookie, async () => {
    try {
      // Banner remembers a session's previous search: without this reset, a
      // POSC search on a session that already searched CSCI returns CSCI's
      // rows again. One reset is still far cheaper than a fresh 3-request
      // session handshake.
      const reset = await fetch(`${base}/classSearch/resetDataForm`, {
        method: "POST",
        headers: { ...bannerHeaders("application/json, text/javascript, */*; q=0.01"), Cookie: cookie },
      });
      await reset.text().catch(() => {});
      if (!reset.ok) return null;

      const response = await fetch(`${base}/searchResults/searchResults?${params.toString()}`, {
        headers: { ...bannerHeaders("application/json, text/javascript, */*; q=0.01"), Cookie: cookie },
      });
      if (!response.ok) { await response.text().catch(() => {}); return null; }
      const json = await response.json();
      return Array.isArray(json?.data) ? json.data : null;
    } catch {
      return null; // network error or a non-JSON page (expired session)
    }
  });
}

// Reuses the term's cached session (reset before each search, serialized by
// the cookie lock). If that session fails or comes back empty, it may have
// expired, so it's dropped and the search is retried once on a fresh one -
// a dead session can't hand back stale or empty results.
export async function searchTerm(termCode, filters) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const cookie = await openSearchSession(termCode);
    if (!cookie) return [];
    const rows = await searchSections(termCode, cookie, filters);
    if (rows && (rows.length || attempt === 1)) return rows;
    if (sessionCache.get(termCode)?.cookie === cookie) sessionCache.delete(termCode);
  }
  return [];
}

// A full term's worth of sections, paged (Banner caps pageMaxSize at 500
// server-side). Used by the client-side cache "warm up" pass: no filter,
// just raw pagination so later keystroke lookups hit cache instead of Banner.
export async function fetchCatalogPage(termCode, { pageOffset = 0, pageMaxSize = 500 } = {}) {
  // Isolated session namespace - see the comment on openSearchSession for why.
  const cookie = await openSearchSession(termCode, { cacheKey: `${termCode}:bulk` });
  if (!cookie) return { rows: [], totalCount: 0 };

  const params = new URLSearchParams({
    txt_term: termCode,
    pageOffset: String(pageOffset),
    pageMaxSize: String(pageMaxSize),
  });
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?${params.toString()}`;
  // Same cookie lock as searchSections - concurrent requests on one session
  // cross-contaminate even when they only differ by pageOffset, so warm-up
  // pages run serialized instead of parallel.
  return withCookieLock(cookie, async () => {
    const response = await fetch(url, { headers: { ...bannerHeaders("application/json, text/javascript, */*; q=0.01"), Cookie: cookie } });
    if (!response.ok) { await response.text().catch(() => {}); return { rows: [], totalCount: 0 }; }
    const json = await response.json();
    return { rows: Array.isArray(json?.data) ? json.data : [], totalCount: json?.totalCount || 0 };
  });
}

// Returns the full matched search-result row (not just the CRN) so callers
// can also pull faculty info etc. off it without a second request.
export async function findSectionRow(termCode, subject, courseNumber, section) {
  const rows = await searchTerm(termCode, { subject, courseNumber });
  const normalizedSection = String(section || "").trim().toUpperCase();
  return rows.find((r) => String(r.sequenceNumber || "").trim().toUpperCase() === normalizedSection) || null;
}

// The catalog (not section-specific) course description. Separate endpoint
// from the search results, keyed by subject+courseNumber+term rather than a
// CRN, and independent of which section is picked.
export async function fetchCourseDescription(termCode, subject, courseNumber) {
  const url = "https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/courseSearchResults/getCourseDescription";
  const body = new URLSearchParams({ term: termCode, subjectCode: subject, courseNumber }).toString();
  const response = await fetch(url, {
    method: "POST",
    headers: { ...bannerHeaders("text/html, */*; q=0.01"), "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body,
  });
  if (!response.ok) { await response.text().catch(() => {}); return null; }
  const html = await response.text();
  const termCodeParen = /\(\s*[A-Za-z][A-Za-z.,\s]{0,20}\)/;
  let text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    // Catalog convention prefixes the credit hours in parens, e.g. "(3) ...";
    // that's already shown as its own field, so drop it here.
    .replace(/^\(\s*\d+(?:\s*-\s*\d+)?\s*\)\s*/, "");
  // Catalog also brackets which terms it's offered in, e.g. "(F, Sp)" —
  // can appear right after the credit-hour parens, or at the very end.
  text = text.replace(new RegExp(`^${termCodeParen.source}\\s*`), "");
  text = text.replace(new RegExp(`\\s*${termCodeParen.source}\\s*$`), "");
  if (!text || /no course description is available/i.test(text)) return null;
  return text;
}
