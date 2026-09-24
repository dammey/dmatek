import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { aboutStats, quotes, values } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "We’re not vendors. We’re partners for life. Built in Lagos, working across Nigeria — the people who start with your problem are the people who stay with it.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <div
          aria-hidden="true"
          className="dm-blob pointer-events-none absolute -right-[10%] -top-[20%] aspect-square w-[min(48vw,580px)] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(40,112,90,0.16),rgba(245,241,232,0) 70%)", animation: "dm-float-b 20s ease-in-out infinite" }}
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <p
            className="mb-6 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
            style={{ background: "rgba(40,112,90,0.10)", animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}
          >
            ABOUT D&rsquo;MATEK
          </p>
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
            aria-hidden="true"
            className="dm-blob flex min-h-[320px] flex-col items-center justify-center gap-5 p-[clamp(28px,4vw,50px)] text-center aspect-[4/5]"
            style={{ background: "linear-gradient(150deg,#EFEADC,#E4DECC)", boxShadow: "0 26px 60px rgba(6,56,46,0.10)" }}
          >
            <Image src="/assets/mark-green.png" alt="" width={92} height={120} className="h-[clamp(72px,9vw,120px)] w-auto" />
            <p className="m-0 text-[13px] font-bold tracking-[0.16em] text-progress">
              D&rsquo;MATEK TECHNOLOGY LIMITED
            </p>
          </Reveal>
          <Reveal>
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)" }}
            >
              MEET DAMILOLA
            </p>
            <h2 className="mb-5.5 text-[clamp(28px,3.6vw,50px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest text-balance">
              When something matters to you, it matters to us.
            </h2>
            <p className="mb-5.5 max-w-[32em] text-[17px] leading-[1.8] text-ink">
              You don&rsquo;t get a ticket system. You get Damilola &mdash; in the first meeting, during
              the build, and at 11pm three years later when something needs attention.
            </p>
            <div className="mb-7 rounded-[26px] px-6.5 py-5.5" style={{ background: "rgba(212,166,55,0.16)" }}>
              <p className="m-0 mb-3 text-[16.5px] font-medium leading-[1.7] text-forest">
                A customer was having recurring connectivity issues. We reviewed the setup, identified
                the failing access point and replaced it within two hours &mdash; before the customer
                had to start chasing us for answers.
              </p>
              <p className="m-0 text-[16.5px] font-extrabold leading-[1.7] text-forest">
                The problem was ours to solve, so we solved it.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {aboutStats.map((s) => (
                <div key={s.label} className="flex-[1_1_150px] rounded-full bg-cream-2 px-6.5 py-5">
                  <p className="mb-2 text-[clamp(23px,2.6vw,31px)] font-extrabold leading-none tracking-[-0.03em] text-gold">
                    {s.figure}
                  </p>
                  <p className="m-0 text-[13px] leading-[1.5] text-ink">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(64px,7vw,110px)] sm:px-8">
          <Reveal className="mb-7.5 max-w-[36em] sm:mb-12">
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
              style={{ background: "rgba(40,112,90,0.10)" }}
            >
              WHY CLIENTS STICK AROUND
            </p>
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
                <p className="mb-4.5 text-[17px] font-medium leading-[1.7] text-pretty">{q.text}</p>
                <footer
                  className="text-[13px] font-bold tracking-[0.06em]"
                  style={{ color: q.tone === "dark" ? "#D4A637" : "#28705A" }}
                >
                  {q.attrib}
                </footer>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
