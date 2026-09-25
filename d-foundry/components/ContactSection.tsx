"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { sisters, DMATEK_URL } from "@/lib/content";

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="start" className="bg-cream px-[clamp(18px,3vw,40px)] pb-7 pt-[clamp(72px,12vh,140px)] text-forest">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
        <Reveal as="h2" variant="rise" className="m-0 text-[clamp(72px,14vw,260px)] font-extrabold leading-[.82] tracking-[-.05em]">
          Bring the <span className="block font-serif italic font-normal text-midgreen">problem.</span>
        </Reveal>

        {!sent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex max-w-[960px] flex-wrap items-center gap-3"
          >
            <input
              required
              placeholder="Describe it in one sentence"
              className="min-w-[260px] flex-1 rounded-full border-2 border-forest bg-white px-[26px] py-5 text-[clamp(17px,1.6vw,22px)] font-semibold text-forest outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-forest px-[30px] py-[22px] text-base font-extrabold text-cream transition-transform duration-[400ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:-rotate-3 hover:scale-105 hover:bg-gold hover:text-forest"
            >
              Send it →
            </button>
          </form>
        ) : (
          <div className="self-start rounded-full bg-gold px-7 py-[18px] text-[clamp(17px,1.6vw,22px)] font-bold text-forest">
            Got it. An engineer will reply within two working days.
          </div>
        )}

        <div className="flex flex-wrap gap-2.5">
          {sisters.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="flex items-center gap-2.5 rounded-full border-2 border-forest px-5 py-3 font-bold transition-colors hover:bg-forest hover:text-cream"
            >
              <span className="font-mono text-[11px] font-semibold text-[#B08620]">{s.verb}</span>
              {s.name} ↗
            </a>
          ))}
        </div>

        <footer className="flex flex-wrap justify-between gap-4 border-t-2 border-forest pt-5 font-mono text-xs tracking-[.1em]">
          <span>D&rsquo;FOUNDRY IS A D&rsquo;MATEK BUSINESS</span>
          <a href={DMATEK_URL}>D&rsquo;MATEK.COM ↗</a>
        </footer>
      </div>
    </section>
  );
}
