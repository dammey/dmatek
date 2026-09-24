"use client";

import { useState } from "react";
import Image from "next/image";
import { stages } from "@/lib/content";

/** Interactive pill nav + single active-stage detail card (Home "How We Work"). */
export default function StagePicker() {
  const [active, setActive] = useState(0);
  const s = stages[active];

  return (
    <div>
      <div className="relative mb-7 sm:mb-10">
        <svg viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-1/2 h-[90px] w-full -translate-y-1/2">
          <path
            d="M10 70 C 200 10, 380 86, 600 44 C 820 4, 1000 82, 1190 26"
            fill="none"
            stroke="rgba(6,56,46,0.18)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
        </svg>
        <div className="relative flex flex-wrap justify-between gap-2.5">
          {stages.map((stage, i) => {
            const isActive = i === active;
            return (
              <button
                key={stage.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(i)}
                className="flex flex-1 basis-[150px] cursor-pointer flex-col items-start gap-2 rounded-[26px] border px-5 py-4.5 text-left transition-transform hover:border-gold hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(6,56,46,0.12)]"
                style={{
                  background: isActive ? "#06382E" : "rgba(6,56,46,0.05)",
                  color: isActive ? "#F5F1E8" : "#06382E",
                  borderColor: isActive ? "#06382E" : "rgba(6,56,46,0.14)",
                  transform: isActive ? "translateY(-4px)" : "none",
                }}
              >
                <span className="text-[11px] font-bold tracking-[0.16em]" style={{ color: isActive ? "#D4A637" : "#28705A" }}>
                  {stage.num}
                </span>
                <span className="text-[17px] font-bold leading-[1.15] tracking-[-0.015em]">{stage.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={s.id}
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-7 rounded-[clamp(28px,4vw,52px)] p-[clamp(30px,4vw,60px)] shadow-[0_24px_60px_rgba(6,56,46,0.10)] sm:gap-14"
        style={{ background: "linear-gradient(140deg,#EFEADC,#E9E3D2)", animation: "dm-rise .55s cubic-bezier(.2,.8,.2,1) both" }}
      >
        <div>
          <div className="mb-4.5 flex items-baseline gap-4">
            <span className="text-[13px] font-bold tracking-[0.14em] text-gold">{s.num}</span>
            <h3 className="m-0 text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest">
              {s.name}
            </h3>
          </div>
          <p className="mb-6 max-w-[34em] text-[17.5px] leading-[1.75] text-ink">{s.body}</p>
          <span
            className="inline-block rounded-full px-5 py-2.75 text-[13px] font-bold tracking-[0.14em] text-forest"
            style={{ background: "rgba(212,166,55,0.28)" }}
          >
            {s.value}
          </span>
        </div>
        <div
          className="dm-blob relative mx-auto flex aspect-square w-full max-w-[380px] flex-col items-center justify-center overflow-hidden p-[clamp(26px,4vw,46px)] text-center text-cream shadow-[0_26px_60px_rgba(6,56,46,0.22)]"
          style={s.photoSrc ? undefined : { background: "radial-gradient(circle at 32% 28%, #0B4B3D, #043028)" }}
        >
          {s.photoSrc && (
            <>
              <Image
                src={s.photoSrc}
                alt={`${s.name} — ${s.photo}`}
                fill
                sizes="380px"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg,rgba(6,56,46,0.20),rgba(4,48,40,0.78))" }}
              />
            </>
          )}
          {!s.photoSrc && (
            <p className="relative m-0 mb-3.5 text-[11px] font-bold tracking-[0.16em] text-gold">[ PHOTO &mdash; {s.photo} ]</p>
          )}
          <p className="relative m-0 max-w-[16em] text-[clamp(20px,2.4vw,30px)] font-extrabold leading-[1.18] tracking-[-0.025em]">
            {s.outcome}
          </p>
        </div>
      </div>
    </div>
  );
}
