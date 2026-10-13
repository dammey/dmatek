import type { Metadata } from "next";
import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import SignalRings from "@/components/SignalRings";
import { estateline, IRH_PATH, models, who } from "@/lib/content";
import { enquiryHref } from "@/lib/enquiry";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "EstateLine · Structured cabling for the whole estate",
  description:
    "EstateLine plans and builds the network that reaches every home on an estate, then hands it over or stays on to manage it. For developers, estate managers and telecoms operators.",
  path: "/infrastructure/estateline",
  ogTitle: "EstateLine: structured cabling for the whole estate",
});

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function EstateLinePage() {
  const ask = (message?: string, source = "estateline") =>
    enquiryHref({ topic: "Real Estate", org: "Estate or developer", need: "New setup", message, source });

  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-22%", right: "-10%", width: "min(50vw,600px)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(36px,5vw,72px)] pb-[clamp(36px,5vw,64px)] sm:px-8">
          <Link href="/infrastructure" className="mb-5.5 inline-block text-[14px] font-bold text-progress hover:text-forest">
            &larr; D’Matek Infrastructure
          </Link>
          <Eyebrow style={{ display: "block", width: "max-content" }}>INFRASTRUCTURE &middot; ESTATELINE</Eyebrow>
          <h1
            className="mb-6 max-w-[16em] text-[clamp(36px,5vw,68px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            {estateline.name}: the network that reaches every home.
          </h1>
          <p className="mb-3 max-w-[36em] text-[clamp(17px,1.7vw,20px)] font-semibold leading-[1.6] text-forest">{estateline.tag}.</p>
          <p className="mb-8.5 max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink">{estateline.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={ask()} data-track="cta_developer_enquiry" className="whitespace-nowrap rounded-full bg-gold px-7.5 py-4.5 text-[15px] font-bold text-forest shadow-[0_10px_26px_rgba(212,166,55,0.35)] transition-transform hover:-translate-y-1 hover:bg-forest hover:text-cream">
              Discuss your estate &rarr;
            </Link>
            <Link href={IRH_PATH} data-track="try_internet_ready_homes" className="whitespace-nowrap rounded-full border border-forest/22 px-7 py-4.5 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-1 hover:border-gold">
              See Internet-Ready Homes
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pt-[clamp(20px,3vw,40px)] pb-[clamp(40px,5vw,72px)] sm:px-8">
          <Eyebrow>TWO OFFERINGS, ONE APPROACH</Eyebrow>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {estateline.vs.map((v) => (
              <Reveal key={v.n} className="rounded-[clamp(24px,3vw,38px)] p-[clamp(24px,3vw,34px)]" style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}>
                <p className="mb-2 text-[clamp(20px,2vw,24px)] font-extrabold leading-[1.2] text-forest">{v.n}</p>
                <p className="m-0 text-[15.5px] leading-[1.65] text-ink">{v.t}</p>
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
          <Eyebrow color="#D4A637">WHAT IT COVERS</Eyebrow>
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            {estateline.covers.map((n) => (
              <li key={n} className="rounded-[4px] px-5 py-3.25 text-[15.5px] font-semibold text-cream" style={{ background: "rgba(245,241,232,0.08)" }}>
                {n}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(40px,5vw,72px)] sm:px-8">
          <Eyebrow>HOW WE CAN WORK WITH YOU</Eyebrow>
          <p className="mb-7 max-w-[42em] text-[17px] leading-[1.7] text-ink">What happens after deployment depends on what the developer or estate agrees with us.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
            {models.map((m, i) => (
              <Reveal key={m.h} className="flex flex-col gap-2 rounded-[22px] border border-forest/14 bg-white p-[clamp(18px,2vw,26px)]">
                <span className="text-[11px] font-bold tracking-[0.16em] text-progress">{pad(i)}</span>
                <span className="text-[19px] font-extrabold leading-[1.2] text-forest">{m.h}</span>
                <span className="text-[15px] leading-[1.6] text-ink">{m.t}</span>
              </Reveal>
            ))}
          </div>
          <p className="mb-3.5 mt-8 text-[11px] font-bold tracking-[0.16em] text-progress">WHO IT HELPS</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
            {who.map((w) => (
              <div key={w.h} className="flex flex-col gap-1.5 border-t-2 border-gold pt-3.5">
                <span className="text-[17px] font-extrabold text-forest">{w.h}</span>
                <span className="text-[15px] leading-[1.6] text-ink">{w.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(64px,7vw,110px)] sm:px-8">
          <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-end gap-x-12 gap-y-5 border-t-2 border-gold pt-[clamp(28px,3.4vw,44px)]">
            <div>
              <p className="mb-3.5 text-[11.5px] font-bold tracking-[0.2em] text-progress">THE NEXT STEP</p>
              <h2 className="mb-3.5 text-[clamp(28px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest text-balance">Planning or running an estate?</h2>
              <p className="m-0 max-w-[34em] text-[17px] leading-[1.7] text-ink">
                Tell us about the estate, the number of homes and where you are in construction. We will discuss the appropriate next step with you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={ask("I’d like to talk about EstateLine for an estate.", "estateline_next")} data-track="cta_developer_enquiry" className="inline-block whitespace-nowrap rounded-full bg-gold px-7.5 py-4.5 text-[15px] font-bold text-forest hover:bg-forest hover:text-cream">
                Discuss your estate &rarr;
              </Link>
              <Link
                href={enquiryHref({ topic: "Real Estate", org: "Home", message: "My home or estate does not have fibre yet. I would like to know what is possible.", source: "estateline_homeowner" })}
                className="inline-block whitespace-nowrap rounded-full border border-forest/22 px-7 py-4.5 text-[15px] font-semibold text-forest hover:border-gold"
              >
                Homeowner? Ask what is possible
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
