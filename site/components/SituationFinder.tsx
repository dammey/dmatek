"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { situationPills, situations } from "@/lib/content";
import { enquiryHref } from "@/lib/enquiry";
import { track } from "@/lib/analytics";

/** "What are you trying to achieve?" — three steps: pick a situation, read the
 * overview, tick what you need. Continue opens the shared enquiry with the
 * environment and message prefilled. Names no internal business. */
export default function SituationFinder() {
  const router = useRouter();
  const [sit, setSit] = useState(-1);
  const [picked, setPicked] = useState<string[]>([]);
  const sc = sit >= 0 ? situations[sit] : null;

  const needs = sc ? (sc.needs.includes("Not sure yet") ? sc.needs : [...sc.needs, "Not sure yet"]) : [];
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const choose = (i: number) => {
    setSit(i);
    setPicked([]);
  };

  const send = () => {
    if (!sc) return;
    track("finder_situation", { situation: sc.title, needs: picked.join(", ") || "Not sure yet" });
    const msg = `Situation: ${sc.title}. ${picked.length ? `I need: ${picked.join(", ")}.` : "I’m not sure yet what I need."}`;
    router.push(enquiryHref({ topic: sc.topic, org: sc.org, need: sc.wide ? "New setup" : undefined, message: msg, source: sc.src ?? "home_finder" }));
  };

  return (
    <div
      className="rounded-[clamp(26px,3.4vw,44px)] text-forest"
      style={{ background: "#F5F1E8", padding: "clamp(28px,4vw,56px) clamp(16px,2vw,24px)", margin: "0 calc(-1 * clamp(16px,2vw,24px))" }}
    >
      <h2 id="prob-h" className="mb-3.5 text-[clamp(30px,3.8vw,52px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance">
        What are you trying to achieve?
      </h2>
      <p className="mb-[clamp(18px,2.4vw,28px)] max-w-[40em] text-[16px] leading-[1.6] text-ink">
        Technology can be complicated. Getting things to work shouldn&rsquo;t be. Choose the situation closest to yours and
        we&rsquo;ll help identify the right combination of services.
      </p>

      {!sc && (
        <>
          <p className="mb-3.5 text-[11px] font-bold tracking-[0.16em] text-progress">STEP 1 OF 3 &middot; CHOOSE A SITUATION</p>
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[960px]:grid-cols-3 gap-[clamp(12px,1.6vw,20px)]">
            {situations.map((c, i) =>
              c.wide ? (
                <button
                  key={c.title}
                  type="button"
                  onClick={() => choose(i)}
                  data-track={c.track}
                  className="group flex flex-col gap-4 rounded-[22px] border border-forest/14 bg-white p-3.5 text-left text-forest transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_40px_rgba(6,56,46,0.14)] sm:col-span-full sm:flex-row sm:items-center sm:gap-7 sm:pr-8 min-[960px]:col-span-3"
                >
                  <span className="relative block aspect-video overflow-hidden rounded-2xl bg-[#E6E0CE] sm:w-[34%] sm:flex-none">
                    <Image src={c.img} alt={c.alt} fill sizes="(min-width: 900px) 380px, 90vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.09]" />
                  </span>
                  <span className="flex flex-col gap-2 px-1.5 pb-2 sm:pb-0">
                    <span className="text-[11px] font-bold tracking-[0.16em] text-progress">FOR DEVELOPERS</span>
                    <span className="text-[clamp(18px,1.8vw,22px)] font-extrabold tracking-[-0.01em]">{c.title}</span>
                    <span className="text-[15px] leading-[1.55] text-ink">{c.desc}</span>
                  </span>
                </button>
              ) : (
              <button
                key={c.title}
                type="button"
                onClick={() => choose(i)}
                className="group row-span-3 grid grid-rows-subgrid gap-y-2.5 rounded-[22px] border border-forest/14 bg-white p-3.5 pb-5 text-left text-forest transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_40px_rgba(6,56,46,0.14)]"
              >
                <span className="relative block aspect-video overflow-hidden rounded-2xl bg-[#E6E0CE]">
                  <Image
                    src={c.img}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1100px) 380px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.09]"
                  />
                </span>
                <span className="px-1.5 pt-1 text-[clamp(18px,1.8vw,22px)] font-extrabold tracking-[-0.01em]">{c.title}</span>
                <span className="px-1.5 text-[15px] leading-[1.55] text-ink">{c.desc}</span>
              </button>
              ),
            )}
          </div>
          <div className="mt-[clamp(18px,2.4vw,28px)] flex flex-wrap gap-2.5">
            {situationPills.map((e) => (
              <Link
                key={e.title}
                href={e.href}
                className="whitespace-nowrap rounded-full border border-forest/16 px-5 py-3 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-0.5 hover:border-gold hover:bg-gold"
                style={{ background: "rgba(6,56,46,0.06)" }}
              >
                {e.title}
              </Link>
            ))}
          </div>
        </>
      )}

      {sc && (
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-[clamp(18px,2.6vw,36px)] rounded-3xl border border-forest/14 bg-white p-[clamp(18px,2.4vw,30px)]"
          style={{ animation: "dm-rise .45s cubic-bezier(.2,.8,.2,1) both" }}
        >
          <div className="flex flex-col gap-3.5">
            <button
              type="button"
              onClick={() => choose(-1)}
              className="self-start border-none bg-transparent p-0 text-[14px] font-bold text-progress hover:text-forest"
            >
              &larr; All situations
            </button>
            <span className="relative block aspect-video overflow-hidden rounded-2xl bg-[#E6E0CE]">
              <Image src={sc.img} alt={sc.alt} fill sizes="(min-width: 900px) 560px, 90vw" className="object-cover" />
            </span>
            <p className="mt-1 text-[11px] font-bold tracking-[0.16em] text-progress">STEP 2 OF 3 &middot; YOUR SITUATION</p>
            <p className="m-0 text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.1] tracking-[-0.02em]">{sc.title}</p>
            <p className="m-0 text-[15.5px] leading-[1.65] text-ink">{sc.overview}</p>
            <p className="m-0 rounded-[14px] px-4 py-3 text-[14.5px] leading-[1.6] text-ink" style={{ background: "rgba(212,166,55,0.14)" }}>
              <strong className="text-forest">Depends on an assessment:</strong> {sc.assess}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="m-0 text-[11px] font-bold tracking-[0.16em] text-progress">STEP 3 OF 3 &middot; WHAT DO YOU NEED? PICK ANY</p>
            <div className="flex flex-col gap-2">
              {needs.map((n) => {
                const on = picked.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(n)}
                    className="flex items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left text-[15px] font-semibold text-forest hover:!border-gold"
                    style={{ background: on ? "rgba(212,166,55,0.14)" : "#FFFFFF", borderColor: on ? "#D4A637" : "rgba(6,56,46,0.16)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border-2 border-forest text-[13px] font-extrabold text-cream"
                      style={{ background: on ? "#06382E" : "transparent" }}
                    >
                      {on ? "✓" : ""}
                    </span>
                    {n}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={send}
              data-track="finder_continue"
              className="mt-1.5 self-start whitespace-nowrap rounded-full bg-gold px-7 py-4 text-[15px] font-bold text-forest transition-transform hover:-translate-y-0.5 hover:bg-forest hover:text-cream"
            >
              {picked.length ? `Continue with ${picked.length} selected →` : "Continue →"}
            </button>
            <p className="m-0 text-[13.5px] leading-[1.6] text-ink">
              Your choices go straight into the enquiry, so you won&rsquo;t have to repeat them. We recommend nothing until we
              understand the site, your constraints and your budget.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
