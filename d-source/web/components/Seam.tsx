"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { playStoreTransition } from "@/lib/storeTransition";

function clamp(v: number, a = -1, b = 1) {
  return Math.max(a, Math.min(b, v));
}

/** The front page's "swipe between D'Emporium and D'Provision" control.
 * Drag physics match the prototype's tilt math; release plays the full
 * two-leaf wipe transition from lib/storeTransition.ts, same as the
 * prototype's go(). */
export default function Seam() {
  const router = useRouter();
  const [p, setP] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef<{ x0: number; left: number; width: number; moved: boolean } | null>(null);
  const puckRef = useRef<HTMLDivElement>(null);

  function down(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    dragging.current = { x0: e.clientX, left: r.left, width: r.width, moved: false };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragging.current;
    if (!d) return;
    const dx = e.clientX - d.x0;
    if (Math.abs(dx) > 6) d.moved = true;
    if (!d.moved) return;
    setP(clamp(dx / Math.min(d.width * 0.28, 300), -1.15, 1.15));
  }

  function open(home: boolean) {
    playStoreTransition(router, home ? "emporium" : "provision", puckRef.current);
  }

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") open(true);
    else if (e.key === "ArrowRight") open(false);
  }

  function up(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragging.current;
    dragging.current = null;
    setIsDragging(false);
    if (!d) return;
    if (p <= -1) return open(true);
    if (p >= 1) return open(false);
    if (!d.moved) {
      const home = e.clientX - d.left < d.width / 2;
      open(home);
      return;
    }
    setP(0);
  }

  const a = Math.abs(p);
  return (
    <div>
      <section
        tabIndex={0}
        onKeyDown={keyDown}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        style={{ position: "relative", height: "clamp(480px,66vh,640px)", borderRadius: 28, cursor: "grab", overflow: "hidden", background: "#151515", touchAction: "pan-y", outline: "none" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            transform: `perspective(1200px) translateX(${(-p * 10).toFixed(2)}%) rotateX(${(a * 14).toFixed(2)}deg) scale(${(1 + a * 0.35).toFixed(3)})`,
            transition: isDragging ? "none" : "transform .6s cubic-bezier(.2,.7,.2,1)",
          }}
        >
          <div
            style={{
              background: "#0A0A0A",
              backgroundImage: "linear-gradient(rgba(242,242,242,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(242,242,242,.05) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              color: "#F2F2F2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(22px,4vw,56px)",
              opacity: Math.max(0, 1 - Math.max(0, -p) * 0.4),
            }}
          >
            <div style={{ maxWidth: "min(44%,520px)", display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "#A6F000" }}>D&rsquo;EMPORIUM · FOR HOME</span>
              <span style={{ fontWeight: 800, fontSize: "clamp(26px,4.4vw,68px)", lineHeight: 0.92, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
                Get it. Set it up. <span style={{ color: "#A6F000" }}>Sorted.</span>
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(11px,1vw,13px)", letterSpacing: "0.08em", color: "#BDBDBD" }}>NATIONWIDE DELIVERY · INSTALLATION · REPAIRS</span>
            </div>
          </div>
          <div
            style={{
              background: "radial-gradient(90% 80% at 80% 20%,#0F5A48 0%,#06382E 55%,#042A22 100%)",
              color: "#F5F1E8",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              padding: "clamp(22px,4vw,56px)",
              opacity: Math.max(0, 1 - Math.max(0, p) * 0.4),
            }}
          >
            <div style={{ maxWidth: "min(44%,520px)", display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", gap: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#D4A637" }}>D&rsquo;PROVISION · FOR BUSINESS</span>
              <span style={{ fontWeight: 800, fontSize: "clamp(26px,4.4vw,68px)", lineHeight: 0.98, letterSpacing: "-0.045em" }}>
                Equip the whole building. <span style={{ color: "#D4A637" }}>Specified properly.</span>
              </span>
              <span style={{ fontSize: "clamp(13px,1.2vw,16px)", fontWeight: 600, color: "rgba(245,241,232,.8)" }}>Volume pricing · Quotes in 4 working hours · Free site surveys</span>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            zIndex: 2,
            left: "50%",
            bottom: "clamp(22px,5vh,44px)",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px,2vw,22px)",
            pointerEvents: "none",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", color: "#A6F000", whiteSpace: "nowrap" }}>&larr; HOME</span>
          <div
            ref={puckRef}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: p <= -1 ? "#A6F000" : p >= 1 ? "#D4A637" : "#F4F2EE",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.16em",
              color: "#151515",
              boxShadow: "0 14px 40px rgba(0,0,0,.35),0 0 0 6px rgba(244,242,238,.22)",
              transform: `translateX(${(p * 40).toFixed(1)}px) scale(${(1 + a * 0.12).toFixed(3)})`,
              transition: isDragging ? "none" : "transform .6s cubic-bezier(.2,.7,.2,1)",
            }}
          >
            {a >= 1 ? "LET GO" : "SWIPE"}
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", color: "#D4A637", whiteSpace: "nowrap" }}>BUSINESS &rarr;</span>
        </div>
      </section>
      <p style={{ margin: "14px 0 0", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#66625B" }}>
        SWIPE TOWARD A STORE TO ENTER · OR TAP A SIDE
      </p>
    </div>
  );
}
