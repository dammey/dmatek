import type { Metadata } from "next";
import BusinessAccordion from "@/components/BusinessAccordion";
import { pathSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Businesses",
  description:
    "Six businesses that work on the same problem. One D’Matek, one relationship, many specialists.",
};

export default function BusinessesPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <div
          aria-hidden="true"
          className="dm-blob pointer-events-none absolute -left-[10%] -top-[24%] aspect-square w-[min(50vw,620px)] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(40,112,90,0.14),rgba(245,241,232,0) 70%)", animation: "dm-float-b 22s ease-in-out infinite" }}
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <p
            className="mb-6 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
            style={{ background: "rgba(40,112,90,0.10)", animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}
          >
            ONE D&rsquo;MATEK. MANY SPECIALISTS.
          </p>
          <h1
            className="mb-6.5 max-w-[20em] text-[clamp(38px,5.4vw,76px)] font-extrabold leading-none tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            Six businesses that work on the same problem.
          </h1>
          <p
            className="max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .2s both" }}
          >
            A hotel needs Wi-Fi, cameras, room technology, power, backup and someone to run all of it.
            That is several of our businesses and one conversation with us.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pt-[clamp(24px,3vw,44px)] pb-[clamp(64px,7vw,110px)] sm:px-8">
          <p className="mb-5 text-[11.5px] font-bold tracking-[0.18em] text-progress sm:mb-8">
            HOW EVERY PROJECT RUNS
          </p>
          <div className="relative mb-11 sm:mb-20">
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
            <div className="relative flex flex-wrap gap-2.5">
              {pathSteps.map((p) => (
                <div
                  key={p.name}
                  className="flex-[1_1_170px] rounded-full px-6 py-4.5 shadow-[0_10px_26px_rgba(6,56,46,0.07)] transition-transform hover:-translate-y-1"
                  style={{ background: "#EFEADC" }}
                >
                  <p className="mb-2 text-[11px] font-bold tracking-[0.14em] text-gold">{p.step}</p>
                  <p className="m-0 text-[16.5px] font-bold tracking-[-0.01em] text-forest">{p.name}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mb-5 text-[15px] text-ink">Open any business to read its scope.</p>
          <BusinessAccordion />
        </div>
      </section>
    </div>
  );
}
