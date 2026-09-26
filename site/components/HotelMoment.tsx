"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Eyebrow from "@/components/Eyebrow";

type HotelCap = { n: string; name: string; spec: string };

function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/**
 * Home 05 — the scroll-driven hotel moment. 320vh section with a sticky
 * 100vh inner; capability rows light up as you scroll through it. Ported
 * near-verbatim from the prototype's updateHotel (plain DOM: row positions
 * have to be read after layout, not modelled as React state).
 */
export default function HotelMoment({ caps }: { caps: HotelCap[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const rows = Array.from(sec.querySelectorAll<HTMLElement>("[data-cap]"));
    if (!rows.length) return;

    function update() {
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      let p = Math.max(0, Math.min(1, -r.top / span));
      if (prefersReducedMotion() || window.innerWidth <= 760) p = 1;
      const k = p * (rows.length + 1.2);
      let on = 0;
      const specs = new Set<string>();
      rows.forEach((row, i) => {
        const act = k > i + 0.35;
        if (act) {
          on = i + 1;
          const s = row.querySelector("[data-spec]");
          if (s?.textContent) specs.add(s.textContent);
        }
        row.style.opacity = act ? "1" : "0.22";
        row.style.transform = act ? "none" : "translateX(18px)";
        const dot = row.querySelector<HTMLElement>("[data-capdot]");
        if (dot) {
          dot.style.background = act ? "#D4A637" : "#F5F1E8";
          dot.style.borderColor = act ? "#D4A637" : "rgba(212,166,55,0.5)";
          dot.style.transform = act ? "scale(1.1)" : "none";
        }
      });

      const fill = sec.querySelector<HTMLElement>("[data-hfill]");
      if (fill) {
        const last = on ? rows[on - 1] : null;
        const base = rows[0].offsetTop + rows[0].offsetHeight / 2;
        fill.style.top = base + "px";
        fill.style.height = last ? Math.max(0, last.offsetTop + last.offsetHeight / 2 - base) + "px" : "0px";
      }

      const c1 = sec.querySelector('[data-hc="caps"]');
      const c2 = sec.querySelector('[data-hc="spec"]');
      if (c1) c1.textContent = String(on);
      if (c2) c2.textContent = String(specs.size);

      const hs = sec.querySelectorAll<HTMLElement>("[data-hs]");
      const vis = [true, on >= 3, on >= rows.length];
      hs.forEach((el, i) => {
        el.style.opacity = vis[i] ? "1" : "0.18";
        el.style.transform = vis[i] ? "none" : "translateY(6px)";
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hotel-h"
      data-hotel
      data-node="05"
      className="relative bg-cream"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          className="mx-auto grid w-full max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-9 px-5 pb-6 pt-20 sm:gap-18 sm:px-8"
        >
          <div>
            <div
              className="dm-blob"
              style={{
                position: "relative",
                height: "clamp(0px, calc(100vh - 640px), 190px)",
                background: "linear-gradient(150deg,#EFEADC,#E6E0CE)",
                overflow: "hidden",
                margin: "0 0 clamp(0px, calc((100vh - 640px) / 6), 26px)",
                boxShadow: "0 20px 50px rgba(6,56,46,0.16)",
              }}
            />
            <Eyebrow>05 &middot; THE COMPLEXITY WE ABSORB</Eyebrow>
            <h2
              id="hotel-h"
              className="text-balance text-forest"
              style={{ fontSize: "clamp(34px,4.6vw,64px)", lineHeight: 1, fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 28px" }}
            >
              &ldquo;We&rsquo;re opening a hotel.&rdquo;
            </h2>
            <div className="mb-8 flex flex-col gap-1">
              <span data-hs="0" className="text-forest transition-[opacity,transform] duration-500" style={{ fontSize: "clamp(22px,2.4vw,32px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                One problem.
              </span>
              <span data-hs="1" className="text-forest opacity-[.18] transition-[opacity,transform] duration-500" style={{ fontSize: "clamp(22px,2.4vw,32px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                One team.
              </span>
              <span data-hs="2" className="text-gold opacity-[.18] transition-[opacity,transform] duration-500" style={{ fontSize: "clamp(22px,2.4vw,32px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Many capabilities.
              </span>
            </div>
            <div className="mb-7.5 flex flex-wrap gap-x-9 gap-y-3 border-y border-forest/[0.14] py-4.5">
              <div className="flex flex-col gap-1">
                <span className="leading-none text-forest" style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  <span data-hc="caps">0</span>
                  <span className="text-progress">/6</span>
                </span>
                <span className="text-[11px] font-bold tracking-[0.16em] text-progress">CAPABILITIES</span>
              </div>
              <div className="flex flex-col gap-1">
                <span data-hc="spec" className="leading-none text-forest" style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  0
                </span>
                <span className="text-[11px] font-bold tracking-[0.16em] text-progress">SPECIALISTS</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="leading-none text-gold" style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  1
                </span>
                <span className="text-[11px] font-bold tracking-[0.16em] text-progress">TEAM TO CALL</span>
              </div>
            </div>
            <Link
              href="/solutions/hospitality"
              className="inline-block rounded-full border border-forest/22 px-7.5 py-4.25 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:border-gold hover:bg-gold"
            >
              See Connected Hotel &rarr;
            </Link>
          </div>

          <div className="relative pl-12">
            <div aria-hidden="true" className="absolute bottom-5.5 left-[15px] top-5.5 w-0.5" style={{ background: "rgba(6,56,46,0.12)" }} />
            <div data-hfill aria-hidden="true" className="absolute left-[15px] w-0.5 bg-gold transition-[height] duration-[.45s]" style={{ top: 22, height: 0 }} />
            {caps.map((c) => (
              <div
                key={c.n}
                data-cap
                className="relative flex items-baseline gap-4.5 border-b py-4 opacity-[.22] transition-[opacity,transform] duration-500"
                style={{ borderColor: "rgba(6,56,46,0.10)", transform: "translateX(18px)" }}
              >
                <span
                  data-capdot
                  aria-hidden="true"
                  className="absolute top-1/2 -mt-2.25 h-4.5 w-4.5 rounded-full transition-[background,border-color,transform] duration-300"
                  style={{ left: -40, background: "#F5F1E8", border: "2px solid rgba(212,166,55,0.5)" }}
                />
                <span className="text-[12px] font-bold tracking-[0.14em] text-progress">{c.n}</span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-forest" style={{ fontSize: "clamp(19px,1.9vw,24px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                    {c.name}
                  </span>
                  <span data-spec className="text-[11px] font-bold tracking-[0.16em] text-progress">
                    {c.spec}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
