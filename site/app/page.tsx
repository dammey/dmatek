import Link from "next/link";
import HeroGlow from "@/components/HeroGlow";
import OrbitDiagram from "@/components/OrbitDiagram";
import Reveal from "@/components/Reveal";
import StagePicker from "@/components/StagePicker";
import WorkTeaserCard from "@/components/WorkTeaserCard";
import { caseTeasers, entryPoints, hotelCaps, problemLines, stayWords, tickerItems } from "@/lib/content";

export default function HomePage() {
  return (
    <div>
      {/* 01 — HERO */}
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
          style={{ animation: "dmSway 11s ease-in-out 3s infinite" }}
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
            d="M-20 560 C 260 560, 420 470, 640 350 S 1050 130, 1500 40"
            fill="none"
            stroke="#D4A637"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray="140 2260"
            strokeDashoffset={2400}
            style={{ animation: "dmFlow 6s linear 2.4s infinite" }}
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
          <path
            d="M-20 620 C 320 600, 520 540, 760 420 S 1180 220, 1500 160"
            fill="none"
            stroke="#28705A"
            strokeWidth={2.4}
            opacity={0.6}
            strokeLinecap="round"
            strokeDasharray="90 2310"
            strokeDashoffset={2400}
            style={{ animation: "dmFlow 8s linear 3.6s infinite" }}
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
              D&rsquo;Matek designs, builds and runs the technology behind connected businesses, properties,
              workplaces and homes.
            </p>
            <div
              className="flex flex-wrap items-center gap-3.5"
              style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .6s both" }}
            >
              <Link
                href="/contact"
                className="rounded-full bg-gold px-8.5 py-4.75 text-[15px] font-bold text-forest shadow-[0_10px_26px_rgba(212,166,55,0.35)] transition-transform hover:-translate-y-1 hover:bg-forest hover:text-cream hover:shadow-[0_18px_34px_rgba(6,56,46,0.26)]"
              >
                Tell us what you need &rarr;
              </Link>
              <Link
                href="/solutions"
                className="rounded-full border border-forest/22 px-7.5 py-4.75 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-1 hover:border-gold"
                style={{ background: "transparent" }}
              >
                Explore solutions &rarr;
              </Link>
            </div>
          </div>

          <div
            data-tilt
            className="dm-blob relative flex aspect-[4/5] min-h-[300px] flex-col items-center justify-center gap-3 p-[clamp(28px,5vw,54px)] text-center"
            style={{ boxShadow: "inset 0 0 0 1px rgba(6,56,46,0.10), 0 30px 60px rgba(6,56,46,0.10)" }}
            role="img"
            aria-label="Placeholder for photography of real work on site"
          >
            <p className="m-0 text-[11.5px] font-bold tracking-[0.16em] text-progress">[ REAL PHOTOGRAPHY REQUIRED ]</p>
            <p className="m-0 max-w-[22em] text-[15.5px] leading-[1.65] text-ink">
              Damilola on site, mid-problem. A team setting something up. Not a server rack, not a stock photo.
            </p>
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

      {/* 02 — THE PROBLEM */}
      <section aria-labelledby="prob-h" className="relative overflow-hidden bg-forest text-cream">
        <div className="relative mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-8 px-5 py-[clamp(48px,6vw,96px)] pb-[clamp(40px,5vw,72px)] sm:gap-18 sm:px-8">
          <Reveal>
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-gold"
              style={{ background: "rgba(212,166,55,0.14)" }}
            >
              02 &middot; THE PROBLEM
            </p>
            <h2 id="prob-h" className="m-0 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance">
              Technology is rarely one problem.
            </h2>
          </Reveal>
          <Reveal className="flex flex-col">
            {problemLines.map((p) => (
              <div
                key={p.a}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border-b border-cream/16 py-4.5 text-[clamp(19px,2vw,25px)] font-bold tracking-[-0.015em]"
              >
                <span>{p.a}</span>
                <span className="text-gold">affects</span>
                <span className="text-cream/82">{p.b}</span>
              </div>
            ))}
          </Reveal>
        </div>
        <div className="relative mx-auto max-w-[1280px] px-5 pb-[clamp(48px,6vw,88px)] sm:px-8">
          <Reveal className="rounded-[clamp(26px,3.4vw,44px)] p-[clamp(24px,3vw,40px)]" style={{ background: "rgba(245,241,232,0.06)" }}>
            <p className="mb-4 text-[11.5px] font-bold tracking-[0.18em] text-gold">WHAT DO YOU NEED?</p>
            <div className="flex flex-wrap gap-2.5">
              {entryPoints.map((e) => (
                <Link
                  key={e.id}
                  href={`/solutions#ep-${e.id}`}
                  className="rounded-full px-5 py-3 text-[15px] font-semibold text-cream hover:!bg-gold hover:!text-forest"
                  style={{ background: "rgba(245,241,232,0.07)", border: "1px solid rgba(245,241,232,0.16)" }}
                >
                  {e.title}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" className="-mb-px block h-[clamp(56px,7vw,110px)] w-full">
          <path d="M0 60 C 200 110, 540 130, 820 80 C 1090 32, 1280 10, 1440 46 L1440 120 L0 120 Z" fill="#F5F1E8" />
        </svg>
      </section>

      {/* 03 — HOW WE WORK */}
      <section aria-labelledby="own-h" className="overflow-hidden bg-cream">
        <div className="mx-auto px-5 pt-[clamp(20px,3vw,44px)] pb-[clamp(64px,7vw,110px)] sm:px-8" style={{ maxWidth: 1280 }}>
          <Reveal className="mb-9 max-w-[40em] sm:mb-14">
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)" }}
            >
              03 &middot; HOW WE WORK
            </p>
            <h2 id="own-h" className="mb-5 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              We don&rsquo;t hand over and walk away.
            </h2>
            <p className="m-0 text-[17px] leading-[1.7] text-ink">
              Discover, Understand, Solve, Deliver, Support, Improve. We start with what matters to you, not
              with a box, a licence or a brand. Pick a stage to read it.
            </p>
          </Reveal>

          <Reveal>
            <StagePicker />
          </Reveal>

          <p className="mt-7 sm:mt-10">
            <Link
              href="/about#how"
              className="inline-block rounded-full border border-forest/22 px-7.5 py-4.25 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:border-gold hover:bg-gold"
            >
              How we work, in full &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* 04 — ONE D'MATEK, SIX SPECIALISTS */}
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
              04 &middot; ONE D&rsquo;MATEK, SIX SPECIALISTS
            </p>
            <h2 id="eco-h" className="mb-5 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance">
              One customer. Six specialists.
            </h2>
            <p className="m-0 text-[17px] leading-[1.7] text-cream/82">
              Infrastructure connects it. Cloud runs it. D&rsquo;Foundry builds it. Il&eacute;Mesh connects the
              physical world. D&rsquo;Source sources it. Assurance manages, protects and improves it. One team
              accountable for the result.
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

      {/* 05 — THE COMPLEXITY WE ABSORB */}
      <section aria-labelledby="hotel-h" className="bg-cream">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-9 px-5 pt-[clamp(20px,3vw,44px)] pb-[clamp(64px,7vw,110px)] sm:gap-18 sm:px-8">
          <Reveal>
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)" }}
            >
              05 &middot; THE COMPLEXITY WE ABSORB
            </p>
            <h2 id="hotel-h" className="mb-5 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              &ldquo;We&rsquo;re opening a hotel.&rdquo;
            </h2>
            <p className="mb-7.5 text-[clamp(21px,2.3vw,30px)] font-extrabold leading-[1.25] tracking-[-0.02em] text-forest">
              One problem. One team. <span className="text-gold">Many capabilities.</span>
            </p>
            <Link
              href="/solutions/hospitality"
              className="inline-block rounded-full border border-forest/22 px-7.5 py-4.25 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:border-gold hover:bg-gold"
            >
              See Connected Hotel &rarr;
            </Link>
          </Reveal>
          <Reveal
            className="relative rounded-[clamp(28px,4vw,52px)] p-[clamp(28px,3.4vw,48px)]"
            style={{ background: "linear-gradient(150deg,#EFEADC,#E6E0CE)", boxShadow: "0 24px 60px rgba(6,56,46,0.10)" }}
          >
            <div className="relative flex flex-col gap-3">
              {hotelCaps.map((c) => (
                <div
                  key={c.n}
                  className="flex items-center gap-4 rounded-full py-3.5 pl-3.5 pr-5.5 shadow-[0_8px_20px_rgba(6,56,46,0.06)] transition-transform hover:translate-x-1.5"
                  style={{ background: "#F5F1E8" }}
                >
                  <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full bg-forest text-[12px] font-extrabold text-gold">
                    {c.n}
                  </span>
                  <span className="text-[16.5px] font-bold text-forest">{c.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 06 — PROOF */}
      <section aria-labelledby="work-teaser-h" className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(64px,7vw,110px)] sm:px-8">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-13">
            <div className="max-w-[30em]">
              <p
                className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
                style={{ background: "rgba(40,112,90,0.10)" }}
              >
                06 &middot; PROOF
              </p>
              <h2 id="work-teaser-h" className="m-0 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
                Problem. What we did. What changed.
              </h2>
            </div>
            <Link
              href="/work"
              className="rounded-full border border-forest/22 px-7 py-4 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:border-gold hover:bg-gold"
            >
              See our work &rarr;
            </Link>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6.5">
            {caseTeasers.map((c) => (
              <WorkTeaserCard key={c.id} id={c.id} sector={c.sector} title={c.title} problem={c.problem} tenure={c.tenure} />
            ))}
          </div>
        </div>
      </section>

      {/* 07 — WE STAY */}
      <section aria-labelledby="stay-h" className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-9 px-5 pb-[clamp(64px,7vw,110px)] sm:gap-18 sm:px-8">
          <Reveal>
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)" }}
            >
              07 &middot; WE STAY
            </p>
            <h2 id="stay-h" className="mb-5 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              WE STAY.
            </h2>
            <p className="mb-3.5 max-w-[32em] text-[17px] leading-[1.75] text-ink">
              We don&rsquo;t disappear when installation is finished.
            </p>
            <p className="mb-7.5 text-[clamp(19px,2vw,24px)] font-bold tracking-[-0.01em] text-forest">
              Have a problem? Let&rsquo;s figure it out.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-gold px-8 py-4.5 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:bg-forest hover:text-cream"
            >
              Tell us what you need &rarr;
            </Link>
          </Reveal>
          <Reveal
            className="dm-blob relative flex flex-col items-center gap-3.5 p-[clamp(40px,5vw,70px)] text-center text-cream shadow-[0_30px_70px_rgba(6,56,46,0.18)]"
            style={{ background: "radial-gradient(circle at 70% 18%, #0B4B3D, #043028)" }}
          >
            {stayWords.map((w) => (
              <span key={w} className="text-[clamp(22px,2.6vw,34px)] font-extrabold tracking-[-0.02em]">
                {w}
              </span>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
