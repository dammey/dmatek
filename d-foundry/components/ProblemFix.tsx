"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { problems } from "@/lib/content";

export default function ProblemFix() {
  const [active, setActive] = useState(0);
  const plan = problems[active].plan;

  return (
    <section id="problem-fix" className="bg-forest px-[clamp(18px,3vw,40px)] py-[clamp(24px,4vh,48px)] pb-[clamp(72px,12vh,140px)] text-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" variant="rise" className="m-0 max-w-[12ch] text-[clamp(44px,7vw,120px)] font-extrabold leading-[.9] tracking-[-.055em]">
            Pick the one that <span className="font-serif italic font-normal text-gold">sounds like you.</span>
          </Reveal>
          <span className="font-mono text-xs tracking-[.12em] text-sage">01 &middot; PROBLEM → FIX</span>
        </div>

        <div className="flex flex-col gap-3">
          {problems.map((p, i) => {
            const on = i === active;
            return (
              <Reveal key={p.text} variant="pill" delayMs={i * 70}>
                <button
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-5 rounded-full border-2 px-[clamp(20px,3vw,40px)] py-[clamp(16px,2.4vh,26px)] text-left text-[clamp(18px,2.2vw,34px)] font-bold leading-[1.15] tracking-[-.03em] transition-colors hover:border-gold ${
                    on ? "border-gold bg-gold text-forest" : "border-midgreen bg-transparent text-cream"
                  }`}
                >
                  <span className="font-mono text-[13px] font-semibold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{p.text}</span>
                  <span className="text-[.9em]">{on ? "●" : "○"}</span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[clamp(20px,3vw,40px)] rounded-[28px] bg-cream p-[clamp(24px,4vw,48px)] text-forest">
          {plan.map((st) => (
            <div key={st.step} className="flex flex-col gap-[10px]">
              <span className="self-start rounded-full bg-gold px-3 py-1.5 font-mono text-xs font-semibold text-forest">{st.step}</span>
              <span className="text-[clamp(22px,2vw,30px)] font-extrabold leading-[1.05] tracking-[-.035em]">{st.title}</span>
              <span className="text-base leading-relaxed text-midgreen">{st.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
