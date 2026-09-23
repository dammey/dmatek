"use client";

import { useEffect, useRef } from "react";

/** Soft glow that follows the cursor within the hero section it's placed in. */
export default function HeroGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glow = ref.current;
    if (!glow) return;
    const host = glow.parentElement;
    if (!host) return;

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) {
        glow.style.opacity = "0";
        return;
      }
      glow.style.opacity = "1";
      glow.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        margin: "-260px 0 0 -260px",
        background: "radial-gradient(circle, rgba(6,56,46,0.10), rgba(6,56,46,0) 68%)",
      }}
    />
  );
}
