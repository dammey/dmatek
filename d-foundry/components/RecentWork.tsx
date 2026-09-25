import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { dropletFeats, inProgressCases, DROPLET_URL } from "@/lib/content";

export default function RecentWork() {
  return (
    <section id="droplet" className="overflow-hidden bg-casedark px-[clamp(18px,3vw,40px)] py-[clamp(72px,12vh,140px)] text-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal as="h2" variant="rise" className="m-0 text-[clamp(56px,9vw,160px)] font-extrabold leading-[.85] tracking-[-.06em]">
            Shipped, <span className="font-serif italic font-normal text-gold">and running.</span>
          </Reveal>
          <span className="font-mono text-xs tracking-[.12em] text-warmmute">04 &middot; RECENT WORK</span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-end gap-[clamp(24px,4vw,64px)]">
          <div className="flex flex-col gap-[18px]">
            <span className="self-start rounded-full bg-gold px-3 py-1.5 font-mono text-[11px] font-semibold text-forest">CASE STUDY &middot; LIVE</span>
            <span className="font-serif text-[clamp(72px,9vw,150px)] italic leading-[.8] tracking-[-.03em]">Droplet</span>
            <p className="m-0 max-w-[40ch] text-lg leading-relaxed text-warmmute">
              Water on demand for Blessed Water. Customers order and reorder in a few taps, keep deliveries coming on a subscription, and book recycling pickups that earn points.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/work/droplet" className="rounded-full border-2 border-cream px-5 py-3 font-bold text-cream transition-colors hover:bg-cream hover:text-casedark">
                Read the case study →
              </Link>
              <a href={DROPLET_URL} target="_blank" rel="noopener" className="rounded-full bg-gold px-[22px] py-3.5 font-bold text-forest transition-colors hover:bg-cream">
                Visit Droplet ↗
              </a>
            </div>
          </div>
          <div className="flex flex-col border-t border-rule">
            {dropletFeats.map((f, i) => (
              <Reveal key={f.n} variant="up" delayMs={i * 80} className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-b border-rule py-4">
                <span className="font-mono text-xs text-gold">{f.n}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-xl font-bold tracking-[-.02em]">{f.title}</span>
                  <span className="text-[15px] leading-relaxed text-warmmute">{f.body}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-12 items-start gap-[clamp(12px,1.6vw,24px)]">
          <Reveal variant="mask" className="relative col-span-8 overflow-hidden rounded-3xl bg-[#F5F8FB] shadow-[0_40px_80px_rgba(0,0,0,.45)]">
            <Image src="/assets/droplet-dash.jpg" alt="Droplet customer home: reorder prompt, usual order and subscription" width={1200} height={900} className="block h-auto w-full" />
          </Reveal>
          <Reveal
            variant="deal"
            delayMs={100}
            className="relative col-span-5 col-start-8 mt-[clamp(40px,8vw,140px)] overflow-hidden rounded-[20px] border-[6px] border-casedark bg-[#F5F8FB] shadow-[0_40px_80px_rgba(0,0,0,.5)]"
          >
            <Image src="/assets/droplet-shop.jpg" alt="Droplet shop with products and delivery zones" width={900} height={1400} className="block h-auto w-full" />
          </Reveal>
          <Reveal
            variant="deal"
            delayMs={180}
            className="relative col-span-6 col-start-3 -mt-10 overflow-hidden rounded-[20px] border-[6px] border-casedark bg-[#F5F8FB] shadow-[0_40px_80px_rgba(0,0,0,.5)] md:-mt-16"
          >
            <Image src="/assets/droplet-rec.jpg" alt="Droplet recycling pickup: materials, points and pickup address" width={1000} height={1000} className="block h-auto w-full" />
          </Reveal>
        </div>

        <div className="mt-[clamp(24px,4vh,48px)] flex flex-col gap-3.5">
          <span className="font-mono text-xs tracking-[.12em] text-warmmute">IN THE WORKS</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-3">
            {inProgressCases.map((c) => (
              <Reveal key={c.client} variant="pill" className="flex flex-wrap items-center justify-between gap-4 rounded-full border-[1.5px] border-rule px-[26px] py-[18px]">
                <span className="flex flex-col gap-0.5">
                  <span className="text-[clamp(20px,2vw,28px)] font-extrabold tracking-[-.035em]">{c.client}</span>
                  <span className="text-sm text-warmmute">{c.body}</span>
                </span>
                <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] font-semibold text-gold">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  IN PROGRESS
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
