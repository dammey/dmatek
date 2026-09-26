"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { businesses } from "@/lib/content";

export default function BusinessAccordion() {
  // Deep-link support: /businesses#<id> (footer, orbit, other pages) opens
  // that business; otherwise the first business is open by default.
  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    if (typeof window === "undefined") return 0;
    const hash = window.location.hash.replace("#", "");
    const i = businesses.findIndex((b) => b.id === hash);
    return i === -1 ? 0 : i;
  });

  useEffect(() => {
    if (openIndex === null) return;
    const hash = window.location.hash.replace("#", "");
    if (businesses[openIndex]?.id !== hash) return;
    requestAnimationFrame(() => {
      document.getElementById(businesses[openIndex].id)?.scrollIntoView({ block: "start" });
    });
    // Only scroll on the initial hash-driven open, not on later user toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3.5">
      {businesses.map((b, i) => {
        const open = openIndex === i;
        const pilotItems = b.pilot ? b.pilot.split(" · ") : [];
        return (
          <Reveal
            key={b.id}
            as="article"
            id={b.id}
            className="scroll-mt-28 overflow-hidden rounded-[clamp(26px,3.4vw,44px)] shadow-[0_16px_44px_rgba(6,56,46,0.08)]"
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
                className="rounded-[4px] px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.18em] text-gold"
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
                  <p
                    className="mb-5 max-w-[24em] text-[clamp(21px,2.4vw,30px)] font-extrabold leading-[1.2] tracking-[-0.025em] text-balance"
                    style={{ color: "#D4A637" }}
                  >
                    {b.prop}
                  </p>
                  <p className="mb-2.5 text-[11px] font-bold tracking-[0.16em] text-gold">AVAILABLE NOW</p>
                  <p className="mb-5 max-w-[36em] text-[16px] leading-[1.75] text-cream/82">{b.scope}</p>
                  <p className="m-0 text-[12.5px] font-bold tracking-[0.12em] text-gold">{b.note}</p>
                  {b.site && (
                    <a
                      href={b.site}
                      className="mt-5.5 inline-flex items-center gap-2 rounded-full bg-gold px-5.5 py-3.5 text-[14px] font-bold tracking-[0.04em] text-forest hover:bg-cream"
                    >
                      {b.siteLabel}
                    </a>
                  )}
                </div>
                <div
                  className="mx-auto flex w-full max-w-[280px] flex-col items-center justify-center rounded-[44px] p-[clamp(22px,2.6vw,32px)] text-center"
                  style={{ background: open ? "rgba(245,241,232,0.07)" : "rgba(6,56,46,0.06)" }}
                >
                  <p className="m-0 mb-3 text-[11px] font-bold tracking-[0.16em] text-gold">
                    {b.pilot ? "AVAILABLE AS A PILOT" : "ALL AVAILABLE NOW"}
                  </p>
                  <p className="m-0 mb-3.5 max-w-[16em] text-[14px] leading-[1.55] text-cream/82">
                    {pilotItems.length > 0 ? pilotItems.join(" · ") : "Everything listed here can be provided today."}
                  </p>
                  <div
                    className="relative mt-1 flex w-full flex-col items-center justify-center overflow-hidden p-3 text-center"
                    style={{
                      aspectRatio: "4/3",
                      background: b.img ? undefined : "rgba(6,56,46,0.06)",
                      borderRadius: "50% 50% 44% 56% / 48% 44% 56% 52%",
                    }}
                  >
                    {b.img && (
                      <>
                        <Image src={b.img} alt={`${b.name} — ${b.photo}`} fill sizes="280px" className="object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(6,56,46,0.1),rgba(4,48,40,0.55))" }} />
                      </>
                    )}
                    {!b.img && (
                      <p className="relative m-0 text-[10.5px] font-bold tracking-[0.14em] text-progress">
                        [ PHOTO &mdash; {b.photo} ]
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
