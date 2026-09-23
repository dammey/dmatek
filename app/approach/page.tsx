import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { stages, values } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "Six stages, one continuous relationship. Most of the thinking happens before anything is installed, and none of it ends at handover.",
};

export default function ApproachPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <div
          aria-hidden="true"
          className="dm-blob pointer-events-none absolute -right-[8%] -top-[20%] aspect-square w-[min(52vw,640px)] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(212,166,55,0.16),rgba(245,241,232,0) 70%)", animation: "dm-float-a 19s ease-in-out infinite" }}
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-[clamp(52px,7vw,104px)] pb-[clamp(36px,5vw,60px)] sm:px-8">
          <p
            className="mb-6 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-forest"
            style={{ background: "rgba(40,112,90,0.10)", animation: "dm-rise .7s cubic-bezier(.2,.8,.2,1) both" }}
          >
            OUR APPROACH
          </p>
          <h1
            className="mb-6.5 max-w-[20em] text-[clamp(38px,5.4vw,76px)] font-extrabold leading-none tracking-[-0.035em] text-forest text-balance"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
          >
            We own the problem until the result is real.
          </h1>
          <p
            className="max-w-[36em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink"
            style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .2s both" }}
          >
            Six stages, one continuous relationship. Most of the thinking happens before anything is
            installed, and none of it ends at handover.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 pt-[clamp(28px,4vw,56px)] pb-[clamp(64px,7vw,110px)] sm:gap-8.5 sm:px-8">
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
                  className="inline-block rounded-full px-5 py-2.75 text-[13px] font-bold tracking-[0.14em] text-forest"
                  style={{ background: "rgba(212,166,55,0.28)" }}
                >
                  {s.value}
                </span>
              </div>
              <div
                className="dm-blob relative mx-auto flex aspect-square w-full max-w-[340px] flex-col items-center justify-center overflow-hidden p-[clamp(24px,3.4vw,42px)] text-center text-cream"
                style={s.photoSrc ? undefined : { background: "radial-gradient(circle at 30% 26%, #0B4B3D, #043028)" }}
              >
                {s.photoSrc && (
                  <>
                    <Image
                      src={s.photoSrc}
                      alt={`${s.name} — ${s.photo}`}
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg,rgba(6,56,46,0.20),rgba(4,48,40,0.78))" }}
                    />
                  </>
                )}
                {!s.photoSrc && (
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

      <section className="bg-cream px-5 pb-[clamp(64px,7vw,110px)] sm:px-5">
        <Reveal
          className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-center gap-8 rounded-[clamp(32px,5vw,72px)] p-[clamp(44px,6vw,88px)] text-cream sm:gap-16"
          style={{ background: "radial-gradient(120% 140% at 85% 0%, #0B4B3D, #06382E 60%)" }}
        >
          <div>
            <p
              className="mb-5.5 inline-block rounded-full px-4.5 py-2.25 text-[11.5px] font-bold tracking-[0.2em] text-gold"
              style={{ background: "rgba(212,166,55,0.14)" }}
            >
              THE MOAT
            </p>
            <h2 className="mb-5 text-[clamp(28px,3.6vw,50px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
              Seventy percent of the work is design. Then we stay ten years.
            </h2>
            <p className="mb-8 max-w-[32em] text-[17px] leading-[1.75] text-cream/82">
              Anyone can install equipment. Fewer people will sit with your problem long enough to
              design the right answer, and fewer still are around when it needs to change.
            </p>
            <Link
              href="/work"
              className="inline-block rounded-full bg-gold px-8 py-4.5 text-[15px] font-bold text-forest transition-transform hover:-translate-y-1 hover:bg-cream"
            >
              See how we do this &rarr;
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {values.map((v) => (
              <div
                key={v.name}
                className="rounded-[26px] px-6.5 py-5.5 transition-colors hover:bg-cream/[0.12]"
                style={{ background: "rgba(245,241,232,0.07)" }}
              >
                <p className="mb-2 text-[19px] font-bold tracking-[-0.01em] text-gold">{v.name}</p>
                <p className="m-0 text-[15px] leading-[1.65] text-cream/82">{v.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
