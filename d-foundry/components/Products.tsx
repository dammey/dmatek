import Link from "next/link";
import Reveal from "./Reveal";
import { DROPLET_URL } from "@/lib/content";

export default function Products() {
  return (
    <section className="bg-gold px-[clamp(18px,3vw,40px)] py-[clamp(72px,12vh,140px)] text-forest">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" variant="rise" className="m-0 text-[clamp(56px,9vw,160px)] font-extrabold leading-[.85] tracking-[-.06em]">
            Our own <span className="font-serif italic font-normal">products.</span>
          </Reveal>
          <span className="font-mono text-xs tracking-[.12em]">05 &middot; PRODUCTS</span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[clamp(20px,3vw,40px)]">
          <Reveal variant="deal" className="flex flex-col gap-4.5 rounded-[36px] bg-forest p-[clamp(20px,2.4vw,32px)] text-cream">
            <div className="relative flex aspect-[16/10] items-center justify-center rounded-3xl bg-[#0B4B3D]">
              <span className="font-mono text-xs tracking-[.14em] text-gold">IN THE FOUNDRY &middot; COMING SOON</span>
            </div>
            <span className="self-start rounded-full bg-gold px-3 py-1.5 font-mono text-[11px] font-semibold text-forest">PRODUCT 01 &middot; IN DEVELOPMENT</span>
            <span className="text-[clamp(56px,7vw,110px)] font-extrabold leading-[.85] tracking-[-.065em]">QADPAY</span>
            <p className="m-0 max-w-[44ch] text-[17px] leading-relaxed text-warmmute">A D&rsquo;Matek-owned fintech product, currently in development at D&rsquo;Foundry.</p>
          </Reveal>

          <Reveal variant="deal" delayMs={100} className="flex min-h-[clamp(320px,40vw,520px)] flex-col justify-between gap-4.5 rounded-[36px] bg-cream p-[clamp(24px,3vw,40px)]">
            <span className="self-start rounded-full bg-forest px-3 py-1.5 font-mono text-[11px] font-semibold text-cream">PRODUCT 02 &middot; LIVE</span>
            <div className="flex flex-col gap-4">
              <span className="font-serif text-[clamp(80px,11vw,180px)] italic leading-[.8] tracking-[-.03em]">Droplet</span>
              <p className="m-0 max-w-[40ch] text-[17px] leading-relaxed text-midgreen">Water on demand, built for Blessed Water and live in Lagos and Ibadan.</p>
              <div className="flex flex-wrap gap-2.5">
                <a href={DROPLET_URL} target="_blank" rel="noopener" className="rounded-full bg-forest px-[22px] py-3.5 font-bold text-cream">
                  Visit Droplet ↗
                </a>
                <Link href="/work/droplet" className="rounded-full border-2 border-forest px-5 py-3 font-bold text-forest">
                  Read the case study ↑
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
