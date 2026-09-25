import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { dropletFeats, dropletProcess, dropletResults, DROPLET_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Droplet case study",
  description: "How D’Foundry built Droplet, water on demand for Blessed Water.",
};

const productShots = [
  { src: "/assets/droplet-home.jpg", alt: "Droplet home screen with reorder prompt", n: "01", title: "Reorder in one tap", body: dropletFeats[0].body },
  { src: "/assets/droplet-shop.jpg", alt: "Droplet shop with products and delivery zones", n: "02", title: "Subscriptions and a proper shop", body: "Scheduled deliveries that keep coming without a new order, with products and delivery zones managed in one place." },
  { src: "/assets/droplet-rec.jpg", alt: "Droplet recycling pickup with points", n: "03", title: "Recycling that earns points", body: "Customers book pickups for empty bottles and earn points toward their next order." },
];

export default function DropletCaseStudy() {
  return (
    <>
      <header className="relative z-10 flex items-center justify-between gap-4 px-[clamp(18px,3vw,40px)] py-[22px] text-cream">
        <Link href="/" className="text-[19px] font-extrabold tracking-[-.03em]">
          ← D&rsquo;FOUNDRY
        </Link>
        <span className="font-mono text-xs tracking-[.1em]">CASE STUDY 01</span>
      </header>

      <section className="bg-casedark px-[clamp(18px,3vw,40px)] pb-[clamp(48px,8vh,96px)] pt-[clamp(40px,6vh,80px)] text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gold px-3 py-1.5 font-mono text-[11px] font-semibold text-forest">LIVE</span>
            <span className="rounded-full border-[1.5px] border-[#555] px-3 py-1.5 font-mono text-[11px] font-semibold text-warmmute">WEB APP &middot; MOBILE &middot; PAYMENTS</span>
          </div>
          <Reveal as="h1" variant="rise" className="m-0 font-serif text-[clamp(96px,18vw,300px)] italic leading-[.8] tracking-[-.03em]">
            Droplet
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-end gap-[clamp(24px,4vw,64px)]">
            <Reveal as="p" variant="rise" className="m-0 text-[clamp(24px,2.6vw,40px)] font-bold leading-[1.1] tracking-[-.03em]">
              Water on demand for Blessed Water, live in Lagos and Ibadan.
            </Reveal>
            <Reveal variant="rise" className="grid grid-cols-2 gap-x-6 gap-y-4.5 text-[15px]">
              <span className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[.12em] text-warmmute">CLIENT</span>
                <span className="font-bold">Blessed Water</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[.12em] text-warmmute">TIMELINE</span>
                <span className="font-bold text-gold">[00 weeks]</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[.12em] text-warmmute">LAUNCHED</span>
                <span className="font-bold text-gold">[Month 2026]</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[.12em] text-warmmute">HOSTED ON</span>
                <span className="font-bold">D&rsquo;Matek Cloud</span>
              </span>
            </Reveal>
          </div>
          <Reveal variant="mask" className="overflow-hidden rounded-3xl bg-[#F5F8FB] shadow-[0_40px_80px_rgba(0,0,0,.45)]">
            <Image src="/assets/droplet-dash.jpg" alt="Droplet customer home" width={1400} height={900} className="block h-auto w-full" priority />
          </Reveal>
        </div>
      </section>

      <section className="bg-gold px-[clamp(18px,3vw,40px)] py-[clamp(64px,10vh,120px)] text-forest">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal as="h2" variant="rise" className="m-0 text-[clamp(48px,7vw,120px)] font-extrabold leading-[.88] tracking-[-.055em]">
              The <span className="font-serif italic font-normal">results.</span>
            </Reveal>
            <span className="font-mono text-xs tracking-[.12em]">PLACEHOLDERS &middot; REPLACE WITH REAL NUMBERS</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] border-t-2 border-forest">
            {dropletResults.map((r, i) => (
              <Reveal key={r.label} variant="rise" delayMs={i * 80} className="flex flex-col gap-2.5 border-b-2 border-forest py-7 pr-6">
                <span className="text-[clamp(64px,7vw,120px)] font-extrabold leading-[.9] tracking-[-.06em]">{r.value}</span>
                <span className="max-w-[26ch] text-base leading-snug">{r.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-[clamp(18px,3vw,40px)] py-[clamp(72px,12vh,140px)] text-forest">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,80px)]">
          <div className="flex flex-col gap-4.5">
            <span className="font-mono text-xs tracking-[.12em]">01 &middot; THE PROBLEM</span>
            <Reveal as="h2" variant="rise" className="m-0 text-[clamp(44px,5.6vw,96px)] font-extrabold leading-[.9] tracking-[-.055em]">
              Orders came in by <span className="font-serif italic font-normal">[phone and WhatsApp].</span>
            </Reveal>
          </div>
          <div className="flex flex-col gap-5 pt-0 text-[clamp(17px,1.4vw,20px)] leading-relaxed sm:pt-12">
            <Reveal as="p" variant="rise" className="m-0">
              [How Blessed Water took and tracked orders before Droplet. Who handled them, and what went wrong: missed orders, customers running out, drivers without routes.]
            </Reveal>
            <Reveal as="p" variant="rise" delayMs={80} className="m-0">
              [What they asked D&rsquo;Foundry for, in their own words if possible.]
            </Reveal>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-casedark px-[clamp(18px,3vw,40px)] py-[clamp(72px,12vh,140px)] text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(56px,10vh,120px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal as="h2" variant="rise" className="m-0 text-[clamp(48px,7vw,120px)] font-extrabold leading-[.88] tracking-[-.055em]">
              What we <span className="font-serif italic font-normal text-gold">built.</span>
            </Reveal>
            <span className="font-mono text-xs tracking-[.12em] text-warmmute">02 &middot; THE PRODUCT</span>
          </div>
          {productShots.map((p, i) => (
            <div key={p.n} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(24px,4vw,64px)]">
              {i % 2 === 0 ? (
                <>
                  <Reveal variant="mask" className="overflow-hidden rounded-[20px] bg-[#F5F8FB]">
                    <Image src={p.src} alt={p.alt} width={900} height={700} className="block h-auto w-full" />
                  </Reveal>
                  <ProductCopy n={p.n} title={p.title} body={p.body} />
                </>
              ) : (
                <>
                  <ProductCopy n={p.n} title={p.title} body={p.body} />
                  <Reveal variant="mask" className="overflow-hidden rounded-[20px] bg-[#F5F8FB]">
                    <Image src={p.src} alt={p.alt} width={900} height={700} className="block h-auto w-full" />
                  </Reveal>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest px-[clamp(18px,3vw,40px)] py-[clamp(72px,12vh,140px)] text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(32px,5vh,56px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal as="h2" variant="rise" className="m-0 text-[clamp(48px,7vw,120px)] font-extrabold leading-[.88] tracking-[-.055em]">
              How we <span className="font-serif italic font-normal text-gold">built it.</span>
            </Reveal>
            <span className="font-mono text-xs tracking-[.12em] text-sage">03 &middot; THE PROCESS</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3">
            {dropletProcess.map((st, i) => (
              <Reveal
                key={st.key}
                variant="deal"
                delayMs={i * 90}
                className={`flex min-h-[280px] flex-col gap-3.5 rounded-3xl p-7 ${st.bg} ${st.ink}`}
              >
                <span className={`font-mono text-xs font-semibold ${st.metaColor}`}>{st.label}</span>
                <span className="text-[28px] font-extrabold leading-none tracking-[-.035em]">{st.title}</span>
                <span className="text-base leading-relaxed opacity-90">{st.body}</span>
                <span className={`mt-auto font-mono text-xs ${st.metaColor}`}>{st.meta}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-[clamp(18px,3vw,40px)] py-[clamp(72px,14vh,160px)] text-forest">
        <figure className="mx-auto flex max-w-[1200px] flex-col gap-7">
          <Reveal as="blockquote" variant="rise" className="m-0 font-serif text-[clamp(40px,5.4vw,92px)] italic leading-none tracking-[-.02em]">
            &ldquo;[A short quote from Blessed Water about what changed after Droplet.]&rdquo;
          </Reveal>
          <figcaption className="font-mono text-[13px] tracking-[.1em]">[NAME] &middot; [ROLE], BLESSED WATER</figcaption>
        </figure>
      </section>

      <section className="bg-forest px-[clamp(18px,3vw,40px)] pb-8 pt-[clamp(72px,12vh,140px)] text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(40px,8vh,96px)]">
          <Reveal as="h2" variant="rise" className="m-0 text-[clamp(52px,8vw,140px)] font-extrabold leading-[.88] tracking-[-.055em]">
            Got a problem <span className="font-serif italic font-normal text-gold">like this?</span>
          </Reveal>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/#start" className="rounded-full bg-gold px-7 py-[18px] font-bold text-forest transition-colors hover:bg-cream">
              Bring us the problem →
            </Link>
            <a href={DROPLET_URL} target="_blank" rel="noopener" className="rounded-full border-2 border-cream px-[26px] py-4 font-bold text-cream transition-colors hover:bg-cream hover:text-forest">
              Visit Droplet ↗
            </a>
          </div>
          <footer className="flex flex-wrap justify-between gap-4 border-t border-midgreen pt-[22px] font-mono text-xs tracking-[.1em] text-sage">
            <Link href="/">← BACK TO D&rsquo;FOUNDRY</Link>
            <span>D&rsquo;FOUNDRY &middot; A D&rsquo;MATEK BUSINESS</span>
          </footer>
        </div>
      </section>
    </>
  );
}

function ProductCopy({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3.5">
      <span className="font-mono text-xs text-gold">{n}</span>
      <Reveal as="h3" variant="rise" className="m-0 text-[clamp(32px,3.4vw,56px)] font-extrabold leading-[.95] tracking-[-.045em]">
        {title}
      </Reveal>
      <Reveal as="p" variant="rise" delayMs={60} className="m-0 max-w-[44ch] text-lg leading-relaxed text-warmmute">
        {body}
      </Reveal>
    </div>
  );
}
