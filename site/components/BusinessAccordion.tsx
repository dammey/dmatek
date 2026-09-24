"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { businesses } from "@/lib/content";

export default function BusinessAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3.5">
      {businesses.map((b, i) => {
        const open = openIndex === i;
        const hasRealStat = !b.stat.trim().startsWith("[");
        const showStatOverlay = !b.photoSrc || hasRealStat;
        return (
          <Reveal
            key={b.slug}
            as="article"
            className="overflow-hidden rounded-[clamp(26px,3.4vw,44px)] shadow-[0_16px_44px_rgba(6,56,46,0.08)]"
            style={{
              background: open
                ? "radial-gradient(120% 140% at 8% 0%, #0B4B3D, #06382E 60%)"
                : "linear-gradient(160deg,#EFEADC,#E8E2D0)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex((cur) => (cur === i ? null : i))}
              aria-expanded={open}
              className="flex w-full flex-wrap items-center gap-3.5 gap-y-3.5 rounded-none border-none bg-transparent p-[clamp(24px,3vw,38px)] text-left"
            >
              <span
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-[18px] font-bold text-forest"
                style={{ background: open ? "#D4A637" : "rgba(6,56,46,0.10)" }}
              >
                {open ? "–" : "+"}
              </span>
              <span className="flex flex-1 basis-[260px] flex-col gap-1.5">
                <span
                  className="text-[clamp(24px,3vw,38px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
                  style={{ color: open ? "#F5F1E8" : "#06382E" }}
                >
                  {b.name}
                </span>
                <span
                  className="max-w-[34em] text-[16.5px] font-medium leading-[1.55]"
                  style={{ color: open ? "rgba(245,241,232,0.86)" : "#06382E" }}
                >
                  {b.solves}
                </span>
              </span>
              <span
                className="rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.18em] text-gold"
                style={{ background: "rgba(212,166,55,0.16)" }}
              >
                {b.verb}
              </span>
            </button>

            {open && (
              <div
                className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-center gap-5.5 px-[clamp(24px,3vw,38px)] pb-[clamp(28px,3vw,38px)] sm:gap-11"
                style={{ animation: "dm-rise .45s cubic-bezier(.2,.8,.2,1) both" }}
              >
                <div>
                  {b.prop && (
                    <p
                      className="mb-5 max-w-[24em] text-[clamp(21px,2.4vw,30px)] font-extrabold leading-[1.2] tracking-[-0.025em] text-balance"
                      style={{ color: "#D4A637" }}
                    >
                      {b.prop}
                    </p>
                  )}
                  <p className="mb-5 max-w-[36em] text-[16px] leading-[1.75] text-cream/82">{b.scope}</p>
                  <p className="m-0 text-[12.5px] font-bold tracking-[0.12em] text-gold">{b.note}</p>
                </div>
                <div
                  className="dm-blob relative mx-auto flex aspect-square w-full max-w-[280px] flex-col items-center justify-center overflow-hidden p-[clamp(26px,3vw,40px)] text-center"
                  style={b.photoSrc ? undefined : { background: "rgba(245,241,232,0.07)" }}
                >
                  {b.photoSrc && (
                    <Image
                      src={b.photoSrc}
                      alt={`${b.name} — ${b.photo}`}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  )}
                  {showStatOverlay && (
                    <>
                      {b.photoSrc && (
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(180deg,rgba(6,56,46,0.15),rgba(4,48,40,0.72))" }}
                        />
                      )}
                      <p className="relative m-0 mb-2.5 text-[clamp(28px,3.4vw,44px)] font-extrabold leading-none tracking-[-0.03em] text-gold">
                        {b.stat}
                      </p>
                      <p className="relative m-0 max-w-[14em] text-[14px] leading-[1.55] text-cream/82">{b.statLabel}</p>
                    </>
                  )}
                  {!b.photoSrc && (
                    <p className="relative m-0 mt-3.5 text-[10.5px] font-bold tracking-[0.14em] text-progress">
                      [ PHOTO &mdash; {b.photo} ]
                    </p>
                  )}
                </div>
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
