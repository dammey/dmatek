"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

function clamp(v: number, a = -1, b = 1) {
  return Math.max(a, Math.min(b, v));
}

/** The front page's "swipe between D'Emporium and D'Provision" control.
 * Drag physics match the prototype's tilt math; the full-screen expanding
 * transition animation on release is simplified to a fade + router push
 * rather than the prototype's bespoke two-panel wipe. */
export default function Seam() {
  const router = useRouter();
  const [p, setP] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef<{ x0: number; left: number; width: number; moved: boolean } | null>(null);

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
    router.push(home ? "/emporium" : "/provision");
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
    <section
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      style={{ position: "relative", height: 340, cursor: "grab", overflow: "hidden", background: "#06382E", touchAction: "pan-y" }}
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
        <div style={{ background: "#0C1411", color: "#A6F000", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(24px,5vw,64px)", opacity: Math.max(0, 1 - Math.max(0, -p) * 0.4) }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em" }}>D&rsquo;EMPORIUM · FOR HOME</span>
          <span style={{ fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", letterSpacing: "-0.04em" }}>EMPORIUM</span>
        </div>
        <div style={{ background: "#06382E", color: "#D4A637", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(24px,5vw,64px)", opacity: Math.max(0, 1 - Math.max(0, p) * 0.4) }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em" }}>D&rsquo;PROVISION · FOR BUSINESS</span>
          <span style={{ fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", letterSpacing: "-0.045em" }}>Provision</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 90,
          height: 90,
          marginLeft: -45,
          marginTop: -45,
          borderRadius: "50%",
          background: p <= -1 ? "#A6F000" : p >= 1 ? "#D4A637" : "#F4F2EE",
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          fontSize: 13,
          color: "#0C1411",
          transform: `translateX(${(p * 40).toFixed(1)}px) scale(${(1 + a * 0.12).toFixed(3)})`,
          transition: isDragging ? "none" : "transform .6s cubic-bezier(.2,.7,.2,1)",
          pointerEvents: "none",
        }}
      >
        {a >= 1 ? "LET GO" : "SWIPE"}
      </div>
    </section>
  );
}
