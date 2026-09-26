import type { Metadata } from "next";
import EnvironmentCard from "@/components/EnvironmentCard";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import SignalRings from "@/components/SignalRings";
import SolutionsAccordion from "@/components/SolutionsAccordion";
import { environments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Start with what you need. Or start with where you work. Everything here is available now, unless it carries the pilot label.",
};

export default function SolutionsPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-22%", right: "-10%", width: "min(50vw,600px)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <Eyebrow className="mb-6" style={{ animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}>
            SOLUTIONS
          </Eyebrow>
          <h1
            className="mb-6.5 max-w-[18em] text-[clamp(38px,5.4vw,76px)] font-extrabold leading-none tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            Start with what you need.
          </h1>
          <p
            className="max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .2s both" }}
          >
            Or start with where you work. Everything here is available now, unless it carries the pilot label.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div id="need" className="mx-auto max-w-[1280px] scroll-mt-28 px-5 pt-[clamp(20px,3vw,40px)] pb-[clamp(48px,6vw,88px)] sm:px-8">
          <Eyebrow>WHAT DO YOU NEED?</Eyebrow>
          <SolutionsAccordion />
        </div>
      </section>

      <section className="bg-cream">
        <div id="env" className="mx-auto max-w-[1280px] scroll-mt-28 px-5 pb-[clamp(64px,7vw,110px)] sm:px-8">
          <Reveal className="mb-7 max-w-[36em] sm:mb-11">
            <Eyebrow>YOUR ENVIRONMENT</Eyebrow>
            <h2 className="m-0 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              Or start with where you work.
            </h2>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3.5">
            {environments.map((v) => (
              <EnvironmentCard key={v.id} id={v.id} sol={v.sol} name={v.name} headline={v.headline} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
