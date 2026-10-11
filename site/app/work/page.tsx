import type { Metadata } from "next";
import CaseStudyCard from "@/components/CaseStudyCard";
import Eyebrow from "@/components/Eyebrow";
import SignalRings from "@/components/SignalRings";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { approvedCases } from "@/lib/content";
import { enquiryHref } from "@/lib/enquiry";

/** The five parts every published case study follows (v3.6). */
const CASE_FORMAT: [string, string][] = [
  ["The situation", "What the customer was trying to achieve, what was going wrong and what constraints existed."],
  ["The assessment", "What D’Matek discovered, what had to be prioritised and why the proposed approach was appropriate."],
  ["The work", "What was designed, supplied, configured, developed or integrated, and which specialist capabilities were involved."],
  ["The result", "What was actually achieved, supported by documented evidence wherever possible."],
  ["What happened afterwards", "The handover, maintenance arrangement or ongoing support that was agreed with the customer."],
];

export const metadata: Metadata = {
  title: "Work",
  description:
    "Problems we were trusted with. Delivered projects and outcomes only, each published once the work is complete and the client has agreed.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-22%", right: "-12%", width: "min(50vw,600px)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <Eyebrow className="mb-6" style={{ animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}>
            CASE STUDIES
          </Eyebrow>
          <h1
            className="mb-6.5 max-w-[18em] text-[clamp(38px,5.4vw,76px)] font-extrabold leading-none tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            Problems we were trusted with.
          </h1>
          <p
            className="max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .2s both" }}
          >
            Delivered projects and outcomes only. Each one is published here once the work is complete
            and the client has agreed.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-9 px-5 pt-[clamp(28px,4vw,56px)] pb-[clamp(64px,7vw,110px)] sm:gap-12 sm:px-8">
          {approvedCases.length ? approvedCases.map((c) => <CaseStudyCard key={c.id} study={c} />) : (
          <Reveal
            className="rounded-[clamp(26px,3.4vw,44px)] p-[clamp(28px,4vw,56px)] text-cream"
            style={{ background: "radial-gradient(120% 140% at 8% 0%,#0B4B3D,#06382E 60%)" }}
          >
            <Eyebrow color="#D4A637">COMING SOON</Eyebrow>
            <h2 className="mb-4 text-[clamp(28px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
              A complex requirement. One coordinated delivery.
            </h2>
            <p className="mb-[clamp(28px,3.4vw,40px)] max-w-[38em] text-[17px] leading-[1.7] text-cream/88">
              The first case studies are being prepared with our clients. Each one will follow the same five parts, so you
              can see how we think, deliver and take responsibility.
            </p>
            <ol className="mb-[clamp(28px,3.4vw,40px)] grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3 p-0">
              {CASE_FORMAT.map(([t, d], i) => (
                <li key={t} className="flex flex-col gap-2 rounded-[20px] border border-cream/14 p-5" style={{ background: "rgba(245,241,232,0.07)" }}>
                  <span className="text-[11px] font-bold tracking-[0.16em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[17px] font-extrabold leading-[1.25]">{t}</span>
                  <span className="text-[14px] leading-[1.55] text-cream/78">{d}</span>
                </li>
              ))}
            </ol>
            <Link
              href={enquiryHref({ message: "I’d like to discuss a project similar to your work.", source: "work_similar" })}
              className="inline-block whitespace-nowrap rounded-full bg-gold px-7 py-4 text-[15px] font-bold text-forest hover:bg-cream"
            >
              Discuss a similar project &rarr;
            </Link>
          </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}
