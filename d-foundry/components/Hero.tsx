"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Piece = { text: string; className: string; serif?: boolean };

const WORDS: Piece[] = [
  { text: "Built", className: "bg-forest text-cream" },
  { text: "for", className: "border-4 border-forest text-forest bg-transparent" },
  { text: "your", className: "bg-gold text-forest" },
  { text: "problem,", className: "bg-midgreen text-cream rounded-[22px]" },
  { text: "not", className: "bg-casedark text-cream rounded-[22px]", serif: true },
  { text: "for", className: "border-4 border-forest text-forest bg-transparent" },
  { text: "a", className: "bg-gold text-forest" },
  { text: "demo.", className: "bg-forest text-gold rounded-[22px]", serif: true },
];

const TAGS = [
  { text: "CUSTOM SOFTWARE", className: "bg-cream border-[1.5px] border-forest text-forest" },
  { text: "WEB APPS", className: "bg-cream border-[1.5px] border-forest text-forest" },
  { text: "AUTOMATION", className: "bg-cream border-[1.5px] border-forest text-forest" },
  { text: "INTEGRATION", className: "bg-cream border-[1.5px] border-forest text-forest" },
  { text: "QADPAY", className: "bg-forest text-gold" },
  { text: "DROPLET", className: "bg-gold text-forest" },
];

// Deterministic pseudo-random scatter so the "drop in" state is stable across renders.
function scatterTransform(i: number) {
  const rotate = ((i * 47) % 60) - 30;
  const x = ((i * 83) % 200) - 100;
  const y = -(220 + ((i * 37) % 160));
  return `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
}

export default function Hero() {
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setAssembled(true), reduce ? 0 : 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-cream px-[clamp(18px,3vw,40px)] py-[22px] text-forest">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-[10px] text-[19px] font-extrabold tracking-[-.03em]">
          <Image src="/assets/dfoundry-logo-mark.png" alt="D’Foundry logo" width={30} height={34} priority />
          D&rsquo;FOUNDRY
        </span>
        <span className="font-mono text-xs tracking-[.1em]">A D&rsquo;MATEK BUSINESS</span>
      </div>

      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 py-16">
        {WORDS.map((w, i) => (
          <span
            key={`${w.text}-${i}`}
            className={`inline-block rounded-full px-[.45em] pb-[.14em] pt-[.1em] text-[clamp(30px,6vw,84px)] font-extrabold leading-none tracking-[-.045em] whitespace-nowrap transition-transform duration-[900ms] ease-[cubic-bezier(.34,1.5,.64,1)] ${w.className} ${w.serif ? "font-serif italic font-normal" : ""}`}
            style={{ transitionDelay: `${i * 60}ms`, transform: assembled ? "none" : scatterTransform(i) }}
          >
            {w.text}
          </span>
        ))}
      </div>

      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 pb-4">
        {TAGS.map((t, i) => (
          <span
            key={t.text}
            className={`inline-block rounded-full px-5 py-3 font-mono text-[clamp(12px,1.1vw,16px)] font-semibold whitespace-nowrap transition-transform duration-[900ms] ease-[cubic-bezier(.34,1.5,.64,1)] ${t.className}`}
            style={{ transitionDelay: `${(WORDS.length + i) * 60}ms`, transform: assembled ? "none" : scatterTransform(WORDS.length + i) }}
          >
            {t.text}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <p className="m-0 max-w-[38ch] text-[clamp(14px,1.2vw,17px)] font-medium leading-snug">
          We build the software, applications, automations and integrations that solve a specific problem properly.
        </p>
        <a
          href="#problem-fix"
          className="rounded-full bg-forest px-6 py-4 text-[15px] font-bold text-cream transition-colors hover:bg-gold hover:text-forest"
        >
          See how ↓
        </a>
      </div>
    </div>
  );
}
