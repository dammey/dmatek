"use client";

import { useEffect, useRef, useState } from "react";
import ImageSlot from "../ImageSlot";
import { mono } from "../ui";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ROWS = ["IMEI clean, not blacklisted", "Battery health 91%", "No replaced parts", "Genuine charger"];

/** "How we check": 300vh section with a sticky panel. Scroll progress drives
 * the battery count-up to 91 and the four rows from "Checking…" to "Pass".
 * End state under reduced motion. Illustrates the check on a real device. */
export default function PinnedCheck() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [scrolled, setCk] = useState(0);
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
  const batt = Math.round(91 * Math.min(1, ck / 0.5));
  return (
    <section ref={ref} style={{ marginTop: "clamp(28px,4vw,48px)", background: "var(--d)", color: "#fff", height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 74, minHeight: "calc(100svh - 74px)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(16px,3vw,40px) var(--gut)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(20px,4vw,48px)", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ ...mono, color: "var(--a)" }}>HOW WE CHECK · YOUR UNIT, BEFORE DISPATCH</span>
            <div className="ds-batt" style={{ fontWeight: 800, lineHeight: 1, padding: ".06em 0", letterSpacing: "-.09em", color: "#9BE6C5" }}>
              {batt}
              <span style={{ fontSize: ".4em", letterSpacing: "-.04em" }}>%</span>
            </div>
            <b style={{ fontSize: "clamp(16px,1.8vw,21px)" }}>Battery health</b>
            <h2 style={{ margin: "6px 0 0", fontSize: "clamp(26px,3.6vw,48px)", letterSpacing: "-.05em", lineHeight: 0.95, fontWeight: 800 }}>We sell trust, not devices.</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ position: "relative", aspectRatio: "16/8", borderRadius: 16, overflow: "hidden", background: "var(--m)", color: "#fff" }}>
              <ImageSlot placeholder="Photo: a real device being verified" />
            </div>
            {ROWS.map((k, i) => {
              const done = ck > ((i + 0.6) / 4) * 0.95;
              return (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 15, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,.16)", paddingBottom: 10, opacity: ck > (i / 4) * 0.95 ? 1 : 0.4 }}>
                  <span>{k}</span>
                  <b style={{ color: done ? "#9BE6C5" : "rgba(255,255,255,.5)" }}>{done ? "Pass" : "Checking…"}</b>
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
