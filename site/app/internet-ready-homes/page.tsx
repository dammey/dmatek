import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import SignalRings from "@/components/SignalRings";
import { estateInternet, irh } from "@/lib/content";
import { enquiryHref } from "@/lib/enquiry";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Internet-Ready Homes",
  description:
    "Network pre-wiring for residential developments in Lagos and beyond: structured Cat6 cabling, a port in every room that needs one and a central cabinet, installed during construction instead of cut into finished walls.",
  path: "/internet-ready-homes",
  ogTitle: "Wire the internet in, the way you wire in power.",
});

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function InternetReadyHomesPage() {
  const ask = (message?: string, source = "irh") =>
    enquiryHref({ topic: irh.name, org: "Estate or developer", message, source });

  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-22%", right: "-10%", width: "min(50vw,600px)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(36px,5vw,72px)] pb-[clamp(36px,5vw,64px)] sm:px-8">
          <Link href="/solutions/real-estate" className="mb-5.5 inline-block text-[14px] font-bold text-progress hover:text-forest">
            &larr; Connected Estate
          </Link>
          <Eyebrow style={{ display: "block", width: "max-content" }}>CONNECTED ESTATE &middot; INTERNET-READY HOMES</Eyebrow>
          <h1
            className="mb-6 max-w-[16em] text-[clamp(36px,5vw,68px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            Wire the internet in, the way you wire in power.
          </h1>
          <p className="mb-3 max-w-[36em] text-[clamp(17px,1.7vw,20px)] font-semibold leading-[1.6] text-forest">{irh.tag}.</p>
          <p className="mb-8.5 max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink">{irh.concept}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={ask()}
              data-track="irh_discuss"
              className="whitespace-nowrap rounded-full bg-gold px-7.5 py-4.5 text-[15px] font-bold text-forest shadow-[0_10px_26px_rgba(212,166,55,0.35)] transition-transform hover:-translate-y-1 hover:bg-forest hover:text-cream"
            >
              Discuss your development &rarr;
            </Link>
            <a
              href="/downloads/internet-ready-homes.pdf"
              download
              data-track="irh_pdf"
              className="whitespace-nowrap rounded-full border border-forest/22 px-7 py-4.5 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-1 hover:border-gold"
            >
              Download the one-page overview (PDF)
            </a>
            <Link
              href="#how"
              className="whitespace-nowrap rounded-full border border-forest/22 px-7 py-4.5 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-1 hover:border-gold"
            >
              See how it runs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pt-[clamp(20px,3vw,40px)] pb-[clamp(40px,5vw,72px)] sm:px-8">
          <Eyebrow>THE PROBLEM IT SOLVES</Eyebrow>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
            {irh.problems.map((p, i) => (
              <Reveal key={p} className="rounded-[clamp(24px,3vw,38px)] p-[clamp(22px,2.2vw,30px)]" style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}>
                <span className="mb-4.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-[15px] font-extrabold text-forest">{pad(i)}</span>
                <p className="m-0 text-[clamp(16px,1.3vw,18px)] font-bold leading-[1.35] tracking-[-0.01em] text-forest">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 pb-[clamp(40px,5vw,72px)]">
        <Reveal
          className="mx-auto max-w-[1280px] rounded-[clamp(32px,5vw,64px)] px-[clamp(26px,4vw,60px)] py-[clamp(36px,5vw,72px)] text-cream"
          style={{ background: "radial-gradient(120% 140% at 8% 0%, #0B4B3D, #06382E 60%)" }}
        >
          <Eyebrow color="#D4A637">WHAT WE INSTALL</Eyebrow>
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            {irh.install.map((n) => (
              <li key={n} className="rounded-[4px] px-5 py-3.25 text-[15.5px] font-semibold text-cream" style={{ background: "rgba(245,241,232,0.08)" }}>
                {n}
              </li>
            ))}
          </ul>
          <p className="mb-0 mt-6 max-w-[48em] text-[16px] leading-[1.7] text-cream/86">{irh.installNote}</p>
        </Reveal>
      </section>

      <section id="how" className="scroll-mt-28 bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(40px,5vw,72px)] sm:px-8">
          <Eyebrow>INSTALLATION PROCESS</Eyebrow>
          <p className="mb-7 max-w-[40em] text-[17px] leading-[1.7] text-ink">{irh.processIntro}</p>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3.5 p-0">
            {irh.stages.map((s, i) => (
              <Reveal as="li" key={s.n} className="flex flex-col gap-2.5 rounded-[22px] border border-forest/14 bg-white p-[clamp(18px,2vw,24px)]">
                <span className="text-[11px] font-bold tracking-[0.16em] text-progress">{pad(i)}</span>
                <span className="text-[19px] font-extrabold leading-[1.2] text-forest">{s.n}</span>
                <span className="text-[11px] font-bold tracking-[0.12em] text-[#7F600F]">{s.when.toUpperCase()}</span>
                <span className="text-[15px] leading-[1.6] text-ink">{s.what}</span>
              </Reveal>
            ))}
          </ol>
          <p className="mb-0 mt-5 text-[15.5px] font-semibold text-forest">{irh.duration}</p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(40px,5vw,72px)] sm:px-8">
          <Eyebrow>WHY DEVELOPERS PARTNER WITH US</Eyebrow>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {irh.why.map((w) => (
              <Reveal key={w.h} className="rounded-[clamp(24px,3vw,38px)] p-[clamp(24px,3vw,34px)]" style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}>
                <p className="mb-4 text-[clamp(20px,2vw,24px)] font-extrabold leading-[1.2] tracking-[-0.015em] text-forest">{w.h}</p>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {w.pts.map((t) => (
                    <li key={t} className="flex gap-3 text-[15.5px] leading-[1.6] text-ink">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(64px,7vw,110px)] sm:px-8">
          <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-end gap-x-12 gap-y-5 border-t-2 border-gold pt-[clamp(28px,3.4vw,44px)]">
            <div>
              <p className="mb-3.5 text-[11.5px] font-bold tracking-[0.2em] text-progress">THE NEXT STEP</p>
              <h2 className="mb-3.5 text-[clamp(28px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest text-balance">Planning a development?</h2>
              <p className="m-0 max-w-[34em] text-[17px] leading-[1.7] text-ink">
                Tell us about the site, the number of units and where you are in construction. We will discuss the appropriate next step with you. After handover, the same relationship can extend into {estateInternet.name}, our estate internet service.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={ask("I’d like to talk about Internet-Ready Homes for a development.", "irh_next")} data-track="irh_discuss_bottom" className="inline-block whitespace-nowrap rounded-full bg-gold px-7.5 py-4.5 text-[15px] font-bold text-forest hover:bg-forest hover:text-cream">
                Discuss your development &rarr;
              </Link>
              <Link href="/solutions/real-estate" className="inline-block whitespace-nowrap rounded-full border border-forest/22 px-7 py-4.5 text-[15px] font-semibold text-forest hover:border-gold">
                Connected Estate
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
