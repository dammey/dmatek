import type { Metadata } from "next";
import Image from "next/image";
import { AdireBand } from "@dmatek/brand";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import SignalRings from "@/components/SignalRings";
import { quotes, stages, values } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "About",
  description:
    "We’re not vendors. We’re partners for life. Built in Lagos, working across Nigeria — the people who start with your problem are the people who stay with it.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-20%", right: "-10%", width: "min(48vw,580px)" }} />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <Eyebrow className="mb-6" style={{ animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}>
            ABOUT D&rsquo;MATEK
          </Eyebrow>
          <h1
            className="mb-6.5 max-w-[18em] text-[clamp(38px,5.4vw,76px)] font-extrabold leading-none tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            We&rsquo;re not vendors. We&rsquo;re partners for life.
          </h1>
          <p
            className="max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .2s both" }}
          >
            Built in Lagos, working across Nigeria. The people who start with your problem are the
            people who stay with it.
          </p>
        </div>
      </section>

      {siteConfig.adire && <AdireBand variant="strip" />}

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5 px-5 pt-[clamp(28px,4vw,52px)] pb-[clamp(40px,5vw,64px)] sm:px-8">
          {values.map((v) => (
            <Reveal
              key={v.name}
              className="rounded-[clamp(24px,3vw,38px)] p-[clamp(26px,3vw,36px)] shadow-[0_14px_36px_rgba(6,56,46,0.07)] transition-transform hover:-translate-y-1.5 hover:shadow-[0_26px_54px_rgba(6,56,46,0.14)]"
              style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}
            >
              <span className="mb-4.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-[15px] font-extrabold text-forest">
                {v.i}
              </span>
              <p className="mb-3 text-[21px] font-extrabold tracking-[-0.015em] text-forest">{v.name}</p>
              <p className="m-0 text-[15.5px] leading-[1.7] text-ink">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-9 px-5 pb-[clamp(56px,7vw,100px)] sm:gap-18 sm:px-8">
          <Reveal
            className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-[clamp(28px,4vw,50px)] text-center"
            style={{
              background: "linear-gradient(150deg,#EFEADC,#E4DECC)",
              borderRadius: "56% 44% 50% 50% / 48% 46% 54% 52%",
              animation: "dm-drift 17s ease-in-out infinite",
              boxShadow: "0 26px 60px rgba(6,56,46,0.10)",
              aspectRatio: "4/5",
            }}
            role="img"
            aria-label="Placeholder portrait of Damilola"
          >
            <p className="m-0 text-[11.5px] font-bold tracking-[0.16em] text-progress">[ PORTRAIT REQUIRED ]</p>
            <p className="m-0 max-w-[20em] text-[15.5px] leading-[1.65] text-ink">
              Damilola, warm light, on site or mid-conversation. Not a corporate headshot.
            </p>
          </Reveal>
          <Reveal>
            <Eyebrow>MEET DAMILOLA</Eyebrow>
            <h2 className="mb-5.5 text-[clamp(28px,3.6vw,50px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest text-balance">
              When something matters to you, it matters to us.
            </h2>
            <p className="mb-5.5 max-w-[32em] text-[17px] leading-[1.8] text-ink">
              You don&rsquo;t get a ticket system. You get Damilola &mdash; in the first meeting, during
              the build, and after handover.
            </p>
            <div className="rounded-[26px] px-6.5 py-5.5" style={{ background: "rgba(212,166,55,0.16)" }}>
              <p className="m-0 text-[16.5px] font-medium leading-[1.7] text-forest">
                [ ONE SHORT STORY TO BE ADDED &mdash; the time a customer&rsquo;s problem was fixed in
                two hours before they thought to ask. ]
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(56px,7vw,100px)] sm:px-8">
          <Reveal className="mb-7.5 max-w-[36em] sm:mb-12">
            <Eyebrow>WHY CLIENTS STICK AROUND</Eyebrow>
            <h2 className="m-0 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              Relief, then gratitude, then trust.
            </h2>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
            {quotes.map((q, i) => (
              <Reveal
                key={i}
                as="blockquote"
                className="m-0 rounded-[clamp(24px,3vw,40px)] p-[clamp(26px,3vw,36px)] shadow-[0_14px_36px_rgba(6,56,46,0.08)] transition-transform hover:-translate-y-1.5 hover:shadow-[0_26px_54px_rgba(6,56,46,0.16)]"
                style={{
                  background:
                    q.tone === "dark"
                      ? "radial-gradient(120% 130% at 20% 0%, #0B4B3D, #06382E 60%)"
                      : "linear-gradient(160deg,#EFEADC,#E8E2D0)",
                  color: q.tone === "dark" ? "#F5F1E8" : "#1A1A1A",
                }}
              >
                <p className="m-0 mb-4.5 text-[17px] font-medium leading-[1.7] text-pretty">{q.text}</p>
                <footer
                  className="text-[13px] font-bold tracking-[0.06em]"
                  style={{ color: q.tone === "dark" ? "#D4A637" : "#28705A" }}
                >
                  {q.attrib}
                </footer>
              </Reveal>
            ))}
            <Reveal className="relative min-h-[220px] overflow-hidden rounded-[clamp(24px,3vw,40px)] shadow-[0_14px_36px_rgba(6,56,46,0.08)]">
              <Image
                src="/assets/own-result.jpg"
                alt="D’Matek engineers with a long-standing client"
                fill
                sizes="(min-width: 900px) 30vw, 90vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 flex items-end p-[clamp(22px,2.6vw,30px)]"
                style={{ background: "linear-gradient(180deg,rgba(6,56,46,0.05),rgba(4,48,40,0.82))" }}
              >
                <p className="m-0 text-[15px] font-bold leading-[1.4] text-cream">Ten years and counting.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div id="how" className="mx-auto flex max-w-[1280px] scroll-mt-28 flex-col gap-6 px-5 pt-[clamp(28px,4vw,56px)] pb-[clamp(64px,7vw,110px)] sm:gap-8.5 sm:px-8">
          <Reveal className="max-w-[36em]">
            <Eyebrow>HOW WE WORK</Eyebrow>
            <h2 className="m-0 text-[clamp(30px,4vw,54px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-forest text-balance">
              Six steps, one continuous relationship.
            </h2>
          </Reveal>
          {stages.map((s, i) => (
            <Reveal
              key={s.id}
              id={s.id}
              className="relative grid scroll-mt-28 grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-7 overflow-hidden rounded-[clamp(28px,4vw,56px)] p-[clamp(30px,4vw,60px)] shadow-[0_18px_50px_rgba(6,56,46,0.07)] sm:gap-14"
              style={{ background: i % 2 === 0 ? "linear-gradient(150deg,#EFEADC,#E9E3D2)" : "linear-gradient(150deg,#F1ECE0,#E6E0CE)" }}
            >
              <div>
                <div className="mb-4.5 flex items-baseline gap-4">
                  <span className="text-[13px] font-bold tracking-[0.14em] text-gold">{s.num}</span>
                  <h2 className="m-0 text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest">
                    {s.name}
                  </h2>
                </div>
                <p className="mb-6 max-w-[34em] text-[17.5px] leading-[1.75] text-ink">{s.body}</p>
                <span
                  className="inline-block rounded-[4px] px-5 py-2.75 text-[13px] font-bold tracking-[0.14em] text-forest"
                  style={{ background: "rgba(212,166,55,0.28)" }}
                >
                  {s.value}
                </span>
              </div>
              <div
                className="relative mx-auto flex aspect-square w-full max-w-[340px] flex-col items-center justify-center overflow-hidden p-[clamp(24px,3.4vw,42px)] text-center text-cream"
                style={{
                  background: s.img ? undefined : "radial-gradient(circle at 30% 26%, #0B4B3D, #043028)",
                  borderRadius: "54% 46% 48% 52% / 44% 54% 46% 56%",
                  animation: "dm-drift 21s ease-in-out infinite",
                }}
              >
                {s.img && (
                  <>
                    <Image src={s.img} alt={`${s.name} — ${s.photo}`} fill sizes="340px" className="object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(6,56,46,0.20),rgba(4,48,40,0.78))" }} />
                  </>
                )}
                {!s.img && (
                  <p className="relative m-0 mb-3.5 text-[11px] font-bold tracking-[0.16em] text-gold">
                    [ PHOTO &mdash; {s.photo} ]
                  </p>
                )}
                <p className="relative m-0 max-w-[16em] text-[clamp(19px,2.3vw,28px)] font-extrabold leading-[1.18] tracking-[-0.025em]">
                  {s.outcome}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
