"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { businesses, type Business } from "@/lib/content";
import { enquiryHref } from "@/lib/enquiry";

const EASE = "cubic-bezier(.2,.8,.2,1)";
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Icon({ id }: { id: Business["id"] }) {
  const p = { viewBox: "0 0 24 24", width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (id) {
    case "infrastructure":
      return (
        <svg {...p}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="19" r="2.2" />
          <circle cx="19" cy="19" r="2.2" />
          <path d="M12 7.2V12M12 12L5 16.8M12 12l7 4.8" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...p}>
          <path d="M7 18a4 4 0 1 1 .8-7.9A5.5 5.5 0 0 1 18.5 11 3.5 3.5 0 0 1 18 18z" />
        </svg>
      );
    case "foundry":
      return (
        <svg {...p}>
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
        </svg>
      );
    case "ilemesh":
      return (
        <svg {...p}>
          <path d="M4 21V8l8-4 8 4v13M9 21v-6h6v6" />
        </svg>
      );
    case "source":
      return (
        <svg {...p}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12L4 7.5M12 12v9" />
        </svg>
      );
    case "assurance":
      return (
        <svg {...p}>
          <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6z" />
        </svg>
      );
  }
}

type Rect = { t: number; l: number; w: number; h: number };

/** Services relationship diagram: one green D'Matek card above six specialist
 * tiles. A tile expands (clip-path from its own rectangle) into the full
 * profile; the round "−" shrinks it back into the same tile. */
export default function RelationshipDiagram() {
  const [open, setOpen] = useState(-1);
  const stage = useRef<HTMLDivElement>(null);
  const profile = useRef<HTMLDivElement>(null);
  const from = useRef<Rect | null>(null);
  const animOpen = useRef(false);
  const returnTo = useRef<number | null>(null);
  const closing = useRef(false);

  const clipFor = (p: HTMLElement) => {
    const f = from.current!;
    const W = p.offsetWidth, H = p.offsetHeight;
    return `inset(${f.t}px ${Math.max(0, W - f.l - f.w)}px ${Math.max(0, H - f.t - f.h)}px ${f.l}px round 18px)`;
  };

  const openAt = (i: number, el: HTMLElement | null) => {
    const st = stage.current;
    if (st && el) {
      const a = st.getBoundingClientRect(), b = el.getBoundingClientRect();
      from.current = { t: b.top - a.top, l: b.left - a.left, w: b.width, h: b.height };
    } else from.current = null;
    animOpen.current = true;
    setOpen(i);
  };

  const close = () => {
    const p = profile.current;
    if (!p || !from.current || !p.animate || reduced() || closing.current) {
      returnTo.current = open;
      setOpen(-1);
      return;
    }
    closing.current = true;
    [...p.children].forEach((c) => c.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(10px)" }], { duration: 240, fill: "forwards", easing: "ease-in" }));
    const an = p.animate(
      [
        { clipPath: "inset(0px 0px 0px 0px round 36px)", filter: "brightness(1)" },
        { clipPath: clipFor(p), filter: "brightness(1.25)" },
      ],
      { duration: 700, delay: 140, easing: "cubic-bezier(.7,0,.25,1)", fill: "forwards" },
    );
    an.onfinish = () => {
      closing.current = false;
      returnTo.current = open;
      setOpen(-1);
    };
  };

  // Deep links (/businesses#cloud) open that profile.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const i = businesses.findIndex((b) => b.id === id);
    if (i < 0) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: "center" });
      setOpen(i);
    }, 120);
    return () => window.clearTimeout(t);
  }, []);

  // Entrance: tiles fly out from under the green card, once.
  useEffect(() => {
    const st = stage.current;
    if (!st || reduced() || !Element.prototype.animate) return;
    const c = st.getBoundingClientRect(), cx = c.left + c.width / 2, cy = c.top - 60;
    st.querySelectorAll<HTMLElement>("[data-biz-tile]").forEach((t, k) => {
      const b = t.getBoundingClientRect();
      t.animate(
        [
          { opacity: 0, transform: `translate(${cx - b.left - b.width / 2}px,${cy - b.top}px) scale(.4)` },
          { opacity: 1, transform: "none" },
        ],
        { duration: 900, delay: 250 + k * 90, easing: EASE, fill: "backwards" },
      );
    });
  }, []);

  useLayoutEffect(() => {
    const p = profile.current;
    if (animOpen.current && open >= 0 && p) {
      animOpen.current = false;
      p.focus({ preventScroll: true });
      if (!from.current || !p.animate || reduced()) return;
      const top = p.getBoundingClientRect().top;
      if (top < 70 || top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
      p.animate(
        [
          { clipPath: clipFor(p), filter: "brightness(1.35)" },
          { clipPath: "inset(0px 0px 0px 0px round 36px)", filter: "brightness(1)" },
        ],
        { duration: 900, easing: "cubic-bezier(.7,0,.2,1)" },
      );
      [...p.children].forEach((c, k) =>
        c.animate(
          [
            { opacity: 0, transform: "translateY(22px)", filter: "blur(6px)" },
            { opacity: 1, transform: "none", filter: "blur(0)" },
          ],
          { duration: 650, delay: 480 + k * 110, easing: EASE, fill: "backwards" },
        ),
      );
    }
    if (returnTo.current != null && open < 0) {
      const idx = returnTo.current;
      returnTo.current = null;
      const tiles = [...(stage.current?.querySelectorAll<HTMLElement>("[data-biz-tile]") ?? [])];
      tiles[idx]?.focus({ preventScroll: true });
      if (reduced()) return;
      tiles.forEach((t, k) => {
        if (!t.animate) return;
        if (k === idx)
          t.animate([{ background: "#06382E", color: "#F5F1E8", transform: "scale(1.03)" }, { background: "#FFFFFF", transform: "scale(1)" }], { duration: 650, easing: EASE });
        else t.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], { duration: 520, delay: 60 + Math.abs(k - idx) * 70, easing: EASE, fill: "backwards" });
      });
      const y = tiles[idx]?.getBoundingClientRect().top;
      if (y != null && (y < 70 || y > window.innerHeight - 80)) window.scrollTo({ top: window.scrollY + y - 200, behavior: "smooth" });
    }
  });

  const ob = open >= 0 ? businesses[open] : null;

  return (
    <div className="rounded-[clamp(26px,3.4vw,44px)] border border-forest/14 bg-cream p-[clamp(18px,2.4vw,32px)]">
      <div className="rounded-[18px] bg-forest p-[clamp(20px,2.6vw,32px)] text-center text-cream">
        <p className="mb-2 text-[clamp(20px,2.4vw,28px)] font-extrabold">D&rsquo;Matek Technology Limited</p>
        <p className="m-0 text-[clamp(14px,1.4vw,17px)] leading-[1.6] text-cream/90">
          One customer relationship &middot; One coordinated delivery approach &middot; Clear accountability
        </p>
      </div>
      <div aria-hidden="true" className="flex justify-center py-3 text-progress">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
        </svg>
      </div>
      <div ref={stage} className="relative">
        {!ob ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(10px,1.4vw,16px)]">
            {businesses.map((b, i) => (
              <button
                key={b.id}
                id={b.id}
                type="button"
                data-biz-tile
                onClick={(e) => openAt(i, e.currentTarget)}
                aria-expanded={false}
                aria-controls="biz-profile"
                className="flex scroll-mt-28 flex-col gap-1.5 rounded-[18px] border border-forest/14 bg-white p-[clamp(16px,2vw,24px)] text-left text-forest transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_14px_34px_rgba(6,56,46,0.14)]"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex min-w-max shrink-0 items-center gap-2 text-forest">
                    <Icon id={b.id} />
                    <span className="whitespace-nowrap text-[10.5px] font-bold tracking-[0.16em] text-[#7F600F]">{b.verb}</span>
                  </span>
                  <span aria-hidden="true" className="text-[22px] font-bold leading-none text-progress">
                    +
                  </span>
                </span>
                <span className="mt-1.5 text-[clamp(18px,1.8vw,22px)] font-extrabold">{b.short}</span>
                <span className="text-[15px] leading-[1.5] text-forest">{b.tag}</span>
              </button>
            ))}
          </div>
        ) : (
          <div
            id="biz-profile"
            ref={profile}
            tabIndex={-1}
            role="region"
            aria-label={`${ob.name} profile`}
            className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(20px,3vw,44px)] rounded-[clamp(22px,3vw,36px)] p-[clamp(22px,3vw,40px)] pt-[clamp(56px,5vw,64px)] text-cream outline-none"
            style={{ background: "radial-gradient(120% 140% at 8% 0%,#0B4B3D,#06382E 60%)" }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close profile"
              className="absolute right-[clamp(14px,1.6vw,22px)] top-[clamp(14px,1.6vw,22px)] z-[2] flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-cream/35 bg-transparent text-[26px] font-bold leading-none text-gold hover:border-gold hover:bg-gold hover:text-forest"
            >
              &minus;
            </button>
            <div className="flex flex-col gap-3.5">
              <span className="whitespace-nowrap text-[11px] font-bold tracking-[0.16em] text-gold">{ob.verb}</span>
              <p className="m-0 text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{ob.name}</p>
              <p className="mt-1.5 text-[11px] font-bold tracking-[0.16em] text-gold">ROLE</p>
              <p className="m-0 text-[17px] leading-[1.6] text-cream/90">{ob.prop}</p>
              <p className="mt-1.5 text-[11px] font-bold tracking-[0.16em] text-gold">TYPICAL PROBLEMS IT SOLVES</p>
              <p className="m-0 text-[16px] leading-[1.6] text-cream/86">{ob.solves}</p>
              <p className="mt-1.5 text-[11px] font-bold tracking-[0.16em] text-gold">HOW IT WORKS WITH THE OTHERS</p>
              <p className="m-0 text-[16px] leading-[1.6] text-cream/86">{ob.works}</p>
            </div>
            <div className="flex flex-col gap-3.5">
              <p className="m-0 text-[11px] font-bold tracking-[0.16em] text-gold">AVAILABLE NOW</p>
              <div className="flex flex-wrap gap-2">
                {ob.items.map((it) => (
                  <span key={it} className="rounded-full border border-cream/16 px-3.5 py-2.25 text-[14px] font-semibold text-cream" style={{ background: "rgba(245,241,232,0.08)" }}>
                    {it}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-[11px] font-bold tracking-[0.16em] text-gold">NEXT STEP</p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={enquiryHref({ topic: ob.short, message: `I’d like to talk about ${ob.name}.`, source: `services_${ob.id}` })}
                  className="whitespace-nowrap rounded-full bg-gold px-5.5 py-3.5 text-[14px] font-bold text-forest hover:bg-cream"
                >
                  {ob.ctaLabel}
                </Link>
                {ob.external ? (
                  <a href={ob.site} className="whitespace-nowrap rounded-full border border-cream/35 px-5.5 py-3.25 text-[14px] font-bold text-cream hover:border-gold hover:text-gold">
                    {ob.siteLabel}
                  </a>
                ) : (
                  <Link href={ob.site} className="whitespace-nowrap rounded-full border border-cream/35 px-5.5 py-3.25 text-[14px] font-bold text-cream hover:border-gold hover:text-gold">
                    {ob.siteLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4.5 text-center text-[14px] leading-[1.6] text-ink">
        Illustrative relationship diagram. These are coordinated capabilities, not six separate companies a customer must
        navigate. Select one to see its profile.
      </p>
    </div>
  );
}
