"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { playStoreTransition } from "@/lib/storeTransition";

const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const EASE_T = "all .6s cubic-bezier(.2,.7,.2,1)";

/** The front page's "swipe between D'Emporium and D'Provision" control —
 * a port of the design source's smDown/smMove/smUp/smApply/smOpen. Dragging
 * tilts the scene and fades a full-viewport store plate in over the whole
 * page; releasing past the threshold (or tapping a side) plays the store
 * transition from lib/storeTransition.ts. */
export default function Seam() {
  const router = useRouter();
  const [p, setP] = useState(0);
  const [anim, setAnim] = useState(true);
  const [width, setWidth] = useState(1000);
  const seamRef = useRef<HTMLDivElement>(null);
  const puckRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x0: number; left: number; w: number; moved: boolean; p: number } | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = seamRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (openTimer.current) clearTimeout(openTimer.current);
    };
  }, []);

  function apply(next: number, animate: boolean) {
    setAnim(animate);
    setP(next);
  }

  function go(home: boolean) {
    playStoreTransition(router, home ? "emporium" : "provision", puckRef.current);
  }

  function smOpen(home: boolean) {
    apply(home ? -1 : 1, true);
    openTimer.current = setTimeout(() => go(home), 420);
  }

  function down(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button > 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    drag.current = { x0: e.clientX, left: r.left, w: r.width, moved: false, p: 0 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture can fail if the pointer is already gone; dragging still works within bounds.
    }
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x0;
    if (Math.abs(dx) > 6) d.moved = true;
    if (!d.moved) return;
    d.p = cl(dx / Math.min(d.w * 0.28, 300), -1.15, 1.15);
    apply(d.p, false);
  }

  function up(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (d.p <= -1) return go(true);
    if (d.p >= 1) return go(false);
    if (!d.moved && e.type === "pointerup") return smOpen(e.clientX - d.left < d.w / 2);
    apply(0, true);
  }

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") smOpen(true);
    else if (e.key === "ArrowRight") smOpen(false);
  }

  const a = Math.abs(p);
  const t = anim ? EASE_T : "none";
  const dist = Math.min(width * 0.28, 300);

  return (
    <section data-screen-label="Seam" style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(12px,2vw,24px) 0" }}>
      <div
        ref={seamRef}
        tabIndex={0}
        onKeyDown={keyDown}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        style={{ position: "relative", height: "clamp(480px,66vh,640px)", borderRadius: 28, overflow: "hidden", touchAction: "pan-y", userSelect: "none", cursor: "grab", outline: "none", background: "#151515" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 100%",
            transform: `perspective(1200px) translateX(${(-p * 10).toFixed(2)}%) rotateX(${(a * 14).toFixed(2)}deg) scale(${(1 + a * 0.35).toFixed(3)})`,
            transition: t,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(90% 80% at 80% 20%,#0F5A48 0%,#06382E 55%,#042A22 100%)",
              color: "#F5F1E8",
              display: "flex",
              justifyContent: "flex-end",
              padding: "clamp(22px,4vw,56px)",
            }}
          >
            <div
              style={{
                maxWidth: "min(44%,520px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                textAlign: "right",
                gap: 14,
                transformOrigin: "100% 0",
                transform: `scale(${(1 + Math.max(0, p) * 0.12).toFixed(3)})`,
                opacity: 1 - Math.max(0, -p) * 0.85,
                transition: t,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#D4A637" }}>D&rsquo;PROVISION · FOR BUSINESS</span>
              <span style={{ fontWeight: 800, fontSize: "clamp(26px,4.4vw,68px)", lineHeight: 0.98, letterSpacing: "-0.045em" }}>
                Equip the whole building. <span style={{ color: "#D4A637" }}>Specified properly.</span>
              </span>
              <span style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 600, color: "rgba(245,241,232,.8)" }}>Volume pricing · Quotes in 4 working hours · Free site surveys</span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#0A0A0A",
              backgroundImage: "linear-gradient(rgba(242,242,242,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(242,242,242,.05) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              color: "#F2F2F2",
              clipPath: "inset(0 50% 0 0)",
              padding: "clamp(22px,4vw,56px)",
            }}
          >
            <div
              style={{
                maxWidth: "min(44%,520px)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                transformOrigin: "0 0",
                transform: `scale(${(1 + Math.max(0, -p) * 0.12).toFixed(3)})`,
                opacity: 1 - Math.max(0, p) * 0.85,
                transition: t,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "#A6F000" }}>D&rsquo;EMPORIUM · FOR HOME</span>
              <span style={{ letterSpacing: "-0.04em", fontWeight: 800, fontSize: "clamp(26px,4.4vw,68px)", lineHeight: 0.92, textTransform: "uppercase" }}>
                Get it. Set it up. <span style={{ color: "#A6F000" }}>Sorted.</span>
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(11px,1vw,13px)", letterSpacing: "0.08em", color: "#BDBDBD" }}>NATIONWIDE DELIVERY · INSTALLATION · REPAIRS</span>
            </div>
          </div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, marginLeft: -1, background: "#F4F2EE", pointerEvents: "none" }} />
        </div>

        {/* Full-viewport store plates: these fade over the whole page as you drag, not just the box. */}
        <div
          aria-hidden
          style={{ position: "fixed", inset: 0, zIndex: 150, opacity: cl(-p), transition: t, pointerEvents: "none", background: "#0A0A0A", color: "#F2F2F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: 24 }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.22em", color: "#A6F000" }}>D&rsquo;EMPORIUM · FOR HOME</span>
          <span style={{ fontWeight: 800, fontSize: "clamp(48px,9vw,140px)", lineHeight: 0.88, letterSpacing: "-0.02em" }}>EMPORIUM</span>
        </div>
        <div
          aria-hidden
          style={{ position: "fixed", inset: 0, zIndex: 150, opacity: cl(p), transition: t, pointerEvents: "none", background: "#06382E", color: "#F5F1E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: 24 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: "#D4A637" }}>D&rsquo;PROVISION · FOR BUSINESS</span>
          <span style={{ fontWeight: 800, fontSize: "clamp(48px,9vw,140px)", lineHeight: 0.88, letterSpacing: "-0.045em" }}>Provision</span>
        </div>

        <div style={{ position: "absolute", zIndex: 160, left: "50%", bottom: "clamp(22px,5vh,44px)", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "clamp(10px,2vw,22px)", pointerEvents: "none" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", color: "#A6F000", whiteSpace: "nowrap" }}>&larr; HOME</span>
          <div
            ref={puckRef}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: p <= -1 ? "#A6F000" : p >= 1 ? "#D4A637" : "#F4F2EE",
              color: "#151515",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              boxShadow: "0 14px 40px rgba(0,0,0,.35),0 0 0 6px rgba(244,242,238,.22)",
              transform: `translateX(${(p * dist).toFixed(1)}px) scale(${(1 + a * 0.12).toFixed(3)})`,
              transition: t,
            }}
          >
            {a >= 1 ? "LET GO" : "SWIPE"}
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", color: "#D4A637", whiteSpace: "nowrap" }}>BUSINESS &rarr;</span>
        </div>
      </div>
      <p style={{ margin: "14px 0 0", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#66625B" }}>
        SWIPE TOWARD A STORE TO ENTER · OR TAP A SIDE
      </p>
    </section>
  );
}
