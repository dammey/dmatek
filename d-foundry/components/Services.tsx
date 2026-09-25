import Reveal from "./Reveal";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <section className="bg-cream px-[clamp(18px,3vw,40px)] py-[clamp(72px,12vh,140px)] text-forest">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" variant="rise" className="m-0 text-[clamp(56px,10vw,180px)] font-extrabold leading-[.85] tracking-[-.06em]">
            What we <span className="font-serif italic font-normal text-midgreen">build.</span>
          </Reveal>
          <span className="font-mono text-xs tracking-[.12em] text-midgreen">02 &middot; SERVICES</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {services.map((name, i) => (
            <Reveal key={name} variant="pill" delayMs={i * 60}>
              <div
                className="group flex items-center gap-5 rounded-full border-2 border-forest px-[clamp(20px,3vw,36px)] py-[clamp(14px,2vh,22px)] transition-all duration-[400ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:-rotate-[1.2deg] hover:scale-[1.01] hover:bg-forest"
              >
                <span className="font-mono text-[13px] font-semibold group-hover:text-cream">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[clamp(20px,2.6vw,40px)] font-bold leading-[1.1] tracking-[-.035em] group-hover:text-cream">{name}</span>
                <span className="text-[clamp(20px,2vw,30px)] text-gold">↗</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
