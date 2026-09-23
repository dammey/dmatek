import type { Metadata } from "next";
import CaseStudyCard from "@/components/CaseStudyCard";
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
        <div
          aria-hidden="true"
          className="dm-blob pointer-events-none absolute -right-[12%] -top-[22%] aspect-square w-[min(50vw,600px)] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(212,166,55,0.18),rgba(245,241,232,0) 70%)", animation: "dm-float-a 18s ease-in-out infinite" }}
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <p
            className="mb-6 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
            style={{ background: "rgba(40,112,90,0.10)", animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}
          >
            CASE STUDIES
          </p>
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
            Property, hospitality and estates, mostly. Each one started as a mess and became something
            the owner stopped thinking about.
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
