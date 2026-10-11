import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import RelationshipDiagram from "@/components/RelationshipDiagram";
import Reveal from "@/components/Reveal";
import SignalRings from "@/components/SignalRings";
import { pathSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "One partner. The specialists your problem requires. D’Matek brings connectivity, cloud, software, physical systems, equipment and managed IT together around your requirements.",
  alternates: { canonical: "/businesses" },
};

const rise = (d: string) => ({ animation: `dm-rise .8s cubic-bezier(.2,.8,.2,1) ${d} both` });

export default function ServicesPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-24%", right: "-12%", width: "min(50vw,620px)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <Eyebrow className="mb-6" style={{ animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}>
            ONE CONTACT, MANY SOLUTIONS
          </Eyebrow>
          <h1
            className="mb-6.5 max-w-[20em] text-[clamp(38px,5.4vw,76px)] font-extrabold leading-none tracking-[-0.035em] text-forest text-balance"
            style={rise(".1s")}
          >
            One partner. The specialists your problem requires.
          </h1>
          <p className="mb-3.5 max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink" style={rise(".2s")}>
            Technology problems rarely fit neatly into one category. A new office might need connectivity, cloud services,
            equipment and ongoing support. Another customer might need only a network upgrade.
          </p>
          <p className="mb-3.5 max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink" style={rise(".2s")}>
            D&rsquo;Matek brings the relevant expertise together around your requirements. Our specialist capabilities work
            together when a project demands it, and can be engaged individually when that is the right approach.
          </p>
          <p className="mb-3.5 max-w-[36em] text-[clamp(17px,1.7vw,20px)] font-semibold leading-[1.7] text-forest" style={rise(".2s")}>
            You bring us the problem. We work out what it takes to solve it, coordinate the delivery and remain accountable for
            the work we agree to undertake.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pt-[clamp(24px,3vw,44px)] pb-[clamp(64px,7vw,110px)] sm:px-8">
          <RelationshipDiagram />

          <div className="h-[clamp(48px,6vw,88px)]" />
          <p className="mb-[clamp(20px,2.5vw,32px)] text-[11.5px] font-bold tracking-[0.18em] text-progress">HOW EVERY PROJECT RUNS</p>
          <Reveal className="relative">
            <svg viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 h-[80px] w-full -translate-y-1/2">
              <path
                d="M10 58 C 220 6, 400 74, 610 34 C 820 -4, 1010 68, 1190 20"
                fill="none"
                stroke="rgba(212,166,55,0.55)"
                strokeWidth={2}
                strokeDasharray={1600}
                strokeDashoffset={1600}
                style={{ animation: "dm-dash 2.4s cubic-bezier(.2,.8,.2,1) .2s forwards" }}
              />
            </svg>
            <div data-steps className="relative grid grid-cols-6 gap-2.5">
              {pathSteps.map((p) => (
                <div
                  key={p.name}
                  className="min-w-0 rounded-[4px] px-5 py-4.5 shadow-[0_10px_26px_rgba(6,56,46,0.07)] transition-transform hover:-translate-y-1"
                  style={{ background: "#EFEADC" }}
                >
                  <p className="mb-2 text-[11px] font-bold tracking-[0.14em] text-gold">{p.step}</p>
                  <p className="m-0 text-[16.5px] font-bold tracking-[-0.01em] text-forest">{p.name}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
