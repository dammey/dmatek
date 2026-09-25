"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { businesses, orbitPositions } from "@/lib/content";

/** "One customer. Six specialists." auto-rotating orbit on the homepage. */
export default function OrbitDiagram() {
  const router = useRouter();
  const [hoverBiz, setHoverBiz] = useState<number | null>(null);
  const hovered = hoverBiz === null ? null : businesses[hoverBiz];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[820px]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        style={{ animation: "dm-spin 90s linear infinite" }}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(245,241,232,0.16)" strokeWidth="0.3" />
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="#D4A637"
          strokeWidth="0.6"
          strokeDasharray="60 141"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(245,241,232,0.08)" strokeWidth="0.3" strokeDasharray="2 4" />
      </svg>

      <div
        className="absolute left-1/2 top-1/2 flex aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full p-[6%] text-center"
        style={{
          background: "radial-gradient(circle at 34% 30%, #0B4B3D, #032A22)",
          boxShadow: "0 0 0 1px rgba(212,166,55,0.28), 0 24px 60px rgba(0,0,0,0.35)",
        }}
      >
        <p className="m-0 mb-2 text-[clamp(9px,1.05vw,11px)] font-bold tracking-[0.18em] text-gold">
          {hovered ? hovered.verb : "THE RELATIONSHIP"}
        </p>
        <p className="m-0 mb-2 text-[clamp(14px,1.9vw,23px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-cream">
          {hovered ? hovered.name : "One customer"}
        </p>
        <p className="m-0 max-w-[16em] text-[clamp(9.5px,1.05vw,13px)] leading-[1.5] text-cream/74">
          {hovered ? hovered.solves : "Six specialists. One team accountable for the result."}
        </p>
      </div>

      <div className="absolute inset-0" style={{ animation: "dm-spin 90s linear infinite" }}>
        {businesses.map((b, i) => {
          const [x, y] = orbitPositions[i];
          const shortName = b.name.replace("D’Matek ", "");
          return (
            <div key={b.id} style={{ left: x, top: y }} className="absolute aspect-square w-[23%] -translate-x-1/2 -translate-y-1/2">
              <div className="h-full w-full" style={{ animation: "dm-spin-rev 90s linear infinite" }}>
                <button
                  type="button"
                  onClick={() => (b.site ? (window.location.href = b.site) : router.push(`/businesses#${b.id}`))}
                  onMouseEnter={() => setHoverBiz(i)}
                  onMouseLeave={() => setHoverBiz(null)}
                  onFocus={() => setHoverBiz(i)}
                  onBlur={() => setHoverBiz(null)}
                  className="group flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border p-[4%] text-center hover:!border-gold hover:!bg-gold hover:shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
                  style={{ background: "rgba(245,241,232,0.06)", borderColor: "rgba(245,241,232,0.22)" }}
                >
                  <span className="text-[clamp(8.5px,0.95vw,10px)] font-bold tracking-[0.16em] text-gold group-hover:text-forest">
                    {b.verb}
                  </span>
                  <span className="text-[clamp(11px,1.5vw,17px)] font-bold leading-[1.2] tracking-[-0.01em] text-cream group-hover:text-forest">
                    {shortName}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
