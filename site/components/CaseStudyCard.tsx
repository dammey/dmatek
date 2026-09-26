"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import type { CaseStudy } from "@/lib/content";

type Facet = "before" | "did" | "after";

const FACET_LABELS: Record<Facet, string> = {
  before: "PROBLEM",
  did: "WHAT WE DID",
  after: "WHAT CHANGED",
};

export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [facet, setFacet] = useState<Facet>("before");
  const text = facet === "before" ? study.before : facet === "did" ? study.did : study.after;
  const meta = facet === "did" ? study.divisions : "";

  return (
    <Reveal
      as="article"
      id={study.id}
      className="scroll-mt-28 rounded-[clamp(28px,4vw,56px)] p-[clamp(30px,4vw,60px)] shadow-[0_18px_50px_rgba(6,56,46,0.08)]"
      style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}
    >
      <div className="mb-5.5 flex flex-wrap gap-2.5">
        <span
          className="rounded-[4px] px-4.5 py-2.25 text-[11px] font-bold tracking-[0.16em] text-forest"
          style={{ background: "rgba(40,112,90,0.14)" }}
        >
          {study.sector}
        </span>
        <span
          className="rounded-[4px] px-4.5 py-2.25 text-[11px] font-bold tracking-[0.16em] text-forest"
          style={{ background: "rgba(212,166,55,0.3)" }}
        >
          {study.tenure}
        </span>
      </div>

      <h2 className="mb-6 max-w-[24em] text-[clamp(27px,3.7vw,50px)] font-extrabold leading-[1.06] tracking-[-0.032em] text-forest text-balance sm:mb-9.5">
        {study.title}
      </h2>

      <div className="mb-5.5 flex flex-wrap gap-2">
        {(Object.keys(FACET_LABELS) as Facet[]).map((key) => {
          const active = facet === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setFacet(key)}
              className="cursor-pointer rounded-full px-5.5 py-3 text-[12px] font-bold tracking-[0.14em] hover:border-gold"
              style={{
                background: active ? "#06382E" : "transparent",
                color: active ? "#F5F1E8" : "#06382E",
                border: `1px solid ${active ? "#06382E" : "rgba(6,56,46,0.2)"}`,
              }}
            >
              {FACET_LABELS[key]}
            </button>
          );
        })}
      </div>

      <div
        key={facet}
        className="mb-6.5 rounded-[clamp(22px,3vw,36px)] p-[clamp(24px,3vw,40px)] sm:mb-9.5"
        style={{ background: "rgba(245,241,232,0.7)", animation: "dm-rise .45s cubic-bezier(.2,.8,.2,1) both" }}
      >
        <p className="m-0 text-[clamp(17px,1.9vw,21px)] leading-[1.7] text-charcoal">{text}</p>
        {meta && <p className="mt-4.5 text-[13.5px] font-bold tracking-[0.06em] text-progress">{meta}</p>}
      </div>

      <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-11">
        <div
          className="relative mx-auto flex aspect-square w-full max-w-[320px] flex-col items-center justify-center p-[clamp(24px,3vw,40px)] text-center text-cream"
          style={{
            background: "radial-gradient(circle at 30% 26%, #0B4B3D, #043028)",
            borderRadius: "50% 50% 42% 58% / 46% 50% 50% 54%",
            animation: "dm-drift 20s ease-in-out infinite",
          }}
          role="img"
          aria-label="Placeholder installation photograph"
        >
          <p className="m-0 mb-3 text-[11px] font-bold tracking-[0.16em] text-gold">[ BEFORE / AFTER PHOTOS REQUIRED ]</p>
          <p className="m-0 max-w-[16em] text-[15px] leading-[1.6] text-cream/86">{study.photo}</p>
        </div>
        <blockquote className="m-0 rounded-[clamp(22px,3vw,36px)] bg-cream p-[clamp(26px,3vw,42px)] shadow-[0_14px_36px_rgba(6,56,46,0.08)]">
          <p className="mb-5 text-[clamp(18px,2vw,25px)] font-semibold leading-[1.5] tracking-[-0.015em] text-forest text-pretty">
            {study.quote}
          </p>
          <footer className="text-[13px] font-bold tracking-[0.06em] text-progress">{study.attrib}</footer>
        </blockquote>
      </div>
    </Reveal>
  );
}
