import Image from "next/image";
import Link from "next/link";
import HeroGlow from "@/components/HeroGlow";
import OrbitDiagram from "@/components/OrbitDiagram";
import Reveal from "@/components/Reveal";
import StagePicker from "@/components/StagePicker";
import StatCounter from "@/components/StatCounter";
import WorkTeaserCard from "@/components/WorkTeaserCard";
import { caseTeasers, stats, tickerItems } from "@/lib/content";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section aria-labelledby="hero-h" className="relative overflow-hidden bg-cream">
        <div
          aria-hidden="true"
          className="dm-blob pointer-events-none absolute -right-[10%] -top-[14%] aspect-square w-[min(58vw,720px)] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(40,112,90,0.16), rgba(212,166,55,0.10) 60%, rgba(245,241,232,0) 72%)",
            animation: "dm-float-a 17s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[26%] -left-[14%] aspect-square w-[min(46vw,560px)] rounded-full"
          style={{
            background: "radial-gradient(circle at 60% 40%, rgba(212,166,55,0.20), rgba(245,241,232,0) 70%)",
            animation: "dm-float-b 21s ease-in-out infinite",
          }}
        />
        <HeroGlow />
        <svg
          viewBox="0 0 1440 620"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path
            d="M-20 560 C 260 560, 420 470, 640 350 S 1050 130, 1500 40"
            fill="none"
            stroke="#D4A637"
            strokeWidth={2}
            opacity={0.5}
            strokeDasharray={2000}
            strokeDashoffset={2000}
            style={{ animation: "dm-dash 2.6s cubic-bezier(.2,.8,.2,1) .3s forwards" }}
          />
          <path
            d="M-20 620 C 320 600, 520 540, 760 420 S 1180 220, 1500 160"
            fill="none"
            stroke="#28705A"
            strokeWidth={1.2}
            opacity={0.3}
            strokeDasharray={2200}
            strokeDashoffset={2200}
            style={{ animation: "dm-dash 3.4s cubic-bezier(.2,.8,.2,1) .6s forwards" }}
          />
        </svg>

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-10 px-5 py-[clamp(56px,7vw,112px)] pb-[clamp(64px,7vw,104px)] sm:gap-14 sm:px-8">
          <div>
            <p
              className="mb-7 inline-flex items-center gap-2.5 rounded-full px-4.5 py-2.5 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)", animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}
            >
              <span className="h-1.75 w-1.75 rounded-full bg-gold" style={{ animation: "dm-pulse 2.4s ease-in-out infinite" }} />
              D&rsquo;MATEK TECHNOLOGY LIMITED
            </p>
            <h1
              id="hero-h"
              className="mb-7 text-[clamp(42px,6.2vw,86px)] font-extrabold leading-[0.98] tracking-[-0.038em] text-forest text-balance"
            >
              <span className="inline-block" style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .08s both" }}>
                Solving&nbsp;
              </span>
              <span className="inline-block" style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .18s both" }}>
                what&nbsp;
              </span>
              <span
                className="relative inline-block text-gold"
                style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .28s both" }}
              >
                matters.
                <svg viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden="true" className="absolute -bottom-0.5 left-0 h-[18px] w-full">
                  <path
                    d="M4 18 C 70 6, 150 26, 296 8"
                    fill="none"
                    stroke="#D4A637"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={320}
                    strokeDashoffset={320}
                    style={{ animation: "dm-dash 1.1s cubic-bezier(.2,.8,.2,1) 1.1s forwards" }}
                  />
                </svg>
              </span>
            </h1>
            <p
              className="mb-4.5 max-w-[22em] text-[clamp(19px,1.9vw,25px)] font-medium leading-[1.45] text-forest"
              style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .4s both" }}
            >
              You can trust us. You won&rsquo;t be alone. We&rsquo;ll figure it out.
            </p>
            <p
              className="mb-10 max-w-[30em] text-[17px] leading-[1.7] text-ink"
              style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .5s both" }}
            >
              A problem-solving company powered by technology. You don&rsquo;t need to know which part of
              technology you need &mdash; tell us the problem and we&rsquo;ll take it from there.
            </p>
            <div
              className="flex flex-wrap items-center gap-3.5"
              style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .6s both" }}
            >
              <Link
                href="/contact"
                className="rounded-full bg-gold px-8.5 py-4.75 text-[15px] font-bold text-forest shadow-[0_10px_26px_rgba(212,166,55,0.35)] transition-transform hover:-translate-y-1 hover:bg-forest hover:text-cream hover:shadow-[0_18px_34px_rgba(6,56,46,0.26)]"
              >
                Let&rsquo;s talk &rarr;
              </Link>
              <Link
                href="/approach"
                className="rounded-full border border-forest/22 px-7.5 py-4.75 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-1 hover:border-gold"
                style={{ background: "transparent" }}
              >
                How we work &rarr;
              </Link>
            </div>
          </div>

          <div
            data-tilt
            className="dm-blob relative aspect-[4/5] min-h-[300px] overflow-hidden rounded-[clamp(28px,5vw,54px)]"
            style={{ boxShadow: "inset 0 0 0 1px rgba(6,56,46,0.10), 0 30px 60px rgba(6,56,46,0.10)" }}
          >
            <Image
              src="/assets/hero-onsite.jpg"
              alt="D’Matek engineers installing network hardware on site"
              fill
              sizes="(min-width: 900px) 44vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" className="-mb-px block h-[clamp(56px,7vw,110px)] w-full">
          <path d="M0 120 C 260 20, 620 0, 900 44 C 1140 82, 1300 96, 1440 60 L1440 120 Z" fill="#06382E" />
        </svg>
      </section>

      {/* TICKER */}
      <section aria-label="What we stand for" className="overflow-hidden bg-forest py-[clamp(16px,2vw,26px)] text-cream">
        <div className="flex w-[200%]" style={{ animation: "dm-marquee 34s linear infinite" }}>
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="inline-flex flex-none items-center gap-4.5 whitespace-nowrap px-6.5 text-[clamp(15px,1.6vw,20px)] font-bold tracking-[0.08em] text-cream/90">
              {t}
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
          ))}
        </div>
      </section>

      {/* ONE D'MATEK. MANY SPECIALISTS. */}
      <section aria-labelledby="eco-h" className="relative overflow-hidden bg-forest text-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[12%] top-[8%] aspect-square w-[min(50vw,600px)] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(212,166,55,0.14),rgba(6,56,46,0) 70%)", animation: "dm-float-b 24s ease-in-out infinite" }}
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(56px,7vw,110px)] pb-[clamp(64px,7vw,120px)] sm:px-8">
          <Reveal className="mb-10 max-w-[46em] sm:mb-16">
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-gold"
              style={{ background: "rgba(212,166,55,0.14)" }}
            >
              ONE D&rsquo;MATEK. MANY SPECIALISTS.
            </p>
            <h2 id="eco-h" className="mb-5 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance">
              One customer. One relationship. Six specialists behind it.
            </h2>
            <p className="m-0 text-[17px] leading-[1.7] text-cream/82">
              Most problems need more than one kind of technology. You keep one relationship; we
              coordinate the rest. Hover any specialist to see what it takes off your hands.
            </p>
          </Reveal>
          <Reveal>
            <OrbitDiagram />
          </Reveal>
          <p className="mt-8 text-center sm:mt-13">
            <Link
              href="/businesses"
              className="inline-block rounded-full bg-cream px-7.5 py-4.25 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:bg-gold"
            >
              See the six businesses in detail &rarr;
            </Link>
          </p>
        </div>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" className="-mb-px block h-[clamp(56px,7vw,110px)] w-full">
          <path d="M0 60 C 200 110, 540 130, 820 80 C 1090 32, 1280 10, 1440 46 L1440 120 L0 120 Z" fill="#F5F1E8" />
        </svg>
      </section>

      {/* HOW WE WORK */}
      <section aria-labelledby="own-h" className="overflow-hidden bg-cream">
        <div className="mx-auto px-5 pt-[clamp(20px,3vw,44px)] pb-[clamp(64px,7vw,110px)] sm:px-8" style={{ maxWidth: 1280 }}>
          <Reveal className="mb-9 max-w-[40em] sm:mb-14">
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)" }}
            >
              HOW WE WORK
            </p>
            <h2 id="own-h" className="mb-5 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              We don&rsquo;t hand over and walk away.
            </h2>
            <p className="m-0 text-[17px] leading-[1.7] text-ink">
              Roughly seventy percent of the work happens before anything is deployed. Then we operate
              it, improve it, and stay responsible for the result &mdash; in most cases for a decade or
              more. Pick a stage to read it.
            </p>
          </Reveal>

          <Reveal>
            <StagePicker />
          </Reveal>

          <p className="mt-7 sm:mt-10">
            <Link
              href="/approach"
              className="inline-block rounded-full border border-forest/22 px-7.5 py-4.25 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:border-gold hover:bg-gold"
            >
              See how we do this &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* PROOF */}
      <section aria-label="Proof" className="bg-cream px-5 pb-[clamp(60px,7vw,100px)]">
        <Reveal
          className="relative mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-7 overflow-hidden rounded-[clamp(32px,5vw,72px)] p-[clamp(44px,6vw,88px)] text-cream sm:gap-14"
          style={{ background: "radial-gradient(120% 140% at 12% 0%, #0B4B3D, #06382E 58%)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[8%] -bottom-[40%] aspect-square w-[min(46vw,520px)] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(212,166,55,0.18),rgba(6,56,46,0) 68%)", animation: "dm-float-a 20s ease-in-out infinite" }}
          />
          {stats.map((s) => (
            <div key={s.label} className="relative">
              <p className="mb-3.5 text-[clamp(38px,5vw,64px)] font-extrabold leading-none tracking-[-0.035em] text-gold">
                <StatCounter target={s.num} suffix={s.suffix} />
              </p>
              <p className="m-0 max-w-[16em] text-[15.5px] leading-[1.55] text-cream/82">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* WORK TEASER */}
      <section aria-labelledby="work-teaser-h" className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(64px,7vw,110px)] sm:px-8">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-13">
            <div className="max-w-[30em]">
              <p
                className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
                style={{ background: "rgba(40,112,90,0.10)" }}
              >
                REAL OUTCOMES
              </p>
              <h2 id="work-teaser-h" className="m-0 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
                What it looked like before, and after.
              </h2>
            </div>
            <Link
              href="/work"
              className="rounded-full border border-forest/22 px-7 py-4 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:border-gold hover:bg-gold"
            >
              All case studies &rarr;
            </Link>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6.5">
            {caseTeasers.map((c) => (
              <WorkTeaserCard key={c.id} id={c.id} sector={c.sector} title={c.title} problem={c.problem} tenure={c.tenure} />
            ))}
          </div>
        </div>
      </section>

      {/* WE STAY */}
      <section aria-labelledby="stay-h" className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-9 px-5 pb-[clamp(64px,7vw,110px)] sm:gap-18 sm:px-8">
          <Reveal>
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)" }}
            >
              WE STAY
            </p>
            <h2 id="stay-h" className="mb-5 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              You don&rsquo;t get a ticket system. You get Damilola.
            </h2>
            <p className="mb-7.5 max-w-[32em] text-[17px] leading-[1.75] text-ink">
              When something matters to you, it matters to us. The person who understood your problem
              in the first meeting is still the person you call three years later.
            </p>
            <Link
              href="/about"
              className="inline-block rounded-full border border-forest/22 px-7.5 py-4.25 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:border-gold hover:bg-gold"
            >
              About D&rsquo;Matek &rarr;
            </Link>
          </Reveal>
          <Reveal
            as="blockquote"
            className="dm-blob relative m-0 p-[clamp(36px,4.5vw,62px)] text-cream shadow-[0_30px_70px_rgba(6,56,46,0.18)]"
            style={{ background: "radial-gradient(circle at 70% 18%, #0B4B3D, #043028)" }}
          >
            <p className="mb-6 text-[clamp(19px,2.1vw,27px)] font-semibold leading-[1.45] tracking-[-0.015em] text-pretty">
              &ldquo;[ REAL CLIENT QUOTE TO BE ADDED &mdash; the pattern we hear is relief, then
              gratitude, then trust. ]&rdquo;
            </p>
            <footer className="text-[13.5px] font-bold tracking-[0.06em] text-gold">
              [ NAME, ROLE, ORGANISATION ]
            </footer>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
