const SUBJECT_CODES = {
  "African American Studies": "AAST",
  Accounting: "ACCT",
  "Agricultural Economics": "AGEC",
  "Agricultural Education": "AGED",
  "Agricultural Engineering Technology": "AGET",
  Agriculture: "AGRI",
  "Animal Science": "ANSC",
  Art: "ART",
  "Art Education": "ARTE",
  "Art History": "ARTH",
  Astronomy: "ASTR",
  "Athletic Training": "ATRN",
  Biochemistry: "BCHE",
  Biology: "BIOL",
  "Business Communication": "BCOM",
  "Business Education": "BUED",
  "Business Law": "BLAW",
  Botany: "BOT",
  "Career and Technical Education": "CTE",
  Chemistry: "CHEM",
  "Child and Family Studies": "CFS",
  "Construction Management": "CMGT",
  "Consumer Resource Management": "CRMG",
  Counseling: "COUN",
  "Criminal Justice": "CJ",
  Cybersecurity: "CYBR",
  Dance: "DANC",
  "Dance Education": "DNED",
  "Driver Safety Education": "DSED",
  "Early Childhood Education": "ECED",
  Economics: "ECON",
  "Educational Foundations": "EDFN",
  "Educational Studies": "EDST",
  "Elementary Education": "ELED",
  Engineering: "ENGR",
  "Engineering, Civil": "CIEG",
  English: "ENGL",
  "Exercise Science": "EXSC",
  "Family and Consumer Sciences": "FCS",
  "Family and Consumer Sciences Education": "FCSE",
  "Fashion Merchandising": "FASH",
  "Fellows Research Program": "FRP",
  Finance: "FIN",
  "Fine Arts": "FA",
  "Food Science": "FSCI",
  "Food Service Management": "FSMG",
  "Food Systems Management": "FSVC",
  French: "FREN",
  "General Studies": "GENS",
  Geography: "GEOG",
  Geology: "GEOL",
  Geoscience: "GEOS",
  German: "GERM",
  Gerontology: "GERO",
  "Graphic Design": "GDES",
  Greek: "GREK",
  Health: "HLTH",
  "Health and Human Performance": "HHP",
  "Health and Physical Education": "HPED",
  History: "HIST",
  Honors: "HNRS",
  "Hospitality Management": "HPMG",
  "Human Learning": "HLRN",
  "Human Performance": "HPER",
  "Information Systems": "INFS",
  "Interdisciplinary Studies": "IDST",
  "International Studies": "INST",
  Japanese: "JAPN",
  Leadership: "LDSP",
  "Library Studies": "LIBS",
  Management: "MGT",
  Marketing: "MKTG",
  "Mass Media and Strategic Communication": "MMSC",
  Mathematics: "MATH",
  Meteorology: "METR",
  Microbiology: "MBIO",
  "Military Science and Leadership": "MSL",
  Music: "MUS",
  "Music, Applied": "MUAP",
  "Music Education": "MUED",
  "Music Ensembles": "MUEN",
  "Natural Resources Management": "NRM",
  Neuroscience: "NEUR",
  Nursing: "NURS",
  Nutrition: "NUTR",
  "Park Administration": "PARK",
  Philosophy: "PHIL",
  "Physical Activity": "PACT",
  Physics: "PHYS",
  "Plant Science": "PLSC",
  "Political Science": "POSC",
  Portuguese: "PORT",
  Psychology: "PSYC",
  Reading: "READ",
  "Religious Studies": "RLST",
  "Science, Technology, Engineering, Mathematics": "STEM",
  "Secondary Education": "SEDU",
  Sociology: "SOC",
  "Social Work": "SWRK",
  "Soil Science": "SOIL",
  Spanish: "SPAN",
  "Special Education": "SPED",
  "Sport Business": "SPMG",
  Statistics: "STAT",
  "Sustainability Studies": "SUST",
  "Teacher Education": "TCED",
  Theatre: "THEA",
  "Veterinary Health Technology": "VET",
  "Wildlife Biology": "WBIO",
  "Women's and Gender Studies": "WMST",
  "Women’s and Gender Studies": "WMST",
  Zoology: "ZOOL",
  "Computer Science": "CSCI",
};

function cleanText(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .replace(/^\s*:\s*/, "")
    .trim();
}

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

function bannerHeaders(accept) {
  return {
    Accept: accept,
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0",
    ...(process.env.UTM_COOKIE ? { Cookie: process.env.UTM_COOKIE } : {}),
  };
}

async function fetchFacultyMeetingTimes(term, crn) {
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getFacultyMeetingTimes?term=${encodeURIComponent(term)}&courseReferenceNumber=${encodeURIComponent(crn)}`;
  const response = await fetch(url, { headers: bannerHeaders("application/json, text/javascript, */*; q=0.01") });
  if (!response.ok) return null;
  return parseFacultyMeetingTimes(await response.json());
}

async function fetchSectionCatalogDetails(term, crn) {
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getSectionCatalogDetails?term=${encodeURIComponent(term)}&courseReferenceNumber=${encodeURIComponent(crn)}`;
  const response = await fetch(url, { headers: bannerHeaders("text/html, */*; q=0.01") });
  if (!response.ok) return null;
  return parseSectionCatalogDetails(await response.text());
}

async function fetchSectionPrerequisites(term, crn) {
  const url = `https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getSectionPrerequisites?term=${encodeURIComponent(term)}&courseReferenceNumber=${encodeURIComponent(crn)}`;
  const response = await fetch(url, { headers: bannerHeaders("text/html, */*; q=0.01") });
  if (!response.ok) return null;
  return parseSectionPrerequisites(await response.text());
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { term, courseReferenceNumber } = req.body || {};
    if (!term || !courseReferenceNumber) {
      return res.status(400).json({ error: "term and courseReferenceNumber are required" });
    }

    const formBody = new URLSearchParams({
      term: String(term),
      courseReferenceNumber: String(courseReferenceNumber),
      first: "first",
    }).toString();

    const response = await fetch("https://ban9ssb1.utm.edu/StudentRegistrationSsb/ssb/searchResults/getClassDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        ...bannerHeaders("text/html, */*; q=0.01"),
      },
      body: formBody,
    });

    const html = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ error: `Portal request failed with status ${response.status}` });
    }
    const data = parseClassDetailsHtml(html);

    if (!data) {
      return res.status(404).json({ error: "No class data found for that CRN" });
    }

    const [meetingInfo, dept, prereq] = await Promise.all([
      fetchFacultyMeetingTimes(term, courseReferenceNumber).catch(() => null),
      fetchSectionCatalogDetails(term, courseReferenceNumber).catch(() => null),
      fetchSectionPrerequisites(term, courseReferenceNumber).catch(() => null),
    ]);

    if (meetingInfo) {
      if (meetingInfo.meeting) data.meeting = meetingInfo.meeting;
      if (meetingInfo.location) data.location = meetingInfo.location;
      if (meetingInfo.modality) data.modality = meetingInfo.modality;
    }
    if (dept) data.dept = dept;
    if (prereq) data.prereq = prereq;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch class details" });
  }
}
