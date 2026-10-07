import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  BookOpen, User, MessageSquare, Target, Library, Scale, Gavel,
  ShieldCheck, CalendarDays, FileDown, Check, AlertTriangle, Plus, Trash2,
  Printer, Lock, Info, ChevronRight, FlaskConical
} from "lucide-react";

/* ============================================================
   UTM SYLLABUS BUILDER  ·  Center for Teaching and Learning
   Fill in the left. Watch the right. Export to Word or PDF.
   No accounts, no server, no stored data.
   commit branch check
   ============================================================ */

const LOGO = "data:image/png;base64,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";

const C = {
  navy: "#0B2240",      // UT Martin PMS 289
  orange: "#FF8300",    // UT Martin PMS 151
  ink: "#1a1a1a",
  slate: "#4A5568",
  line: "#D8DEE7",
  paper: "#FFFFFF",
  wash: "#F4F6F9",
  good: "#1E7A46",
  warn: "#B45309",
};

/* ---------- Institutional content maintained by CTL ---------- */

const SLO_PRIMER = `A student learning outcome describes what a student will be able to DO by the end of this course. It is not a list of what you will cover. That difference is the whole thing. "We will cover the causes of the Cold War" is a topic. "Students will evaluate competing explanations for the outbreak of the Cold War using primary sources" is an outcome, because you can point to a specific assignment that shows whether a student did it or not.

Three tests for a workable outcome:

1. Can you see it? Use verbs a person can observe: analyze, construct, evaluate, compare, design, defend, calculate, diagnose. Avoid understand, appreciate, know, and be familiar with. Nothing a student does can prove or disprove those.

2. Can you grade it? Every outcome should connect to at least one assignment, exam, project, or performance in this course. If nothing in your grade breakdown produces evidence for an outcome, then either the outcome or the assessment plan needs to change. This builder checks that for you.

3. Would a student recognize it? Outcomes are written for students, not for reviewers. A student reading the list should come away knowing what they are being asked to get good at.

Three to six outcomes is the usual range. Past that they stop working as a guide and start reading as a wall.

WHY THE GENERAL EDUCATION OUTCOMES ARE ALSO LISTED

If this course carries General Education credit, it is doing two jobs at once. It teaches your discipline, and it also delivers outcomes that belong to UTM's General Education curriculum as a whole. Those Gen Ed outcomes are what the university reports to SACSCOC and THEC as evidence that the curriculum actually works, and that evidence comes from courses like this one. Listing them next to your own outcomes does two useful things. It tells a student why this course satisfies a requirement they did not personally choose, and it tells the next person reviewing the program exactly where that requirement gets met.

You still write your own course outcomes. The Gen Ed set sits alongside them, not instead of them.

Delete this box once your outcomes are written. It is here to explain, not to print.`;

const OUTCOME_LIBRARY = [
  {
    group: "General Education · Social and Behavioral Sciences",
    note: "UTM General Education curriculum outcomes. Include verbatim if this course carries Gen Ed credit.",
    items: [
      "Students will describe the influence of geographic, political, economic, cultural, and/or family institutions on the individual and society.",
      "Students will explain the connection between social/behavioral science research and everyday life.",
      "Students will analyze key ethical issues as examined by the social/behavioral sciences.",
    ],
  },
  {
    group: "Program example · Political Science and Global Studies",
    note: "Shown as a worked example of program-level outcomes. CTL loads your department's set on request.",
    items: [
      "Describe political structures and processes, including those relating to elections, policy making, and policy implementation.",
      "Demonstrate an understanding of global political dynamics, encompassing an appreciation for the interconnectedness of international political, economic, and social activity.",
      "Produce a research project demonstrating analytical skills while applying contemporary methods of political science research.",
      "Write and present findings from an original research or critical thinking project.",
    ],
  },
];

const AI_POLICIES = {
  mixed: {
    label: "Mixed use · permitted on designated assignments",
    text: `In this course, students are permitted to use generative AI tools only for specific assignments, as designated by the instructor.

Understand tool limitations. AI tools may not always provide accurate or up-to-date information. They can draw on plagiarized sources and produce fictional citations. Treat anything they give you as a starting point for further research and verification, never as a finished answer.

Cite AI use. If you incorporate AI-generated information, cite it as "Generated using [AI tool]." Paraphrase and synthesize in your own words, and list the exact prompt you used as part of your citation.

Engage in original thought. AI tools supplement critical thinking and independent research. They do not replace them.

Respect academic integrity. All work must adhere to the academic integrity policies of this course and the university. Unpermitted use of AI is a form of academic misconduct under the UTM Student Code of Conduct.

Ask. If you are unsure whether a particular use is permitted, ask before you submit. That conversation is always easier before the fact than after.`,
  },
  open: {
    label: "Unrestricted use · AI permitted throughout",
    text: `In this course, you may use generative AI tools to support your learning and research. These tools can be genuinely useful, and part of what you are here to learn is how to use them well. Use them responsibly.

Understand tool limitations. AI tools are powerful but not reliable. They may return inaccurate or outdated information, draw on uncited sources, and invent citations that look real. Verify everything you intend to use.

Cite AI use. If AI-generated material informs your work, cite it as "Generated using [AI tool]" and include the prompt you used. Copying output without attribution is plagiarism.

Engage in original thought. Use these tools to extend your thinking, not to stand in for it. Your own analysis and voice are what is being assessed.

Respect academic integrity. All collaborative and AI-assisted work remains subject to the academic integrity policies of this course and the UTM Student Code of Conduct.

Ask. If you have questions about how to use a tool for a particular task, come talk to me.`,
  },
  prohibited: {
    label: "Prohibited · no AI use in this course",
    text: `Use of AI tools is not permitted in this course on any assignment. All work in this course will be produced by the student. Use of AI tools will be considered a violation of academic integrity and will be handled under the UTM Student Code of Conduct.`,
  },
  custom: { label: "Write my own", text: "" },
};

const LOCKED = {
  integrity: {
    title: "Academic Integrity",
    text: `The University of Tennessee at Martin has chosen as its primary objective quality undergraduate education. That commitment obligates every member of the university community to promote and protect the highest standards of integrity in study, research, instruction, and evaluation. Integrity of the academic process requires fair and impartial evaluation by faculty and honest academic conduct by students.

Cheating and plagiarism will not be tolerated. Violations may result in a failing grade on the assignment, failure in the course, and a report to university administration. Students should review the UTM Standards of Conduct and the UTM Academic Integrity policy.

If you are ever unsure whether something crosses a line, ask before you submit.`,
  },
  accessibility: {
    title: "Digital Accessibility and Course Materials",
    text: `The University of Tennessee at Martin is committed to ensuring equal access to course content for all students in accordance with Title II of the Americans with Disabilities Act, the ADA Title II Final Rule (2024), and Section 504 of the Rehabilitation Act. This course works toward meeting WCAG 2.1 Level AA digital accessibility standards across all materials, including documents, slides, videos, and any linked content posted through Canvas or other course platforms.

If you encounter any course material that presents an accessibility barrier, meaning it is difficult or impossible to access using assistive technology, please notify me directly and contact the UTM Accessibility Resource Center (ARC) as soon as possible. Do not wait until an assignment deadline to report an issue. I want to make sure you are never disadvantaged while a resolution is in process.

The ARC serves as the university's coordinating office for all disability-related access needs and will partner with us to find the right solution.

Accessibility Resource Center (ARC)
206-209 Clement Hall  |  Phone: 731-881-7195  |  Email: ARC@utm.edu
Office Hours: Monday through Friday, 8:00 a.m. to 5:00 p.m.
utm.edu/offices-and-services/accessibility-resource-center/

For students with formally approved disability accommodations, please send your accommodation letter to me through the AIM portal at the start of the semester and follow up with me directly so we can discuss how your accommodations will be implemented in this course.`,
  },
  support: {
    title: "Student Resources and Support",
    text: `Learning Commons (Writing Center, tutoring, and Supplemental Instruction) — Paul Meek Library

Accessibility Resource Center — Student Success Center, 206-209 Clement Hall, 731-881-7195, ARC@utm.edu

Student Health and Counseling Services — utm.edu/departments/shcs/
Counseling walk-in hours: Monday through Friday, 10:00 a.m. to 2:00 p.m.

College can be a demanding stretch, and asking for help early is a normal part of getting through it. These offices exist for exactly that.`,
  },
  crisis: {
    title: "Crisis and Emergency Support",
    text: `Pathways Crisis Line: 1-800-372-0693
988 Suicide and Crisis Lifeline: call or text 988
National Sexual Assault Hotline: 1-800-656-4673
UTM Department of Public Safety: 731-881-7777
Emergency: 911`,
  },
  changes: {
    title: "Syllabus Subject to Change",
    text: `This syllabus lays out a general plan for the course. It is not final, and adjustments may be necessary. Any changes will be communicated through Canvas announcements, and you are responsible for checking Canvas regularly. Major assignment dates will not move without reasonable advance notice.`,
  },
};

const FALL_2026 = [
  ["August 24", "First day of classes"],
  ["August 24 to 30", "Late registration"],
  ["August 30", "Last day to add a course (Part of Term 1)"],
  ["September 3", "Administrative drop for non-payment"],
  ["September 6", "Last day to drop without a W grade"],
  ["September 7", "Labor Day holiday, no classes"],
  ["October 9", "Mid-term progress reports due"],
  ["October 12 to 13", "Fall Break, no classes"],
  ["October 16", "Last day to drop a class without documentation"],
  ["November 5 to 6", "Approved early registration for Spring 2027"],
  ["November 9 to 13", "Advising and early registration for Spring 2027"],
  ["November 25 to 29", "Thanksgiving holiday, no classes"],
  ["December 4", "Classes end"],
  ["December 7 to 11", "Final exams"],
  ["December 12", "Commencement, Elam Center"],
  ["December 14", "Final grades due by 8:30 p.m."],
];

/* ---------- initial state ---------- */

const blank = {
  code: "", title: "", crn: "", section: "", term: "Fall 2026", modality: "In person",
  credits: "3", meeting: "", location: "", dept: "", prereq: "",
  instructor: "", email: "", office: "", hours: "", address: "",
  subjectLine: "", responseTime: "48 hours on business days",
  description: "", welcome: "",
  showPrimer: true, outcomes: [""],
  texts: "", costNote: "", tech: "",
  items: [{ name: "", weight: "", desc: "", slos: [] }],
  scale: "A 90 to 100  ·  B 80 to 89  ·  C 70 to 79  ·  D 60 to 69  ·  F below 60",
  attendance: "", late: "", participation: "",
  aiTier: "mixed", aiCustom: "", profNote: "", customPolicies: [],
  inc: { integrity: true, accessibility: true, support: true, crisis: true, changes: true },
  weeks: [{ label: "Week 1", dates: "", topics: "", due: "" }],
  calNote: true,
  hasLab: false,
  lab: {
    crn: "", meeting: "", location: "", instructor: "",
    description: "", gradeNote: "", attendance: "",
    safety: "", supplies: "", makeup: "",
  },
};

/* ---------- small UI atoms ---------- */

const Lbl = ({ children, hint }) => (
  <div className="mb-1">
    <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: C.slate }}>{children}</span>
    {hint && <span className="ml-2 text-xs" style={{ color: "#8894A8" }}>{hint}</span>}
  </div>
);

const inputBase = {
  width: "100%", border: `1px solid ${C.line}`, borderRadius: 4,
  padding: "7px 10px", fontFamily: "Cambria, Georgia, serif",
  fontSize: 14, color: C.ink, background: "#fff", outline: "none",
};

const T = ({ value, onChange, placeholder, mono }) => (
  <input style={{ ...inputBase, fontFamily: mono ? "ui-monospace, monospace" : inputBase.fontFamily }}
    value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
);

const A = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea style={{ ...inputBase, resize: "vertical", lineHeight: 1.5 }} rows={rows}
    value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
);

const Field = ({ label, hint, children }) => (
  <div className="mb-4"><Lbl hint={hint}>{label}</Lbl>{children}</div>
);

const Note = ({ children }) => (
  <div className="flex gap-2 p-3 mb-4 rounded text-sm" style={{ background: "#F0F5FA", color: C.slate, lineHeight: 1.55 }}>
    <Info size={15} style={{ color: C.navy, flexShrink: 0, marginTop: 2 }} />
    <div>{children}</div>
  </div>
);

/* ============================================================ */

export default function SyllabusBuilder() {
  const [d, setD] = useState(blank);
  // adds a warning before the user leaves the page changes will not be saved.
  const hasUnsavedChanges = JSON.stringify(d) !== JSON.stringify(blank);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const warnBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedChanges]);
  const [tab, setTab] = useState(0);
  const frameRef = useRef(null);

  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const setDeep = (k, i, key, v) =>
    setD((p) => { const a = [...p[k]]; a[i] = { ...a[i], [key]: v }; return { ...p, [k]: a }; });
  const push = (k, obj) => setD((p) => ({ ...p, [k]: [...p[k], obj] }));
  const drop = (k, i) => setD((p) => ({ ...p, [k]: p[k].filter((_, j) => j !== i) }));
  const setLab = (k, v) => setD((p) => ({ ...p, lab: { ...p.lab, [k]: v } }));

  const weightTotal = useMemo(
    () => d.items.reduce((s, x) => s + (parseFloat(x.weight) || 0), 0), [d.items]);

  const realOutcomes = d.outcomes.filter((o) => o.trim());
  const mappedSlos = new Set(d.items.flatMap((x) => x.slos));
  const unmapped = realOutcomes.map((_, i) => i).filter((i) => !mappedSlos.has(i));

  const aiText = d.aiTier === "custom" ? d.aiCustom : AI_POLICIES[d.aiTier].text;

  /* ---------- readiness ---------- */
  const checks = [
    ["Course code, title, term, and credit hours", !!(d.code && d.title && d.term && d.credits)],
    ["Meeting time and modality stated", !!(d.modality && (d.modality.startsWith("Online") || d.meeting))],
    ["Instructor name and email", !!(d.instructor && d.email)],
    ["Office hours and how to reach you", !!(d.hours)],
    ["Email response time committed to", !!d.responseTime],
    ["Course description", !!d.description],
    ["Why this course matters, in your voice", !!d.welcome],
    ["At least three learning outcomes", realOutcomes.length >= 3],
    ["Every outcome tied to an assessment", realOutcomes.length > 0 && unmapped.length === 0],
    ["Required materials listed", !!d.texts],
    ["Assessment weights total 100 percent", Math.abs(weightTotal - 100) < 0.01],
    ["Grading scale", !!d.scale],
    ["Attendance policy", !!d.attendance],
    ["Late work and make-up policy", !!d.late],
    ["AI policy (required by UTM policy)", !!aiText.trim()],
    ["Accessibility statement included", d.inc.accessibility],
    ["Academic integrity included", d.inc.integrity],
    ["Crisis resources included", d.inc.crisis],
    ["Schedule has at least one entry", d.weeks.some((w) => w.topics || w.dates)],
    ...(d.hasLab ? [
      ["Lab meeting time and location", !!(d.lab.meeting && d.lab.location)],
      ["How the lab counts toward the course grade", !!d.lab.gradeNote],
      ["Lab safety expectations stated", !!d.lab.safety],
    ] : []),
  ];
  const passed = checks.filter((c) => c[1]).length;

  /* ---------- document builder: one source of truth ---------- */

  const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const para = (s = "") => esc(s).split(/\n{2,}/).map((p) =>
    `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("");

  const docBody = useMemo(() => {
    const h = [];
    const sec = (t) => h.push(`<h2>${esc(t)}</h2>`);

    h.push(`<table class="hdr"><tr>
      <td class="hdr-l"><img src="${LOGO}" alt="The University of Tennessee at Martin" width="230"/></td>
      <td class="hdr-r"><div class="ct">${esc(d.code || "COURSE 000")}</div>
      <div class="tt">${esc(d.title || "Course Title")}</div>
      <div class="st">${esc(d.term)}${d.modality ? " &nbsp;|&nbsp; " + esc(d.modality) : ""}${d.dept ? " &nbsp;|&nbsp; " + esc(d.dept) : ""}</div></td></tr></table>`);

    // Course facts
    const facts = [
      ["Course", `${d.code} ${d.title}`.trim()],
      ["CRN", d.crn],
      ["Section", d.section],
      ["Term", d.term],
      ["Delivery", d.modality],
      ["Credit hours", d.credits],
      ["Meeting time", d.meeting],
      ["Location", d.location],
      ["Prerequisites", d.prereq],
      ["Instructor", d.instructor],
      ["Email", d.email],
      ["Office", d.office],
      ["Office hours", d.hours],
    ].filter((r) => r[1] && String(r[1]).trim());
    if (facts.length) {
      sec("Course Information");
      h.push(`<table class="grid">${facts.map((r) =>
        `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>`);
    }

    if (d.welcome) { sec("Welcome to This Course"); h.push(para(d.welcome)); }
    if (d.description) { sec("Course Description"); h.push(para(d.description)); }

    if (realOutcomes.length || d.showPrimer) {
      sec("Student Learning Outcomes");
      if (d.showPrimer) h.push(`<div class="primer"><div class="primer-h">For the instructor: what an SLO is and why it is here</div>${para(SLO_PRIMER)}</div>`);
      if (realOutcomes.length) {
        h.push(`<p>By the end of this course, you should be able to:</p><ol>${realOutcomes.map((o) =>
          `<li>${esc(o)}</li>`).join("")}</ol>`);
      }
    }

    if (d.texts || d.costNote || d.tech) {
      sec("Required Materials");
      if (d.texts) h.push(para(d.texts));
      if (d.costNote) h.push(`<p class="soft">${esc(d.costNote)}</p>`);
      if (d.tech) { h.push(`<h3>Technology you will need</h3>`); h.push(para(d.tech)); }
    }

    const live = d.items.filter((x) => x.name);
    if (live.length) {
      sec("Assessment and Grading");
      h.push(`<table class="grid"><tr><th>Assignment</th><th class="w">Weight</th><th>What it is</th></tr>${
        live.map((x) => `<tr><td><strong>${esc(x.name)}</strong>${
          x.slos.length ? `<div class="tag">Outcome${x.slos.length > 1 ? "s" : ""} ${x.slos.map((i) => i + 1).join(", ")}</div>` : ""
        }</td><td class="w">${esc(x.weight)}%</td><td>${esc(x.desc)}</td></tr>`).join("")
      }<tr class="tot"><td>Total</td><td class="w">${weightTotal}%</td><td></td></tr></table>`);
      if (d.scale) { h.push(`<h3>Grading scale</h3>`); h.push(para(d.scale)); }
    }

        if (d.hasLab) {
      const L = d.lab;
      sec("Laboratory Component");
      const lf = [
        ["Lab section / CRN", L.crn],
        ["Lab meeting time", L.meeting],
        ["Lab location", L.location],
        ["Lab instructor", L.instructor],
      ].filter((r) => r[1] && String(r[1]).trim());
      if (lf.length) h.push(`<table class="grid">${lf.map((r) =>
        `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>`);
      if (L.description) h.push(para(L.description));
      [
        ["How the Lab Counts Toward Your Grade", L.gradeNote],
        ["Lab Attendance", L.attendance],
        ["Lab Safety", L.safety],
        ["Supplies and Protective Equipment", L.supplies],
        ["Missed Labs and Make-Up", L.makeup],
      ].forEach(([t, b]) => {
        if (b && b.trim()) { h.push(`<h3>${esc(t)}</h3>`); h.push(para(b)); }
      });
    }

    const pol = [];
    if (d.attendance) pol.push(["Attendance and Participation", d.attendance]);
    if (d.participation) pol.push(["What Engagement Looks Like Here", d.participation]);
    if (d.late) pol.push(["Late Work and Make-Up Policy", d.late]);
    if (d.subjectLine || d.responseTime || d.address)
      pol.push(["Reaching Me", [
        d.subjectLine && `Use this subject line on every email: ${d.subjectLine}`,
        d.responseTime && `I respond to email within ${d.responseTime}.`,
        d.address && `You can address me as ${d.address}.`,
      ].filter(Boolean).join("\n")]);
    if (aiText.trim()) pol.push(["Artificial Intelligence Policy", aiText]);
      const customPolicies = d.customPolicies.filter((policy) => policy.title.trim() || policy.text.trim());
      if (pol.length || customPolicies.length) {
      sec("Course Policies");
      pol.forEach(([t, b]) => { h.push(`<h3>${esc(t)}</h3>`); h.push(para(b)); });
      if (d.profNote) h.push(`<div class="pnote"><strong>A note from your professor.</strong> ${esc(d.profNote)}</div>`);
        customPolicies.forEach((policy) => {
        if (policy.title.trim()) h.push(`<h3>${esc(policy.title)}</h3>`);
        if (policy.text.trim()) h.push(para(policy.text));
      });
    }

    const uni = Object.keys(LOCKED).filter((k) => d.inc[k]);
    if (uni.length) {
      sec("University Policies and Student Support");
      uni.forEach((k) => { h.push(`<h3>${esc(LOCKED[k].title)}</h3>`); h.push(para(LOCKED[k].text)); });
    }

    const wk = d.weeks.filter((w) => w.label || w.topics || w.dates);
    if (wk.length) {
      sec("Course Schedule");
      h.push(`<table class="grid"><tr><th class="wk">Week</th><th>Topics and Readings</th><th class="due">Due</th></tr>${
        wk.map((w) => `<tr><td class="wk"><strong>${esc(w.label)}</strong>${w.dates ? `<br/><span class="soft">${esc(w.dates)}</span>` : ""}</td><td>${esc(w.topics).replace(/\n/g, "<br/>")}</td><td class="due">${esc(w.due).replace(/\n/g, "<br/>")}</td></tr>`).join("")
      }</table>`);
    }

    if (d.calNote) {
      sec("Fall 2026 Dates You Should Know");
      h.push(`<table class="grid">${FALL_2026.map((r) =>
        `<tr><th class="wk">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>
        <p class="soft">Registrar's calendar, subject to change. Confirm at utm.edu/academics/academic-calendar/</p>`);
    }

    return h.join("");
  }, [d, weightTotal, realOutcomes, aiText]);

  const DOC_CSS = `
    body{font-family:Cambria,Georgia,serif;font-size:11pt;line-height:1.5;color:#1a1a1a;margin:0}
    .page{padding:0}
    h2{font-family:Cambria,Georgia,serif;font-size:14pt;color:${C.navy};margin:22px 0 8px;
       border-bottom:2px solid ${C.orange};padding-bottom:4px;text-transform:uppercase;letter-spacing:.5px}
    h3{font-family:Cambria,Georgia,serif;font-size:11.5pt;color:${C.navy};margin:14px 0 4px}
    p{margin:0 0 9px}
    ol,ul{margin:0 0 10px 20px;padding:0} li{margin-bottom:5px}
    .soft{color:#5A6A80;font-size:10pt}
    table.hdr{width:100%;border-collapse:collapse;margin-bottom:6px;border-bottom:3px solid ${C.navy}}
    .hdr td{vertical-align:bottom;padding:0 0 10px}
    .hdr-l{width:245px}
    .hdr-r{text-align:right}
    .ct{font-size:10pt;letter-spacing:2px;color:${C.orange};font-weight:bold}
    .tt{font-size:19pt;color:${C.navy};line-height:1.15;font-weight:bold}
    .st{font-size:10pt;color:#5A6A80;margin-top:3px}
    table.grid{width:100%;border-collapse:collapse;margin:6px 0 12px;font-size:10.5pt}
    .grid th,.grid td{border:1px solid ${C.line};padding:6px 9px;text-align:left;vertical-align:top}
    .grid th{background:#EEF2F7;color:${C.navy};font-weight:bold;width:auto}
    .grid td .tag{font-size:8.5pt;color:${C.orange};font-weight:bold;margin-top:3px}
    .grid .w{width:70px;text-align:right}
    .grid .wk{width:110px}
    .grid .due{width:150px}
    .grid tr.tot td{background:#EEF2F7;font-weight:bold}
    .primer{border-left:4px solid ${C.orange};background:#FAFBFD;padding:10px 14px;margin:8px 0 14px;font-size:10pt}
    .primer-h{font-weight:bold;color:${C.navy};margin-bottom:6px}
    .pnote{border:1px solid ${C.orange};background:#FFF8F0;padding:10px 14px;margin:10px 0;font-size:10.5pt}
  `;

  const fullHtml = () =>
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head>
     <meta charset="utf-8"/><title>${esc(d.code)} Syllabus</title>
     <style>@page{size:8.5in 11in;margin:0.8in}${DOC_CSS}</style></head>
     <body><div class="page">${docBody}</div></body></html>`;

  const dl = (blob, name) => {
    const u = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 4000);
  };
  const fname = (ext) => `${(d.code || "Syllabus").replace(/\s+/g, "_")}_${d.term.replace(/\s+/g, "_")}.${ext}`;

  const exportWord = () => dl(new Blob(["\ufeff" + fullHtml()], { type: "application/msword" }), fname("doc"));
  const exportPdf = () => {
    const f = frameRef.current; if (!f) return;
    const doc = f.contentWindow.document;
    doc.open(); doc.write(fullHtml()); doc.close();
    setTimeout(() => { f.contentWindow.focus(); f.contentWindow.print(); }, 250);
  };

  /* ---------- sections ---------- */
  const TABS = [
    { n: "Course", i: BookOpen }, { n: "Instructor", i: User }, { n: "Welcome", i: MessageSquare },
    { n: "Outcomes", i: Target }, { n: "Materials", i: Library }, { n: "Grading", i: Scale },
    { n: "Policies", i: Gavel }, { n: "University", i: ShieldCheck }, { n: "Schedule", i: CalendarDays },
    {n: "Labs", i: FlaskConical},{ n: "Export", i: FileDown },
  ];

  const Btn = ({ onClick, children, icon: I, primary }) => (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold"
      style={{ background: primary ? C.navy : "#fff", color: primary ? "#fff" : C.navy,
        border: `1px solid ${primary ? C.navy : C.line}`, cursor: "pointer" }}>
      {I && <I size={15} />}{children}
    </button>
  );

  return (
    <div style={{ fontFamily: "Cambria, Georgia, serif", background: C.wash, minHeight: "100vh" }}>
      <iframe ref={frameRef} title="print" style={{ position: "fixed", width: 0, height: 0, border: 0, left: -9999 }} />

      {/* masthead */}
      <div style={{ background: C.navy, borderBottom: `4px solid ${C.orange}` }} className="px-5 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="The University of Tennessee at Martin" style={{ height: 30, filter: "brightness(0) invert(1)" }} />
            <div style={{ borderLeft: "1px solid rgba(255,255,255,.3)", paddingLeft: 16 }}>
              <div style={{ color: "#fff", fontSize: 15, fontWeight: "bold", lineHeight: 1.1 }}>Syllabus Builder</div>
              <div style={{ color: C.orange, fontSize: 11, letterSpacing: 1 }}>CENTER FOR TEACHING AND LEARNING</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ color: "#B9C6D8", fontSize: 12, marginRight: 6 }}>{passed} of {checks.length} complete</div>
            <div style={{ width: 120, height: 6, background: "rgba(255,255,255,.2)", borderRadius: 3 }}>
              <div style={{ width: `${(passed / checks.length) * 100}%`, height: "100%", background: C.orange, borderRadius: 3, transition: "width .3s" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap" style={{ alignItems: "flex-start" }}>
        {/* left rail */}
        <div style={{ width: 150, background: "#fff", borderRight: `1px solid ${C.line}`, minHeight: "calc(100vh - 62px)" }}>
          {TABS.map((t, i) => {
            const on = tab === i; const I = t.i;
            return (
              <button key={t.n} onClick={() => setTab(i)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left"
                style={{ background: on ? "#EEF2F7" : "transparent", color: on ? C.navy : C.slate,
                  borderLeft: `3px solid ${on ? C.orange : "transparent"}`, fontWeight: on ? "bold" : "normal", cursor: "pointer" }}>
                <I size={15} />{t.n}
              </button>
            );
          })}
        </div>

        {/* form */}
        <div className="p-5" style={{ flex: "1 1 420px", minWidth: 340, maxWidth: 620 }}>
          {tab === 0 && (<>
            <H>Course</H>
            <div className="flex gap-3 flex-wrap">
              <div style={{ flex: "1 1 150px" }}><Field label="Course code" hint="POSC 322"><T value={d.code} onChange={(v) => set("code", v)} placeholder="POSC 322" /></Field></div>
              <div style={{ flex: "2 1 240px" }}><Field label="Course title"><T value={d.title} onChange={(v) => set("title", v)} placeholder="American Foreign Policy" /></Field></div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div style={{ flex: "1 1 130px" }}><Field label="CRN" hint="the 5-digit registration number"><T value={d.crn} onChange={(v) => set("crn", v)} placeholder="12345" /></Field></div>
              <div style={{ flex: "1 1 130px" }}><Field label="Section"><T value={d.section} onChange={(v) => set("section", v)} placeholder="001" /></Field></div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div style={{ flex: "1 1 130px" }}><Field label="Term"><T value={d.term} onChange={(v) => set("term", v)} /></Field></div>
              <div style={{ flex: "1 1 130px" }}><Field label="Credit hours"><T value={d.credits} onChange={(v) => set("credits", v)} /></Field></div>
            </div>
            <Field label="Delivery" hint="students read this before they register">
              <select style={inputBase} value={d.modality} onChange={(e) => set("modality", e.target.value)}>
                {["In person", "Hybrid", "Online synchronous", "Online asynchronous"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Meeting time" hint="leave blank if fully asynchronous"><T value={d.meeting} onChange={(v) => set("meeting", v)} placeholder="Tuesday and Thursday, 9:30 to 10:45 a.m." /></Field>
            <Field label="Room"><T value={d.location} onChange={(v) => set("location", v)} placeholder="Humanities 407" /></Field>
            <Field label="Department"><T value={d.dept} onChange={(v) => set("dept", v)} placeholder="Department of Political Science and Global Studies" /></Field>
            <Field label="Prerequisites"><T value={d.prereq} onChange={(v) => set("prereq", v)} placeholder="None" /></Field>
          </>)}

          {tab === 1 && (<>
            <H>Instructor</H>
            <Note>Office hours are the single most under-used thing on a syllabus. Students who work shifts or commute from Dresden or Union City often cannot make a fixed midday block. Naming an alternative, even just "email me and we will find a time," changes who walks through the door.</Note>
            <Field label="Your name"><T value={d.instructor} onChange={(v) => set("instructor", v)} placeholder="Dr. Jane Doe" /></Field>
            <Field label="Email"><T value={d.email} onChange={(v) => set("email", v)} placeholder="jdoe@utm.edu" /></Field>
            <Field label="Office"><T value={d.office} onChange={(v) => set("office", v)} placeholder="Humanities 212" /></Field>
            <Field label="Office hours"><A rows={2} value={d.hours} onChange={(v) => set("hours", v)} placeholder="Monday and Wednesday, 10 a.m. to noon, and by appointment. Email me and we will find a time that works." /></Field>
            <Field label="Email subject line you want" hint="cuts your response time"><T value={d.subjectLine} onChange={(v) => set("subjectLine", v)} placeholder="POSC 322 - [your question]" /></Field>
            <Field label="Response time you commit to"><T value={d.responseTime} onChange={(v) => set("responseTime", v)} /></Field>
            <Field label="How students should address you"><T value={d.address} onChange={(v) => set("address", v)} placeholder="Dr. Doe" /></Field>
          </>)}

          {tab === 2 && (<>
            <H>Welcome and Description</H>
            <Note>The description is what the catalog says. The welcome is what you say. Research on student-centered syllabi is consistent that the second one moves how students read everything after it, so it is worth four sentences of your own voice.</Note>
            <Field label="Why this course matters" hint="your voice, not the catalog">
              <A rows={6} value={d.welcome} onChange={(v) => set("welcome", v)}
                placeholder="Foreign policy is not something that happens far away in diplomatic corridors. It shapes the price of the goods you buy, the security of the country you live in, and the reputation the United States carries around the world. This course is built around that reality." />
            </Field>
            <Field label="Catalog description"><A rows={5} value={d.description} onChange={(v) => set("description", v)} placeholder="Paste the description from the UTM catalog." /></Field>
          </>)}

          {tab === 3 && (<>
            <H>Learning Outcomes</H>
            <label className="flex items-start gap-2 mb-4 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
              <input type="checkbox" checked={d.showPrimer} onChange={(e) => set("showPrimer", e.target.checked)} style={{ marginTop: 3 }} />
              <span>Include the explainer box in the exported document. It tells a new faculty member what an SLO is, how to test one, and why the Gen Ed outcomes belong here. Uncheck it, or delete the box in Word, once your outcomes are written.</span>
            </label>
            {d.outcomes.map((o, i) => (
              <div key={i} className="flex gap-2 mb-2 items-start">
                <div style={{ width: 22, paddingTop: 8, color: C.orange, fontWeight: "bold", fontSize: 13 }}>{i + 1}</div>
                <div style={{ flex: 1 }}><A rows={2} value={o} onChange={(v) => setD((p) => { const a = [...p.outcomes]; a[i] = v; return { ...p, outcomes: a }; })}
                  placeholder="Students will evaluate ..." /></div>
                <button onClick={() => drop("outcomes", i)} style={{ color: "#9AA5B5", marginTop: 8, cursor: "pointer" }}><Trash2 size={15} /></button>
              </div>
            ))}
            <Btn onClick={() => push("outcomes", "")} icon={Plus}>Add outcome</Btn>
            <div className="mt-6">
              {OUTCOME_LIBRARY.map((g) => (
                <div key={g.group} className="mb-4 p-3 rounded" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                  <div style={{ color: C.navy, fontWeight: "bold", fontSize: 13 }}>{g.group}</div>
                  <div style={{ color: C.slate, fontSize: 12, margin: "3px 0 8px" }}>{g.note}</div>
                  {g.items.map((it) => (
                    <div key={it} className="flex gap-2 items-start mb-2">
                      <button onClick={() => setD((p) => ({ ...p, outcomes: [...p.outcomes.filter((x) => x.trim()), it] }))}
                        style={{ color: C.orange, marginTop: 2, cursor: "pointer" }}><Plus size={14} /></button>
                      <div style={{ fontSize: 12.5, color: C.slate, lineHeight: 1.45 }}>{it}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>)}

          {tab === 4 && (<>
            <H>Materials</H>
            <Field label="Required texts"><A rows={4} value={d.texts} onChange={(v) => set("texts", v)} placeholder="Hastedt, G. P. (2020). American Foreign Policy: Past, Present, and Future (12th ed.). Rowman and Littlefield." /></Field>
            <Field label="Cost note" hint="tell them the real number, and the free path if there is one"><A rows={2} value={d.costNote} onChange={(v) => set("costNote", v)} placeholder="The textbook runs about $60 used. A copy is on reserve at Paul Meek Library. Tell me before the second week if cost is a barrier." /></Field>
            <Field label="Technology and platforms"><A rows={3} value={d.tech} onChange={(v) => set("tech", v)} placeholder="Canvas for all materials and submissions. A phone or laptop microphone is enough for the audio assignments." /></Field>
          </>)}

          {tab === 5 && (<>
            <H>Assessment and Grading</H>
            <div className="p-3 mb-4 rounded flex items-center gap-2" style={{
              background: Math.abs(weightTotal - 100) < 0.01 ? "#EAF6EF" : "#FEF6E7",
              color: Math.abs(weightTotal - 100) < 0.01 ? C.good : C.warn, fontSize: 14, fontWeight: "bold" }}>
              {Math.abs(weightTotal - 100) < 0.01 ? <Check size={16} /> : <AlertTriangle size={16} />}
              Weights total {weightTotal}%{Math.abs(weightTotal - 100) < 0.01 ? "" : `, which is ${weightTotal > 100 ? "over" : "under"} by ${Math.abs(100 - weightTotal).toFixed(1)}`}
            </div>
            {d.items.map((x, i) => (
              <div key={i} className="p-3 mb-3 rounded" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                <div className="flex gap-2 mb-2">
                  <div style={{ flex: 3 }}><T value={x.name} onChange={(v) => setDeep("items", i, "name", v)} placeholder="Final paper" /></div>
                  <div style={{ flex: 1 }}><T mono value={x.weight} onChange={(v) => setDeep("items", i, "weight", v)} placeholder="%" /></div>
                  <button onClick={() => drop("items", i)} style={{ color: "#9AA5B5", cursor: "pointer" }}><Trash2 size={15} /></button>
                </div>
                <A rows={2} value={x.desc} onChange={(v) => setDeep("items", i, "desc", v)} placeholder="What it is, how long, when it is due." />
                {realOutcomes.length > 0 && (
                  <div className="mt-2">
                    <div style={{ fontSize: 11, color: C.slate, marginBottom: 4 }}>WHICH OUTCOMES DOES THIS PRODUCE EVIDENCE FOR?</div>
                    <div className="flex flex-wrap gap-1">
                      {realOutcomes.map((_, oi) => {
                        const on = x.slos.includes(oi);
                        return (
                          <button key={oi} onClick={() => setDeep("items", i, "slos", on ? x.slos.filter((z) => z !== oi) : [...x.slos, oi])}
                            style={{ fontSize: 12, padding: "2px 9px", borderRadius: 11, cursor: "pointer",
                              border: `1px solid ${on ? C.orange : C.line}`, background: on ? C.orange : "#fff", color: on ? "#fff" : C.slate }}>
                            {oi + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Btn onClick={() => push("items", { name: "", weight: "", desc: "", slos: [] })} icon={Plus}>Add assignment</Btn>
            {unmapped.length > 0 && (
              <div className="mt-4 p-3 rounded flex gap-2" style={{ background: "#FEF6E7", color: C.warn, fontSize: 13 }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>Outcome{unmapped.length > 1 ? "s" : ""} {unmapped.map((i) => i + 1).join(", ")} {unmapped.length > 1 ? "have" : "has"} nothing in the grade breakdown producing evidence for {unmapped.length > 1 ? "them" : "it"}. Either attach an assignment or rewrite the outcome.</div>
              </div>
            )}
            <div className="mt-4"><Field label="Grading scale"><A rows={2} value={d.scale} onChange={(v) => set("scale", v)} /></Field></div>
          </>)}

          {tab === 6 && (<>
            <H>Course Policies</H>
            <Field label="Attendance"><A rows={3} value={d.attendance} onChange={(v) => set("attendance", v)} placeholder="Say what counts as present, what happens after an absence, and who to tell." /></Field>
            <Field label="What engagement looks like here" hint="optional, but it removes a lot of guesswork"><A rows={3} value={d.participation} onChange={(v) => set("participation", v)} placeholder="Merely showing up and sitting through the class is not participation. Asking questions during Q and A, contributing to project discussions, and showing up to team meetings all count." /></Field>
            <Field label="Late work and make-up"><A rows={3} value={d.late} onChange={(v) => set("late", v)} placeholder="All assignments except exams can be made up with a 30 percent late penalty. Exams cannot be made up except for documented emergencies. Reach out before the deadline, not after." /></Field>

            <div className="mt-6 mb-2" style={{ color: C.navy, fontWeight: "bold", fontSize: 14 }}>Artificial Intelligence Policy</div>
            <Note>UTM's AI policy, effective July 1, 2025, requires every syllabus to state your expectations for student AI use. This is not optional, so pick a tier below. The three tiers match the policy: unrestricted, mixed, and total prohibition.</Note>
            {Object.entries(AI_POLICIES).map(([k, v]) => (
              <label key={k} className="flex items-start gap-2 mb-2 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
                <input type="radio" name="ai" checked={d.aiTier === k} onChange={() => set("aiTier", k)} style={{ marginTop: 3 }} />
                <span>{v.label}</span>
              </label>
            ))}
            {d.aiTier === "custom" && <div className="mt-2"><A rows={7} value={d.aiCustom} onChange={(v) => set("aiCustom", v)}
              placeholder="Your policy must still affirm academic honesty and state that unpermitted AI use is academic misconduct under the Student Code of Conduct." /></div>}
            <div className="mt-4"><Field label="A note from your professor" hint="optional warm box, sits under the policy">
              <A rows={3} value={d.profNote} onChange={(v) => set("profNote", v)} placeholder="If you are ever unsure whether what you are submitting crosses that line, reach out before you submit. That conversation is always easier before the fact than after." /></Field></div>
            <div className="mt-6 mb-2" style={{ color: C.navy, fontWeight: "bold", fontSize: 14 }}>Additional Policies</div>
            {d.customPolicies.map((policy, i) => (
              <div key={i} className="mb-3 p-3 rounded" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                <div className="flex items-start gap-2">
                  <div style={{ flex: 1 }}>
                    <Field label="Policy title"><T value={policy.title} onChange={(v) => setDeep("customPolicies", i, "title", v)} placeholder="Classroom conduct" /></Field>
                    <Field label="Policy details"><A rows={3} value={policy.text} onChange={(v) => setDeep("customPolicies", i, "text", v)} placeholder="Describe your expectations for students." /></Field>
                  </div>
                  <button type="button" onClick={() => drop("customPolicies", i)} aria-label={`Remove custom policy ${i + 1}`} title="Remove policy"
                    className="p-2 rounded" style={{ color: C.slate, background: "transparent", border: 0, cursor: "pointer" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <Btn onClick={() => push("customPolicies", { title: "", text: "" })} icon={Plus}>Add custom policy</Btn>
          </>)}

          {tab === 7 && (<>
            <H>University Policies</H>
            <Note>CTL maintains this language and checks it each term. Leave it checked and it stays current. If you edit it in Word after export, you own the accuracy of the edit.</Note>
            {Object.entries(LOCKED).map(([k, v]) => (
              <div key={k} className="mb-3 p-3 rounded" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={d.inc[k]} onChange={(e) => set("inc", { ...d.inc, [k]: e.target.checked })} />
                  <Lock size={12} style={{ color: C.orange }} />
                  <span style={{ color: C.navy, fontWeight: "bold", fontSize: 13.5 }}>{v.title}</span>
                </label>
                <div style={{ fontSize: 12, color: C.slate, marginTop: 6, lineHeight: 1.5, maxHeight: 86, overflow: "auto", whiteSpace: "pre-wrap" }}>{v.text}</div>
              </div>
            ))}
          </>)}

          {tab === 8 && (<>
            <H>Schedule</H>
            <label className="flex items-start gap-2 mb-4 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
              <input type="checkbox" checked={d.calNote} onChange={(e) => set("calNote", e.target.checked)} style={{ marginTop: 3 }} />
              <span>Append the Fall 2026 registrar dates: add and drop deadlines, Fall Break, Thanksgiving, finals, and commencement.</span>
            </label>
            {d.weeks.map((w, i) => (
              <div key={i} className="p-3 mb-3 rounded" style={{ background: "#fff", border: `1px solid ${C.line}` }}>
                <div className="flex gap-2 mb-2">
                  <div style={{ flex: 1 }}><T value={w.label} onChange={(v) => setDeep("weeks", i, "label", v)} placeholder="Week 1" /></div>
                  <div style={{ flex: 2 }}><T value={w.dates} onChange={(v) => setDeep("weeks", i, "dates", v)} placeholder="August 24 to 28" /></div>
                  <button onClick={() => drop("weeks", i)} style={{ color: "#9AA5B5", cursor: "pointer" }}><Trash2 size={15} /></button>
                </div>
                <div className="flex gap-2">
                  <div style={{ flex: 2 }}><A rows={3} value={w.topics} onChange={(v) => setDeep("weeks", i, "topics", v)} placeholder="Topic and readings" /></div>
                  <div style={{ flex: 1 }}><A rows={3} value={w.due} onChange={(v) => setDeep("weeks", i, "due", v)} placeholder="Due" /></div>
                </div>
              </div>
            ))}
            <div className="flex gap-2 flex-wrap">
              <Btn onClick={() => push("weeks", { label: `Week ${d.weeks.length + 1}`, dates: "", topics: "", due: "" })} icon={Plus}>Add week</Btn>
              <Btn onClick={() => setD((p) => ({ ...p, weeks: Array.from({ length: 15 }, (_, i) => p.weeks[i] || { label: `Week ${i + 1}`, dates: "", topics: "", due: "" }) }))}>Build 15 weeks</Btn>
            </div>
          </>)}

                    {tab === 9 && (<>
            <H>Laboratory Component</H>
            <label className="flex items-start gap-2 mb-4 text-sm" style={{ color: C.slate, cursor: "pointer" }}>
              <input type="checkbox" checked={d.hasLab} onChange={(e) => set("hasLab", e.target.checked)} style={{ marginTop: 3 }} />
              <span>This course has a lab component. Checking this adds a Laboratory Component section to the syllabus.</span>
            </label>
            {d.hasLab && (<>
              <Note>Students often ask three things about a lab: does it count toward my course grade, what happens if I miss one, and what do I need to bring. Answering those here saves you the emails.</Note>
              <div className="flex gap-3 flex-wrap">
                <div style={{ flex: "1 1 130px" }}><Field label="Lab section / CRN"><T value={d.lab.crn} onChange={(v) => setLab("crn", v)} placeholder="12346" /></Field></div>
                <div style={{ flex: "2 1 220px" }}><Field label="Lab instructor" hint="if different from you"><T value={d.lab.instructor} onChange={(v) => setLab("instructor", v)} /></Field></div>
              </div>
              <Field label="Lab meeting time"><T value={d.lab.meeting} onChange={(v) => setLab("meeting", v)} placeholder="Wednesday, 2:00 to 4:50 p.m." /></Field>
              <Field label="Lab location"><T value={d.lab.location} onChange={(v) => setLab("location", v)} placeholder="Science Complex 118" /></Field>
              <Field label="What happens in lab" hint="how it connects to lecture"><A rows={3} value={d.lab.description} onChange={(v) => setLab("description", v)} /></Field>
              <Field label="How the lab counts toward the course grade" hint="separate grade, percent of the total, or must pass both"><A rows={3} value={d.lab.gradeNote} onChange={(v) => setLab("gradeNote", v)} placeholder="Lab is 25 percent of your final grade. Lab reports are graded within one week." /></Field>
              <Field label="Lab attendance"><A rows={3} value={d.lab.attendance} onChange={(v) => setLab("attendance", v)} /></Field>
              <Field label="Lab safety" hint="required"><A rows={4} value={d.lab.safety} onChange={(v) => setLab("safety", v)} placeholder="Your safety rules, any training students must complete before the first lab, and what happens if the rules are not followed." /></Field>
              <Field label="Supplies and protective equipment"><A rows={3} value={d.lab.supplies} onChange={(v) => setLab("supplies", v)} placeholder="Lab notebook, closed-toe shoes, goggles (available at the bookstore)." /></Field>
              <Field label="Missed labs and make-up"><A rows={3} value={d.lab.makeup} onChange={(v) => setLab("makeup", v)} /></Field>
            </>)}
          </>)}


          {tab === 10 && (<>
            <H>Review and Export</H>
            <div className="mb-5">
              {checks.map(([label, ok]) => (
                <div key={label} className="flex items-start gap-2 py-1" style={{ fontSize: 13.5, color: ok ? C.ink : C.warn }}>
                  {ok ? <Check size={15} style={{ color: C.good, flexShrink: 0, marginTop: 2 }} />
                      : <AlertTriangle size={15} style={{ color: C.warn, flexShrink: 0, marginTop: 2 }} />}
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <Note>Nothing here is stored anywhere. Closing this tab clears it. Save your work as a file, then load that file next time you teach the course and change the dates.</Note>
            <div className="flex flex-wrap gap-2 mb-4">
              <Btn onClick={exportWord} icon={FileDown} primary>Export to Word</Btn>
              <Btn onClick={exportPdf} icon={Printer} primary>Export to PDF</Btn>
            </div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 14, lineHeight: 1.55 }}>
              Word opens the export as a normal document you can keep editing. PDF opens your browser's print dialog, where you choose Save as PDF. Both come out in Cambria with the UT Martin banner and real Word heading styles, so a screen reader can navigate it.
            </div>
          </>)}
        </div>

        {/* preview */}
        <div className="p-5" style={{ flex: "1 1 460px", minWidth: 360 }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: C.slate, fontSize: 12, letterSpacing: 1 }}>
            <ChevronRight size={13} style={{ color: C.orange }} />THIS IS EXACTLY WHAT EXPORTS
          </div>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 3, padding: "34px 40px",
            maxHeight: "calc(100vh - 130px)", overflow: "auto", boxShadow: "0 1px 4px rgba(11,34,64,.08)" }}>
            <style>{DOC_CSS}</style>
            <div dangerouslySetInnerHTML={{ __html: docBody || `<p class="soft">Start on the left. The document builds itself here.</p>` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function H({ children }) {
  return <div style={{ color: C.navy, fontWeight: "bold", fontSize: 17, marginBottom: 12,
    borderBottom: `2px solid ${C.orange}`, paddingBottom: 6, display: "inline-block" }}>{children}</div>;
}
