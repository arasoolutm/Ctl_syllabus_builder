import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { UI, inputBase } from "./ui.js";

// Use this for every dropdown instead of copying menu code, so they all look and work the same.
// options are { value, label }, or { header } for a group name you can't pick.
// editable lets you type your own answer too, and a value of "" shows the placeholder.
export default function Dropdown({ value, onChange, options, placeholder = "", ariaLabel, editable = false,
  style, maxHeight = 260 }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // only render the list while open, otherwise it leaves empty scroll space under the form
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  const listRef = useRef(null);
  const roomRef = useRef(null);
  const hasOptions = options.some((o) => !o.header);
  const selected = options.find((o) => !o.header && o.value === value);
  const selectedIndex = selected ? options.indexOf(selected) : -1;

  useEffect(() => {
    if (!open) return undefined;
    const onDocDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!shown) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    roomRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [shown]);

  useEffect(() => {
    if (!open || active < 0) return;
    const el = listRef.current?.children[active];
    const list = listRef.current;
    if (!el || !list) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
  }, [open, active, mounted]);

  const firstPickable = () => options.findIndex((o) => !o.header);
  const step = (from, dir) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (!options[i].header) return i;
    return from;
  };
  const openMenu = () => {
    if (!hasOptions) return;
    setActive(selectedIndex >= 0 ? selectedIndex : editable ? -1 : firstPickable());
    setOpen(true);
  };
  const pick = (o) => { onChange(o.value); setOpen(false); };

  const onKeyDown = (e) => {
    if (!open) {
      const opens = editable ? ["ArrowDown", "ArrowUp"] : ["ArrowDown", "ArrowUp", "Enter", " "];
      if (opens.includes(e.key) && hasOptions) { e.preventDefault(); openMenu(); }
      return;
    }
    const last = options.length - 1;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a < 0 ? firstPickable() : step(a, 1))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a < 0 ? firstPickable() : step(a, -1))); }
    else if (e.key === "Home") { if (!editable) { e.preventDefault(); setActive(firstPickable()); } }
    else if (e.key === "End") { if (!editable) { e.preventDefault(); setActive(options[last]?.header ? step(last, -1) : last); } }
    else if (e.key === "Enter" || (!editable && e.key === " ")) {
      if (active >= 0 && options[active] && !options[active].header) { e.preventDefault(); pick(options[active]); }
      else if (editable) setOpen(false);
    }
    else if (e.key === "Tab") setOpen(false);
  };

  const chevron = (
    <ChevronDown size={14} className="transition-transform duration-200"
      style={{ color: UI.slate, flexShrink: 0, transform: open ? "rotate(180deg)" : "none" }} />
  );

  return (
    <div ref={ref} style={{ position: "relative", ...style }}>
      {editable ? (
        <>
          <input
            style={{ ...inputBase, paddingRight: 30 }}
            value={value}
            placeholder={placeholder}
            autoComplete="off"
            aria-label={ariaLabel}
            role="combobox"
            aria-expanded={open}
            onChange={(e) => { onChange(e.target.value); setActive(-1); }}
            onFocus={openMenu}
            onKeyDown={onKeyDown}
          />
          {hasOptions && (
            <button type="button" tabIndex={-1} onClick={() => (open ? setOpen(false) : openMenu())}
              aria-label={`Choose ${ariaLabel ? ariaLabel.toLowerCase() : "an option"}`}
              aria-haspopup="listbox" aria-expanded={open}
              style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 28, display: "flex",
                alignItems: "center", justifyContent: "center", background: "transparent", cursor: "pointer" }}>
              {chevron}
            </button>
          )}
        </>
      ) : (
        <button type="button" onClick={() => (open ? setOpen(false) : openMenu())} onKeyDown={onKeyDown}
          aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel}
          style={{ ...inputBase, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
            cursor: "pointer", textAlign: "left" }}>
          <span style={{ color: selected ? UI.ink : UI.muted, minWidth: 0 }}>{selected ? selected.label : placeholder}</span>
          {chevron}
        </button>
      )}

      {/* the padding here is the gap left below the list when the form scrolls to it */}
      {mounted && <div ref={roomRef} style={{
        position: "absolute", left: 0, right: 0, zIndex: 30, pointerEvents: "none",
        top: "100%", paddingTop: 4, paddingBottom: 16,
      }}>
        <div ref={listRef} role="listbox" aria-label={ariaLabel} className="transition-all duration-200"
          style={{
            background: UI.paper, border: `1px solid ${UI.line}`, borderRadius: 4,
            boxShadow: "0 6px 16px rgba(0,0,0,.12)", maxHeight, overflowY: "auto",
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0) scaleY(1)" : "translateY(-4px) scaleY(0.96)",
            transformOrigin: "top", pointerEvents: open ? "auto" : "none",
            transitionProperty: "opacity, transform",
          }}>
          {options.map((o, i) => {
            if (o.header) {
              return (
                <div key={"h:" + o.header} role="presentation" style={{ padding: "8px 10px 4px", fontSize: 12,
                  fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.4, color: UI.slate }}>
                  {o.header}
                </div>
              );
            }
            const on = o.value === value;
            const indent = options.some((x) => x.header);
            return (
              <div key={o.value} role="option" aria-selected={on}
                onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)} onMouseEnter={() => setActive(i)}
                style={{
                  padding: `8px 10px 8px ${indent ? 20 : 10}px`, fontSize: 14, cursor: "pointer",
                  color: on ? UI.navy : UI.ink, fontWeight: on ? "bold" : "normal",
                  background: i === active || on ? UI.tint : "transparent",
                }}>
                {o.label}
              </div>
            );
          })}
        </div>
      </div>}
    </div>
  );
}
