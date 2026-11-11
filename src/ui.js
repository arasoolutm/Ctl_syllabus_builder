// Screen colors (they follow the theme in index.css) and the shared input style.
// Print/export colors are C in SyllabusBuilder.jsx, don't mix them up.
export const UI = {
  wash: "var(--wash)",
  paper: "var(--paper)",
  tint: "var(--tint)",
  line: "var(--line)",
  ink: "var(--ink)",
  slate: "var(--slate)",
  muted: "var(--muted)",
  navy: "var(--navy)",
  orange: "var(--orange)",
  orangeText: "var(--orange-text)", // use for orange text/icons, plain orange is too faint on light themes
  fieldLine: "var(--field-line)",
  good: "var(--good)",
  goodBg: "var(--goodBg)",
  warn: "var(--warn)",
  warnBg: "var(--warnBg)",
};

export const inputBase = {
  width: "100%", border: `1px solid ${UI.fieldLine}`, borderRadius: 4,
  padding: "7px 10px", fontFamily: "inherit",
  fontSize: 14, color: UI.ink, background: "var(--field-bg)", outline: "none",
};
