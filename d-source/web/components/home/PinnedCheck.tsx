"use client";

import { useEffect, useRef, useState } from "react";
import { mono } from "../ui";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Check = { u: string; l: string; s: number; rows: [string, string, boolean][] };
const TABS = ["Phones & tablets", "Laptops & computers", "Networking, servers & printers"];
const BAD = /Fail|No match|Expired|Pending|Mismatch|fault|Third|replaced/;

/** A demo check for a category, randomised exactly as the design's demo:
 * mostly passes, sometimes a failure (shown in the warning colour). */
function gen(i: number): Check {
  const r = Math.random;
  const pr = (p: number) => r() < p;
  if (i === 0) {
    const bt = 74 + Math.floor(r() * 25);
    return { u: "%", l: "Battery health", s: bt, rows: [["IMEI clean, not blacklisted", pr(0.8) ? "Pass" : "Fail", false], ["Battery health", `${bt}%`, bt < 80], ["No replaced parts", pr(0.75) ? "Pass" : "Screen replaced", false], ["Specs match the listing", pr(0.85) ? "Pass" : "Mismatch", false]] };
  }
  if (i === 1) {
    const cy = 60 + Math.floor(r() * 420);
    return { u: " cycles", l: "Battery cycle count", s: cy, rows: [["Battery cycle count", `${cy} cycles`, cy > 350], ["Screen, keyboard, ports tested", pr(0.8) ? "Pass" : "Key fault", false], ["Genuine charger", pr(0.8) ? "Genuine" : "Third-party", false], ["Specs match the listing", pr(0.85) ? "Pass" : "Mismatch", false]] };
  }
  const rows: [string, string, boolean][] = [["Genuine unit, verified channel", pr(0.9) ? "Pass" : "Fail", false], ["Serial number verified", pr(0.85) ? "Pass" : "No match", false], ["Manufacturer warranty status checked", pr(0.7) ? "Active" : "Expired", false], ["Firmware updated before install", pr(0.8) ? "Done" : "Pending", false]];
  return { u: "/4 passed", l: "Checks passed", s: rows.filter((x) => !/Fail|No match|Expired|Pending/.test(x[1])).length, rows };
}

/** "How we check": 300vh section with a sticky panel. Scroll progress drives
 * the battery count-up to 91 and the four rows from "Checking…" to "Pass".
 * End state under reduced motion. Illustrates the check on a real device. */
export default function PinnedCheck() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [scrolled, setCk] = useState(0);
  const [cat, setCat] = useState(0);
  // Generated on the client; values only show once the scroll reveals them,
  // so the server render ("Checking…", 0) always matches.
  const [checks, setChecks] = useState<Record<number, Check>>(() => ({ 0: gen(0) }));
  const c = checks[cat] ?? checks[0];
  const ck = reduce ? 1 : scrolled;
  useEffect(() => {
    if (reduce) return;
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const v = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)));
      setCk(Math.round(v * 50) / 50);
    };
    addEventListener("scroll", on, { passive: true });
    const raf = requestAnimationFrame(on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
    };
  }, [reduce]);
  const batt = Math.round(c.s * Math.min(1, ck / 0.5));
  return (
    <section ref={ref} style={{ marginTop: "clamp(28px,4vw,48px)", background: "var(--d)", color: "#fff", height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 74, minHeight: "calc(100svh - 74px)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(16px,3vw,40px) var(--gut)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(20px,4vw,48px)", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ ...mono, color: "var(--a)" }}>HOW WE CHECK · YOUR UNIT, BEFORE DISPATCH</span>
            <div className="ds-batt" style={{ fontWeight: 800, lineHeight: 1, padding: ".06em 0", letterSpacing: "-.09em", color: "#9BE6C5" }}>
              {batt}
              <span style={{ fontSize: ".4em", letterSpacing: "-.04em" }}>{c.u}</span>
            </div>
            <b style={{ fontSize: "clamp(16px,1.8vw,21px)" }}>{c.l}</b>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} role="tablist" aria-label="What we check">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={cat === i}
                  onClick={() => {
                    setChecks((x) => ({ ...x, [i]: gen(i) }));
                    setCat(i);
                  }}
                  style={{ border: "1px solid rgba(255,255,255,.35)", borderRadius: 999, padding: "8px 14px", fontWeight: 700, fontSize: 13, background: cat === i ? "#9BE6C5" : "transparent", color: cat === i ? "#06382E" : "#fff" }}
                >
                  {t}
                </button>
              ))}
            </div>
            <h2 style={{ margin: "6px 0 0", fontWeight: 800, fontSize: "clamp(26px,3.6vw,48px)", letterSpacing: "-.05em", lineHeight: 0.95 }}>We sell trust, not devices.</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ position: "relative", aspectRatio: "16/8", borderRadius: 16, overflow: "hidden", background: "var(--m)", color: "#fff" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- the design's plain <img> */}
              <img src="/photos/checked-technician.webp" alt="A technician checking a phone while a laptop shows battery health" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {c.rows.map(([k, v, w], i) => {
              const done = ck > ((i + 0.6) / 4) * 0.95;
              const bad = w || BAD.test(v);
              return (
                <div key={`${cat}-${k}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 15, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,.16)", paddingBottom: 10, opacity: ck > (i / 4) * 0.95 ? 1 : 0.4 }}>
                  <span>{k}</span>
                  <b style={{ color: done ? (bad ? "#F2A28C" : "#9BE6C5") : "rgba(255,255,255,.5)" }}>{done ? v : "Checking…"}</b>
                </div>
              );
            })}
            <div style={{ height: 3, background: "rgba(255,255,255,.16)", borderRadius: 9, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round(ck * 100)}%`, background: "#9BE6C5" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
