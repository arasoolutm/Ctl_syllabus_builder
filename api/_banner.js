// Helpers for talking to UTM's Banner "Browse Classes" pages.

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

// These caches stick around for as long as the server runs, so repeat lookups are fast.
const TERM_CODE_TTL_MS = 60 * 60 * 1000; // term list barely changes
const SESSION_TTL_MS = 8 * 60 * 1000; // a bit under Banner's own timeout
const termCodeCache = new Map(); // normalized label -> { code, expires }
const sessionCache = new Map(); // termCode -> { cookie, expires }

// Banner mixes up results if two searches run on the same session at once,
// so searches on a session wait their turn.
const cookieLocks = new Map(); // cookie -> its queue

function withCookieLock(cookie, fn) {
  const prior = cookieLocks.get(cookie) || Promise.resolve();
  const settled = prior.catch(() => {});
  const run = settled.then(fn);
  const tracked = run.catch(() => {});
  cookieLocks.set(cookie, tracked);
  // clean up so old cookies don't pile up
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

// Terms Banner has right now, newest first.
// Names still end in "(View Only)", so strip that before showing them.
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

// Banner needs a session set to a term before it'll search, and opening one
// takes 3 requests, so we keep one per term and reuse it.
// The warm-up uses its own session (cacheKey) so it can't mess up normal searches.
// If two requests open the same session at the same time, they share it.
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

// Returns null if the request failed, [] if there were just no results.
async function searchSections(termCode, cookie, { subject, courseNumber } = {}) {
  const base = "https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb";
  // 500 is Banner's max. At 100, big subjects got cut off (MATH showed 6 of 18 courses).
  const params = new URLSearchParams({
    txt_term: termCode,
    pageOffset: "0",
    pageMaxSize: "500",
  });
  if (subject) params.set("txt_subject", subject);
  if (courseNumber) params.set("txt_courseNumber", courseNumber);

  return withCookieLock(cookie, async () => {
    try {
      // Banner remembers the last search on a session, so reset first or you get
      // the old results back (searching POSC after CSCI gave CSCI).
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
      return null; // network error or expired session
    }
  });
}

// Searches using the term's saved session. If it fails or comes back empty,
// the session might be expired, so it tries once more with a new one.
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

// One page of every section in a term. Only used by the warm-up.
export async function fetchCatalogPage(termCode, { pageOffset = 0, pageMaxSize = 500 } = {}) {
  // separate session from normal searches
  const cookie = await openSearchSession(termCode, { cacheKey: `${termCode}:bulk` });
  if (!cookie) return { rows: [], totalCount: 0 };

  const params = new URLSearchParams({
    txt_term: termCode,
    pageOffset: String(pageOffset),
    pageMaxSize: String(pageMaxSize),
  });
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?${params.toString()}`;
  // one page at a time, same reason as searches
  return withCookieLock(cookie, async () => {
    const response = await fetch(url, { headers: { ...bannerHeaders("application/json, text/javascript, */*; q=0.01"), Cookie: cookie } });
    if (!response.ok) { await response.text().catch(() => {}); return { rows: [], totalCount: 0 }; }
    const json = await response.json();
    return { rows: Array.isArray(json?.data) ? json.data : [], totalCount: json?.totalCount || 0 };
  });
}

// Returns the whole row so callers can grab the instructor too.
export async function findSectionRow(termCode, subject, courseNumber, section) {
  const rows = await searchTerm(termCode, { subject, courseNumber });
  const normalizedSection = String(section || "").trim().toUpperCase();
  return rows.find((r) => String(r.sequenceNumber || "").trim().toUpperCase() === normalizedSection) || null;
}

// Course description from the catalog. Only needs subject + number, not a section.
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
    // drop the credit hours at the start, e.g. "(3) ...", we show those separately
    .replace(/^\(\s*\d+(?:\s*-\s*\d+)?\s*\)\s*/, "");
  // drop which terms it's offered, e.g. "(F, Sp)", at the start or end
  text = text.replace(new RegExp(`^${termCodeParen.source}\\s*`), "");
  text = text.replace(new RegExp(`\\s*${termCodeParen.source}\\s*$`), "");
  if (!text || /no course description is available/i.test(text)) return null;
  return text;
}
