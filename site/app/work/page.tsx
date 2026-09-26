import type { Metadata } from "next";
import CaseStudyCard from "@/components/CaseStudyCard";
import Eyebrow from "@/components/Eyebrow";
import SignalRings from "@/components/SignalRings";
import { cases } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Problems we were trusted with. Property, hospitality and estates, mostly — each one started as a mess and became something the owner stopped thinking about.",
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
          {cases.map((c) => (
            <CaseStudyCard key={c.id} study={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
