import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import SignalRings from "@/components/SignalRings";
import { insightTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical guidance on connectivity, security, power, operations, and data and AI. Articles will be published here.",
};

export default function InsightsPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-22%", right: "-10%", width: "min(50vw,600px)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <Eyebrow className="mb-6" style={{ animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}>
            INSIGHTS
          </Eyebrow>
          <h1
            className="mb-6.5 max-w-[18em] text-[clamp(38px,5.4vw,76px)] font-extrabold leading-none tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            Practical guidance.
          </h1>
          <p
            className="max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .2s both" }}
          >
            On connectivity, security, power, operations, and data and AI. Articles will be published here.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1280px] flex-wrap gap-2.5 px-5 pt-[clamp(12px,2vw,24px)] pb-[clamp(64px,7vw,110px)] sm:px-8">
          {insightTopics.map((t) => (
            <span
              key={t}
              className="rounded-[4px] px-6.5 py-4.5 text-[16px] font-bold text-forest"
              style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
