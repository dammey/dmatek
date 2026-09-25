"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PilotLabel from "@/components/PilotLabel";
import Reveal from "@/components/Reveal";
import { D_FOUNDRY_URL, D_SOURCE_URL, entryPoints } from "@/lib/content";

export default function SolutionsAccordion() {
  // Deep-link support: /solutions#ep-<id> opens and scrolls to that entry point.
  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash.replace("#", "");
    const i = entryPoints.findIndex((e) => `ep-${e.id}` === hash);
    return i === -1 ? null : i;
  });

  useEffect(() => {
    if (openIndex === null) return;
    const hash = window.location.hash.replace("#", "");
    if (`ep-${entryPoints[openIndex].id}` !== hash) return;
    requestAnimationFrame(() => {
      document.getElementById(`ep-${entryPoints[openIndex].id}`)?.scrollIntoView({ block: "start" });
    });
    // Only scroll on the initial hash-driven open, not on later user toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3.5">
      {entryPoints.map((e, i) => {
        const open = openIndex === i;
        const now = e.now.length ? e.now : ["Everything here is currently a pilot."];
        const contactHref = `/contact?topic=${encodeURIComponent(e.title)}`;

        let extra: { label: string; href: string } | null = null;
        if (e.extra?.type === "health") {
          extra = {
            label: "Request a Technology Health Check",
            href: `/contact?topic=${encodeURIComponent(e.title)}&message=${encodeURIComponent("I’d like to request a Technology Health Check.")}`,
          };
        } else if (e.extra?.type === "foundry") {
          extra = { label: "Explore D’Foundry →", href: D_FOUNDRY_URL };
        } else if (e.extra?.type === "source") {
          extra = { label: "Shop D’Source →", href: D_SOURCE_URL };
        } else if (e.extra?.type === "env") {
          extra = { label: "See Connected Estate →", href: `/solutions/${e.extra.envId}` };
        }

        return (
          <Reveal
            key={e.id}
            as="article"
            id={`ep-${e.id}`}
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
              className="flex w-full flex-wrap items-center gap-3.5 gap-y-3.5 rounded-none border-none bg-transparent p-[clamp(22px,2.6vw,32px)] text-left"
            >
              <span
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-[18px] font-bold text-forest"
                style={{ background: open ? "#D4A637" : "rgba(6,56,46,0.10)" }}
              >
                {open ? "–" : "+"}
              </span>
              <span
                className="flex-1 basis-[260px] text-[clamp(22px,2.6vw,32px)] font-extrabold leading-[1.1] tracking-[-0.025em]"
                style={{ color: open ? "#F5F1E8" : "#06382E" }}
              >
                {e.title}
              </span>
              <span className="text-[11.5px] font-bold tracking-[0.16em] text-gold">{String(i + 1).padStart(2, "0")}</span>
            </button>

            {open && (
              <div
                className="flex flex-col gap-6 px-[clamp(24px,3vw,38px)] pb-[clamp(28px,3vw,40px)]"
                style={{ animation: "dm-rise .45s cubic-bezier(.2,.8,.2,1) both" }}
              >
                <p className="m-0 max-w-[40em] text-[clamp(18px,1.9vw,22px)] font-medium leading-[1.55] text-cream/90 text-pretty">
                  {e.copy}
                </p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 sm:gap-10">
                  <div>
                    <p className="mb-3.5 text-[11px] font-bold tracking-[0.16em] text-gold">AVAILABLE NOW</p>
                    <div className="flex flex-wrap gap-2">
                      {now.map((n) => (
                        <span key={n} className="rounded-full px-4.5 py-2.75 text-[14.5px] font-semibold text-cream" style={{ background: "rgba(245,241,232,0.08)" }}>
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                  <PilotLabel items={e.pilot} topic={e.title} tone="dark" compact />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={contactHref}
                    className="rounded-full bg-gold px-6 py-3.75 text-[14.5px] font-bold text-forest transition-transform hover:-translate-y-0.5 hover:bg-cream"
                  >
                    Tell us what you need &rarr;
                  </Link>
                  {extra && (
                    <a
                      href={extra.href}
                      className="rounded-full px-6 py-3.5 text-[14.5px] font-bold text-cream hover:!border-gold hover:!text-gold"
                      style={{ border: "1px solid rgba(245,241,232,0.3)" }}
                    >
                      {extra.label}
                    </a>
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
