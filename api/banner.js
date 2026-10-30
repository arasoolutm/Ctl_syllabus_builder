import { SUBJECT_CODES } from "../src/subjectCodes.js";
import { bannerHeaders, resolveTermCode, findSectionRow, fetchCourseDescription, searchWithRetry, decodeEntities, listTermsRaw, fetchCatalogPage } from "./_banner.js";

function formatInstructorName(displayName) {
  if (!displayName) return "";
  const match = displayName.match(/^([^,]+),\s*([^(]+?)(?:\s*\(([^)]+)\))?$/);
  if (!match) return decodeEntities(displayName);
  const last = match[1].trim();
  const preferred = match[3]?.trim();
  const firstWord = match[2].trim().split(/\s+/)[0];
  return decodeEntities(`${preferred || firstWord} ${last}`);
}

function primaryFaculty(faculty) {
  return (Array.isArray(faculty) && (faculty.find((f) => f.primaryIndicator) || faculty[0])) || null;
}

/* ---------- shared text helpers ---------- */

function cleanText(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .replace(/^\s*:\s*/, "")
    .trim();
}

/* ---------- action=details: resolve a CRN (directly, or via subject +
   courseNumber + section) to the full set of syllabus fields ---------- */

function extractMappedText(html, label) {
  const text = cleanText(html)
    .replace(/\s*:\s*/g, ":")
    .replace(/\s+/g, " ");
  const labels = [
    "Associated Term", "CRN", "Subject", "Course Number", "Title",
    "Section Number", "Credit Hours", "Schedule Type", "Instructional Method",
  ];
  const nextLabel = labels.filter((candidate) => candidate !== label)
    .map((candidate) => candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const match = text.match(new RegExp(`${label}\\s*:?\\s*(.*?)\\s*(?=${nextLabel}|$)`, "i"));
  return match ? match[1].replace(/^:/, "").trim() : "";
}

function subjectCode(subject) {
  if (SUBJECT_CODES[subject]) return SUBJECT_CODES[subject];
  const initials = subject.match(/[A-Za-z]+/g)?.map((word) => word[0]).join("") || "";
  return initials.toUpperCase();
}

function normalizeCourseNumber(value) {
  return value.match(/\b\d{3,4}[A-Z]?\b/i)?.[0]?.toUpperCase() || value.trim();
}

function parseClassDetailsHtml(html) {
  if (!html || !/\bCRN\b/i.test(html)) return null;

  const subject = extractMappedText(html, "Subject");
  const courseNumber = extractMappedText(html, "Course Number");
  const title = extractMappedText(html, "Title");
  const crn = extractMappedText(html, "CRN");
  const term = extractMappedText(html, "Associated Term");
  const section = extractMappedText(html, "Section Number");
  const credits = extractMappedText(html, "Credit Hours");
  const scheduleType = extractMappedText(html, "Schedule Type");
  const instructionalMethod = extractMappedText(html, "Instructional Method");

  const data = {
    crn: String(crn || "").replace(/[^0-9]/g, "") || "",
    code: [subjectCode(subject), normalizeCourseNumber(courseNumber)].filter(Boolean).join(" ") || "",
    title: title || "",
    section: section || "",
    term: term || "",
    credits: String(credits || "").replace(/[^0-9.]/g, "").replace(/\.$/, "") || "",
    modality: [scheduleType, instructionalMethod].filter(Boolean).join(" / ") || "",
    meeting: "",
    location: "",
  };

  return data.crn && data.title ? data : null;
}

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_NAMES = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
  friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

function joinWithAnd(items) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function clockParts(hhmm) {
  const hh = parseInt(hhmm.slice(0, 2), 10);
  const mm = hhmm.slice(2, 4);
  const period = hh >= 12 ? "p.m." : "a.m.";
  let h12 = hh % 12;
  if (h12 === 0) h12 = 12;
  return { label: mm === "00" ? String(h12) : `${h12}:${mm}`, period };
}

function formatMeetingRange(beginTime, endTime) {
  const b = clockParts(beginTime);
  const e = clockParts(endTime);
  const bLabel = b.period === e.period ? b.label : `${b.label} ${b.period}`;
  return `${bLabel} to ${e.label} ${e.period}`;
}

function isPhysicalMeeting(mt) {
  return Boolean(mt.building) && !/^(onl|web|tba)/i.test(mt.building);
}

function formatMeetingEntry(mt) {
  const days = DAY_KEYS.filter((k) => mt[k]).map((k) => DAY_NAMES[k]);
  if (!days.length || !mt.beginTime || !mt.endTime) return null;
  return `${joinWithAnd(days)}, ${formatMeetingRange(mt.beginTime, mt.endTime)}`;
}

function locationFromMeeting(mt) {
  return [mt.buildingDescription || mt.building, mt.room].filter(Boolean).join(" ").trim();
}

function deriveModality(fmt) {
  const meetingTimes = (Array.isArray(fmt) ? fmt : []).map((f) => f.meetingTime).filter(Boolean);
  if (!meetingTimes.length) return "Online asynchronous";
  const physicalFlags = meetingTimes.map(isPhysicalMeeting);
  if (physicalFlags.every(Boolean)) return "In person";
  if (physicalFlags.every((f) => !f)) {
    const hasTimes = meetingTimes.some((mt) => mt.beginTime && mt.endTime);
    return hasTimes ? "Online synchronous" : "Online asynchronous";
  }
  return "Hybrid";
}

function parseFacultyMeetingTimes(json) {
  const fmt = json?.fmt || [];
  const meetingTimes = fmt.map((f) => f.meetingTime).filter(Boolean);
  const meeting = meetingTimes.map(formatMeetingEntry).filter(Boolean).join("; ");
  const location = [...new Set(meetingTimes.map(locationFromMeeting).filter(Boolean))].join("; ");
  return { meeting, location, modality: deriveModality(fmt) };
}

function parseSectionCatalogDetails(html) {
  const match = html.match(/Department:<\/span>\s*<span>([^<]*)<\/span>/i);
  if (!match) return null;
  const raw = cleanText(match[1]);
  const split = raw.match(/^(.*\S)\s+([A-Z]{2,6})$/);
  const name = split ? split[1].trim() : raw.trim();
  return name ? `Department of ${name}` : null;
}

function parseSectionPrerequisites(html) {
  const text = cleanText(html).replace(/^Catalog Prerequisites\s*/i, "").trim();
  if (!text) return null;
  return /no prerequisite information available/i.test(text) ? "None" : text;
}

async function fetchFacultyMeetingTimes(term, crn) {
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getFacultyMeetingTimes?term=${encodeURIComponent(term)}&courseReferenceNumber=${encodeURIComponent(crn)}`;
  const response = await fetch(url, { headers: bannerHeaders("application/json, text/javascript, */*; q=0.01") });
  if (!response.ok) { await response.text().catch(() => {}); return null; }
  return parseFacultyMeetingTimes(await response.json());
}

async function fetchSectionCatalogDetails(term, crn) {
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getSectionCatalogDetails?term=${encodeURIComponent(term)}&courseReferenceNumber=${encodeURIComponent(crn)}`;
  const response = await fetch(url, { headers: bannerHeaders("text/html, */*; q=0.01") });
  if (!response.ok) { await response.text().catch(() => {}); return null; }
  return parseSectionCatalogDetails(await response.text());
}

async function fetchSectionPrerequisites(term, crn) {
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getSectionPrerequisites?term=${encodeURIComponent(term)}&courseReferenceNumber=${encodeURIComponent(crn)}`;
  const response = await fetch(url, { headers: bannerHeaders("text/html, */*; q=0.01") });
  if (!response.ok) { await response.text().catch(() => {}); return null; }
  return parseSectionPrerequisites(await response.text());
}

async function handleDetails(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { term, courseReferenceNumber, subject, courseNumber, section } = req.body || {};
    if (!term || (!courseReferenceNumber && !(subject && courseNumber && section))) {
      return res.status(400).json({ error: "term and either courseReferenceNumber, or subject/courseNumber/section, are required" });
    }

    const termCode = await resolveTermCode(term);
    if (!termCode) {
      return res.status(404).json({ error: `Could not find "${term}" in the registration system's term list` });
    }

    let crn = courseReferenceNumber ? String(courseReferenceNumber) : null;
    let faculty = null;
    if (!crn) {
      const row = await findSectionRow(termCode, subject, courseNumber, section);
      if (!row) {
        return res.status(404).json({ error: `No section ${section} found for ${subject} ${courseNumber} in that term` });
      }
      crn = row.courseReferenceNumber;
      faculty = row.faculty;
    }

    const formBody = new URLSearchParams({
      term: termCode,
      courseReferenceNumber: crn,
      first: "first",
    }).toString();

    const [response, meetingInfo, dept, prereq, description] = await Promise.all([
      fetch("https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getClassDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          ...bannerHeaders("text/html, */*; q=0.01"),
        },
        body: formBody,
      }),
      fetchFacultyMeetingTimes(termCode, crn).catch(() => null),
      fetchSectionCatalogDetails(termCode, crn).catch(() => null),
      fetchSectionPrerequisites(termCode, crn).catch(() => null),
      (subject && courseNumber) ? fetchCourseDescription(termCode, subject, courseNumber).catch(() => null) : null,
    ]);

    const html = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ error: `Portal request failed with status ${response.status}` });
    }
    const data = parseClassDetailsHtml(html);

    if (!data) {
      return res.status(404).json({ error: "No class data found for that CRN" });
    }

    if (meetingInfo) {
      if (meetingInfo.meeting) data.meeting = meetingInfo.meeting;
      if (meetingInfo.location) data.location = meetingInfo.location;
      if (meetingInfo.modality) data.modality = meetingInfo.modality;
    }
    if (dept) data.dept = dept;
    if (prereq) data.prereq = prereq;
    if (description) data.description = description;

    const primary = primaryFaculty(faculty);
    if (primary?.displayName) data.instructor = formatInstructorName(primary.displayName);
    if (primary?.emailAddress) data.email = primary.emailAddress;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch class details" });
  }
}

/* ---------- action=course-search: live autocomplete for the course-code
   field (exact subject + optional course-number prefix -> matching
   courses, deduped across sections) ---------- */

async function handleCourseSearch(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { term, subject, q } = req.query || {};
    if (!term || !subject) {
      return res.status(400).json({ error: "term and subject are required" });
    }

    const termCode = await resolveTermCode(term);
    if (!termCode) {
      return res.status(404).json({ error: `Could not find "${term}" in the registration system's term list` });
    }

    const rows = await searchWithRetry(termCode, { subject: String(subject).toUpperCase() });

    const numberPrefix = String(q || "").trim().toUpperCase();
    const seen = new Map();
    for (const row of rows) {
      const num = String(row.courseNumber || "").toUpperCase();
      if (numberPrefix && !num.startsWith(numberPrefix)) continue;
      const code = `${row.subject} ${row.courseNumber}`;
      if (!seen.has(code)) seen.set(code, { code, title: decodeEntities(row.courseTitle) });
    }

    const courses = [...seen.values()].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Course search failed" });
  }
}

/* ---------- action=section-search: live list of real sections (with
   instructor + meeting time) for a known subject + course number ---------- */

const SECTION_DAY_ABBR = [
  ["monday", "M"], ["tuesday", "T"], ["wednesday", "W"],
  ["thursday", "Th"], ["friday", "F"], ["saturday", "Sat"], ["sunday", "Sun"],
];

function sectionClockLabel(hhmm) {
  if (!hhmm || hhmm.length < 4) return "";
  const hh = parseInt(hhmm.slice(0, 2), 10);
  const mm = hhmm.slice(2, 4);
  const period = hh >= 12 ? "pm" : "am";
  let h12 = hh % 12;
  if (h12 === 0) h12 = 12;
  return mm === "00" ? `${h12}${period}` : `${h12}:${mm}${period}`;
}

function summarizeMeeting(meetingsFaculty) {
  const mt = meetingsFaculty?.[0]?.meetingTime;
  if (!mt) return "Online / TBA";
  const days = SECTION_DAY_ABBR.filter(([key]) => mt[key]).map(([, abbr]) => abbr).join("");
  if (!days || !mt.beginTime) return "Online / asynchronous";
  return `${days} ${sectionClockLabel(mt.beginTime)}-${sectionClockLabel(mt.endTime)}`;
}

function summarizeInstructor(faculty) {
  const primary = (Array.isArray(faculty) && (faculty.find((f) => f.primaryIndicator) || faculty[0])) || null;
  if (!primary?.displayName) return "Staff";
  return decodeEntities(primary.displayName.split(",")[0].trim());
}

async function handleSectionSearch(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { term, subject, courseNumber } = req.query || {};
    if (!term || !subject || !courseNumber) {
      return res.status(400).json({ error: "term, subject, and courseNumber are required" });
    }

    const termCode = await resolveTermCode(term);
    if (!termCode) {
      return res.status(404).json({ error: `Could not find "${term}" in the registration system's term list` });
    }

    const rows = await searchWithRetry(termCode, {
      subject: String(subject).toUpperCase(),
      courseNumber: String(courseNumber).toUpperCase(),
    });

    const sections = rows
      .map((r) => ({
        section: r.sequenceNumber,
        crn: r.courseReferenceNumber,
        instructor: summarizeInstructor(r.faculty),
        meeting: summarizeMeeting(r.meetingsFaculty),
        seatsAvailable: r.seatsAvailable,
      }))
      .sort((a, b) => a.section.localeCompare(b.section, undefined, { numeric: true }));

    return res.status(200).json({ sections });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Section search failed" });
  }
}

/* ---------- action=catalog-page: one raw, unfiltered page of a term's
   entire section list (Banner caps pages at 500 rows), shaped the same way
   as course-search/section-search so the client can drop it straight into
   its autocomplete caches. Paging through every page this way "warms" the
   client cache for the whole catalog instead of per-keystroke. ---------- */

async function handleCatalogPage(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { term, offset, size } = req.query || {};
    if (!term) {
      return res.status(400).json({ error: "term is required" });
    }

    const termCode = await resolveTermCode(term);
    if (!termCode) {
      return res.status(404).json({ error: `Could not find "${term}" in the registration system's term list` });
    }

    const pageOffset = Math.max(0, parseInt(offset, 10) || 0);
    const pageMaxSize = Math.min(500, Math.max(1, parseInt(size, 10) || 500));
    const { rows, totalCount } = await fetchCatalogPage(termCode, { pageOffset, pageMaxSize });

    const courseMap = new Map(); // code -> title
    const sectionsByCode = {};
    for (const row of rows) {
      const code = `${row.subject} ${row.courseNumber}`;
      if (!courseMap.has(code)) courseMap.set(code, decodeEntities(row.courseTitle));
      (sectionsByCode[code] ||= []).push({
        section: row.sequenceNumber,
        crn: row.courseReferenceNumber,
        instructor: summarizeInstructor(row.faculty),
        meeting: summarizeMeeting(row.meetingsFaculty),
        seatsAvailable: row.seatsAvailable,
      });
    }
    const courses = [...courseMap.entries()].map(([code, title]) => ({ code, title }));

    return res.status(200).json({ totalCount, courses, sectionsByCode });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Catalog page fetch failed" });
  }
}

/* ---------- action=terms: real terms UTM's registration system currently
   offers, for the Term field's picker ---------- */

async function handleTerms(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const raw = await listTermsRaw();
    const terms = raw
      .map((t) => String(t.description || "").replace(/\s*\(View Only\)\s*$/i, "").trim())
      .filter(Boolean)
      .slice(0, 8); // newest-first; a handful of recent + upcoming terms is plenty for a picker
    return res.status(200).json({ terms });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Could not load terms" });
  }
}

/* ---------- dispatch ---------- */

export default async function handler(req, res) {
  const action = req.query?.action;
  if (action === "course-search") return handleCourseSearch(req, res);
  if (action === "section-search") return handleSectionSearch(req, res);
  if (action === "details") return handleDetails(req, res);
  if (action === "terms") return handleTerms(req, res);
  if (action === "catalog-page") return handleCatalogPage(req, res);
  return res.status(400).json({ error: "Unknown or missing action" });
}
