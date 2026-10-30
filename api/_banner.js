// Shared helpers for talking to UTM's public (anonymous, no student login
// involved) Banner 9 Self-Service "Browse Classes" endpoints. Used by both
// class-details.js (resolve a CRN to full section info) and
// course-search.js (live autocomplete).

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

// Module-scope caches. A Vercel function instance stays warm between
// requests, so these persist across the many back-to-back lookups a single
// person typing in the form generates, turning a ~2s multi-request Banner
// round trip into a single fast call after the first one.
const TERM_CODE_TTL_MS = 60 * 60 * 1000; // term list barely changes
const SESSION_TTL_MS = 8 * 60 * 1000; // conservative vs Banner's actual session timeout
const termCodeCache = new Map(); // normalized label -> { code, expires }
const sessionCache = new Map(); // termCode -> { cookie, expires }

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

// Banner's class search is anonymous but stateful: a search session has to
// be opened and pointed at a term before searchResults will return anything
// for that term. Opening one costs three sequential round trips to UTM's
// server, so we keep it around (per warm function instance) instead of
// redoing it for every keystroke.
export async function openSearchSession(termCode, { forceNew = false } = {}) {
  const cached = sessionCache.get(termCode);
  if (!forceNew && cached && cached.expires > Date.now()) return cached.cookie;

  const cookie = await openFreshSearchSession(termCode);
  if (!cookie) return null;

  sessionCache.set(termCode, { cookie, expires: Date.now() + SESSION_TTL_MS });
  return cookie;
}

export async function searchSections(termCode, cookie, { subject, courseNumber } = {}) {
  const params = new URLSearchParams({
    txt_term: termCode,
    pageOffset: "0",
    pageMaxSize: "100",
  });
  if (subject) params.set("txt_subject", subject);
  if (courseNumber) params.set("txt_courseNumber", courseNumber);

  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?${params.toString()}`;
  const response = await fetch(url, { headers: { ...bannerHeaders("application/json, text/javascript, */*; q=0.01"), Cookie: cookie } });
  if (!response.ok) { await response.text().catch(() => {}); return []; }
  const json = await response.json();
  return Array.isArray(json?.data) ? json.data : [];
}

// Runs a search using the cached session; if that session turns out to be
// stale (Banner silently returns nothing for a dead session) it retries once
// with a freshly opened one rather than failing outright.
export async function searchWithRetry(termCode, filters) {
  const cookie = await openSearchSession(termCode);
  if (!cookie) return [];
  const rows = await searchSections(termCode, cookie, filters);
  if (rows.length > 0 || !sessionCache.has(termCode)) return rows;

  const freshCookie = await openSearchSession(termCode, { forceNew: true });
  if (!freshCookie) return rows;
  return searchSections(termCode, freshCookie, filters);
}

// A full term's worth of sections, paged (Banner caps pageMaxSize at 500
// server-side regardless of what's requested). Used by the client-side
// cache "warm up" pass: no subject/course filter, just raw pagination
// through everything so later keystroke lookups hit cache instead of Banner.
export async function fetchCatalogPage(termCode, { pageOffset = 0, pageMaxSize = 500 } = {}) {
  const cookie = await openSearchSession(termCode);
  if (!cookie) return { rows: [], totalCount: 0 };

  const params = new URLSearchParams({
    txt_term: termCode,
    pageOffset: String(pageOffset),
    pageMaxSize: String(pageMaxSize),
  });
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?${params.toString()}`;
  const response = await fetch(url, { headers: { ...bannerHeaders("application/json, text/javascript, */*; q=0.01"), Cookie: cookie } });
  if (!response.ok) { await response.text().catch(() => {}); return { rows: [], totalCount: 0 }; }
  const json = await response.json();
  return { rows: Array.isArray(json?.data) ? json.data : [], totalCount: json?.totalCount || 0 };
}

// Returns the full matched search-result row (not just the CRN) so callers
// can also pull faculty info etc. off it without a second request.
export async function findSectionRow(termCode, subject, courseNumber, section) {
  const rows = await searchWithRetry(termCode, { subject, courseNumber });
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
