import Image from "next/image";
import Reveal from "./Reveal";
import { stages } from "@/lib/content";

export default function Process() {
  return (
    <section className="bg-midgreen px-[clamp(18px,3vw,40px)] py-[clamp(72px,12vh,140px)] text-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(40px,6vh,72px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" variant="rise" className="m-0 max-w-[14ch] text-[clamp(44px,7vw,120px)] font-extrabold leading-[.9] tracking-[-.055em]">
            One client, then a platform, <span className="font-serif italic font-normal text-warmmute">then a product.</span>
          </Reveal>
          <span className="font-mono text-xs tracking-[.12em]">03 &middot; HOW A PROJECT GROWS</span>
        </div>

        <Reveal variant="mask" className="relative aspect-video overflow-hidden rounded-[32px] bg-forest">
          <Image src="/assets/dmatek-team.jpg" alt="The D’Matek team working through a plan" fill sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover" style={{ objectPosition: "50% 25%" }} />
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(16px,2vw,28px)]">
          {stages.map((st, i) => (
            <Reveal key={st.n} variant="deal" delayMs={i * 90} className="flex">
              <div className="flex flex-1 flex-col gap-3.5 rounded-[32px] bg-forest p-[clamp(24px,3vw,40px)] transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-2.5 hover:-rotate-1">
                <span className="text-[clamp(90px,10vw,160px)] font-extrabold leading-[.8] tracking-[-.07em] text-gold">{st.num}</span>
                <span className="font-mono text-xs tracking-[.12em] text-warmmute">{st.n}</span>
                <span className="text-[clamp(24px,2.2vw,32px)] font-extrabold tracking-[-.035em]">{st.title}</span>
                <span className="text-base leading-relaxed text-warmmute">{st.body}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
