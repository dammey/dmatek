"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { btn, mono } from "../ui";

const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** Entry swipe: "For you" (cream, left) | "For your business" (forest, right).
 * p = dx / min(width*.28, 300), clamped ±1.15. Release past |p| ≥ 1 holds the
 * full-screen overlay, navigates (~650ms) and fades it out; below, springs
 * back (.6s). Tap a side or press ←/→ to play the same fade. The two buttons
 * underneath are always there: swipe is never the only way in. */
export default function SeamEntry() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const sceneR = useRef<HTMLDivElement>(null);
  const eoR = useRef<HTMLDivElement>(null);
  const poR = useRef<HTMLDivElement>(null);
  const puckR = useRef<HTMLDivElement>(null);
  const ehR = useRef<HTMLDivElement>(null);
  const phR = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x0: number; left: number; w: number; moved: boolean; p: number } | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function apply(p: number, anim: boolean) {
    const [scene, eo, po, puck, eh, ph] = [sceneR.current, eoR.current, poR.current, puckR.current, ehR.current, phR.current];
    if (!scene || !puck) return;
    [scene, eo, po, puck, eh, ph].forEach((el) => {
      if (el) el.style.transition = anim ? "all .6s cubic-bezier(.2,.7,.2,1)" : "none";
    });
    const a = Math.abs(p);
    scene.style.transform = `perspective(1200px) translateX(${(-p * 10).toFixed(2)}%) rotateX(${(a * 14).toFixed(2)}deg) scale(${(1 + a * 0.35).toFixed(3)})`;
    if (eo) eo.style.opacity = cl(-p).toFixed(3);
    if (po) po.style.opacity = cl(p).toFixed(3);
    const w = root.current?.offsetWidth ?? 1000;
    const dist = Math.min(w * 0.28, 300);
    puck.style.transform = `translateX(${(p * dist).toFixed(1)}px) scale(${(1 + a * 0.12).toFixed(3)})`;
    puck.textContent = a >= 1 ? "LET GO" : "SWIPE";
    puck.style.background = p <= -1 ? "#9BE6C5" : p >= 1 ? "#D4A637" : "#fff";
    if (eh) {
      eh.style.transform = `scale(${(1 + Math.max(0, -p) * 0.12).toFixed(3)})`;
      eh.style.opacity = (1 - Math.max(0, p) * 0.85).toFixed(3);
    }
    if (ph) {
      ph.style.transform = `scale(${(1 + Math.max(0, p) * 0.12).toFixed(3)})`;
      ph.style.opacity = (1 - Math.max(0, -p) * 0.85).toFixed(3);
    }
  }

  function finish(you: boolean) {
    if (reduce()) {
      router.push(you ? "/shop" : "/provision");
      return;
    }
    apply(you ? -1 : 1, true);
    later(() => {
      router.push(you ? "/shop" : "/provision");
      later(() => {
        const o = (you ? eoR : poR).current;
        if (o) {
          o.style.transition = "opacity .7s ease";
          o.style.opacity = "0";
        }
        later(() => apply(0, false), 800);
      }, 120);
    }, 650);
  }

  function open(you: boolean) {
    if (reduce()) return finish(you);
    apply(you ? -1 : 1, true);
    later(() => finish(you), 400);
  }

  return (
    <section style={{ padding: "clamp(24px,4vw,48px) var(--gut) 0" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-.03em", fontWeight: 800 }}>How do you want to buy?</h2>
      <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 15 }}>Same catalogue behind both doors.</p>
      <div
        ref={root}
        className="ds-seam"
        tabIndex={0}
        role="group"
        aria-label="Choose: for you or for your business. Drag the puck, tap a side, or use the arrow keys."
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") open(true);
          if (e.key === "ArrowRight") open(false);
        }}
        onPointerDown={(e) => {
          if (e.button > 0) return;
          const r = e.currentTarget.getBoundingClientRect();
          drag.current = { x0: e.clientX, left: r.left, w: r.width, moved: false, p: 0 };
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x0;
          if (Math.abs(dx) > 6) d.moved = true;
          if (!d.moved) return;
          d.p = cl(dx / Math.min(d.w * 0.28, 300), -1.15, 1.15);
          apply(d.p, false);
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          if (!d) return;
          drag.current = null;
          if (d.p <= -1) return finish(true);
          if (d.p >= 1) return finish(false);
          if (!d.moved) return open(e.clientX - d.left < d.w / 2);
          apply(0, true);
        }}
        onPointerCancel={() => {
          drag.current = null;
          apply(0, true);
        }}
        style={{ position: "relative", overflow: "hidden", touchAction: "pan-y", userSelect: "none", cursor: "grab", outline: "none", background: "#042A22", color: "#fff" }}
      >
        <div ref={sceneR} style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 80% at 80% 20%,#0F5A48 0%,var(--d) 55%,#042A22 100%)", display: "flex", justifyContent: "flex-end", padding: "var(--sp)" }}>
            <div ref={phR} style={{ width: "44%", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", gap: 12, transformOrigin: "100% 0" }}>
              <span style={{ ...mono, letterSpacing: ".2em", color: "var(--a)" }}>D’SOURCE PROVISION</span>
              <span style={{ fontWeight: 800, fontSize: "var(--sfs)", lineHeight: 0.95, letterSpacing: "-.05em" }}>For your business</span>
              <span style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 600, opacity: 0.9 }}>
                Bulk quotes · Setup and installation · Repairs
                <br />
                Quotes within 24 hours
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "var(--t)", color: "var(--d)", clipPath: "inset(0 50% 0 0)", display: "flex", padding: "var(--sp)" }}>
            <div ref={ehR} style={{ width: "44%", minWidth: 0, display: "flex", flexDirection: "column", gap: 12, transformOrigin: "0 0" }}>
              <span style={{ ...mono, letterSpacing: ".2em", color: "var(--m)" }}>D’SOURCE SHOP</span>
              <span style={{ fontWeight: 800, fontSize: "var(--sfs)", lineHeight: 0.95, letterSpacing: "-.05em" }}>For you</span>
              <span style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 600 }}>
                Personal devices · Delivered and set up
                <br />
                Pay online or on delivery
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, marginLeft: -1, background: "#fff", pointerEvents: "none" }} />
        </div>
        <div style={{ position: "absolute", zIndex: 5, left: "50%", bottom: "clamp(16px,4vh,32px)", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "clamp(8px,2vw,18px)", pointerEvents: "none" }}>
          <span style={{ ...mono, letterSpacing: ".14em", whiteSpace: "nowrap", color: "var(--d)", background: "var(--t)", borderRadius: 99, padding: "5px 9px" }}>← FOR YOU</span>
          <div
            ref={puckR}
            style={{ width: 76, height: 76, borderRadius: "50%", display: "grid", placeItems: "center", ...mono, letterSpacing: ".14em", boxShadow: "0 10px 30px rgba(0,0,0,.35),0 0 0 6px rgba(255,255,255,.2)", background: "#fff", color: "var(--d)" }}
          >
            SWIPE
          </div>
          <span style={{ ...mono, letterSpacing: ".14em", whiteSpace: "nowrap", color: "var(--onA)", background: "var(--a)", borderRadius: 99, padding: "5px 9px" }}>BUSINESS →</span>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
        <Link href="/shop" style={btn("deep", { flex: "1 1 160px" })}>
          Shop devices →
        </Link>
        <Link href="/provision" style={btn("buy", { flex: "1 1 160px" })}>
          Explore Provision →
        </Link>
      </div>
      <p style={{ margin: "10px 0 0", ...mono, letterSpacing: ".12em", color: "var(--mutedMono)", textAlign: "center" }}>DRAG THE PUCK TOWARD A SIDE · OR TAP A SIDE · OR USE THE BUTTONS</p>

      {/* Full-screen overlays the swipe fades in. */}
      <div ref={eoR} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 300, opacity: 0, pointerEvents: "none", background: "#EFEADC", color: "#06382E", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24 }}>
        <span style={{ ...mono, fontSize: 12, letterSpacing: ".22em" }}>D’SOURCE SHOP</span>
        <span style={{ fontWeight: 800, fontSize: "clamp(56px,13vw,200px)", lineHeight: 0.88, letterSpacing: "-.06em" }}>For you</span>
      </div>
      <div ref={poR} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 300, opacity: 0, pointerEvents: "none", background: "#06382E", color: "#F5F1E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24 }}>
        <span style={{ ...mono, fontSize: 12, letterSpacing: ".22em", color: "#D4A637" }}>D’SOURCE PROVISION</span>
        <span style={{ fontWeight: 800, fontSize: "clamp(56px,13vw,200px)", lineHeight: 0.88, letterSpacing: "-.06em" }}>Provision</span>
      </div>
    </section>
  );
}
