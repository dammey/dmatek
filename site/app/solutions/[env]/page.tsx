import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import SignalRings from "@/components/SignalRings";
import { defaultDeliver, estateInternet, IRH_PATH, irh, liveEnvironments as environments, packages } from "@/lib/content";
import { enquiryHref } from "@/lib/enquiry";

/** Environment → the enquiry form's environment option. */
const ORG: Record<string, string> = {
  hospitality: "Hotel or hospitality",
  education: "School",
  "real-estate": "Estate or developer",
  enterprise: "Business or office",
};

export function generateStaticParams() {
  return environments.map((v) => ({ env: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ env: string }> }): Promise<Metadata> {
  const { env: envId } = await params;
  const env = environments.find((v) => v.id === envId);
  if (!env) return {};
  return pageMeta({
    title: `${env.name} · ${env.sol.charAt(0)}${env.sol.slice(1).toLowerCase()}`,
    description: env.support,
    path: `/solutions/${env.id}`,
    ogTitle: env.headline,
    image: env.img,
  });
}

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default async function EnvironmentPage({ params }: { params: Promise<{ env: string }> }) {
  const { env: envId } = await params;
  const env = environments.find((v) => v.id === envId);
  if (!env) notFound();

  const otherEnvs = environments.filter((v) => v.id !== env.id);
  const ask = (message?: string) => enquiryHref({ topic: env.name, org: ORG[env.id], message, source: `env_${env.id}` });
  const steps = env.deliver ?? defaultDeliver;

  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <SignalRings tone="green" className="pointer-events-none" style={{ top: "-22%", right: "-10%", width: "min(50vw,600px)" }} />
        <div className="relative mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-9 px-5 py-[clamp(36px,5vw,72px)] pb-[clamp(36px,5vw,64px)] sm:gap-18 sm:px-8">
          <div>
            <Link href="/solutions#env" className="mb-5.5 inline-block text-[14px] font-bold text-progress hover:text-forest">
              &larr; Solutions &middot; Your environment
            </Link>
            <Eyebrow style={{ display: "block", width: "max-content" }}>{env.sol}</Eyebrow>
            <h1
              className="mb-6 text-[clamp(36px,5vw,68px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-forest text-balance"
              style={{ animation: "dm-rise .8s cubic-bezier(.2,.8,.2,1) .1s both" }}
            >
              {env.headline}
            </h1>
            <p className="mb-8.5 max-w-[34em] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-ink">{env.support}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ask()}
                className="whitespace-nowrap rounded-full bg-gold px-7.5 py-4.5 text-[15px] font-bold text-forest shadow-[0_10px_26px_rgba(212,166,55,0.35)] transition-transform hover:-translate-y-1 hover:bg-forest hover:text-cream"
              >
                Tell us what you need &rarr;
              </Link>
              <Link
                href={ask()}
                className="whitespace-nowrap rounded-full border border-forest/22 px-7 py-4.5 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-1 hover:border-gold"
              >
                {env.cta}
              </Link>
            </div>
          </div>
          <div
            className="dm-blob relative flex aspect-[5/4] min-h-[260px] items-center justify-center overflow-hidden text-center"
            style={{ background: "linear-gradient(150deg,#EFEADC,#E6E0CE)", boxShadow: "inset 0 0 0 1px rgba(6,56,46,0.10), 0 30px 60px rgba(6,56,46,0.10)" }}
          >
            {env.img ? (
              <Image src={env.img} alt={env.photo} fill priority sizes="(min-width: 900px) 46vw, 90vw" className="dm-hero-zoom object-cover" />
            ) : (
              <p className="m-0 max-w-[12em] whitespace-nowrap text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.2] tracking-[-0.02em] text-forest">{env.sol}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pt-[clamp(20px,3vw,40px)] pb-[clamp(40px,5vw,72px)] sm:px-8">
          <Eyebrow>WHAT GETS IN THE WAY</Eyebrow>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3.5">
            {env.problems.map((p, i) => (
              <Reveal key={p} className="rounded-[clamp(24px,3vw,38px)] p-[clamp(26px,3vw,36px)]" style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}>
                <span className="mb-4.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-[15px] font-extrabold text-forest">{pad(i)}</span>
                <p className="m-0 text-[clamp(19px,1.9vw,23px)] font-bold leading-[1.3] tracking-[-0.015em] text-forest">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 pb-[clamp(40px,5vw,72px)]">
        <Reveal
          className="mx-auto max-w-[1280px] rounded-[clamp(32px,5vw,64px)] px-[clamp(26px,4vw,60px)] py-[clamp(36px,5vw,72px)] text-cream"
          style={{ background: "radial-gradient(120% 140% at 8% 0%, #0B4B3D, #06382E 60%)" }}
        >
          <Eyebrow color="#D4A637">WHAT WE SOLVE NOW</Eyebrow>
          <div className="flex flex-wrap gap-2.5">
            {env.now.map((n) => (
              <span key={n} className="rounded-[4px] px-5 py-3.25 text-[15.5px] font-semibold text-cream" style={{ background: "rgba(245,241,232,0.08)" }}>
                {n}
              </span>
            ))}
          </div>
          <p className="mb-3.5 mt-[clamp(32px,4vw,48px)] text-[11px] font-bold tracking-[0.16em] text-gold">HOW AN ENGAGEMENT RUNS</p>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-3 p-0">
            {steps.map((t, i) => (
              <li key={t} className="flex flex-col gap-2 rounded-[22px] px-5 py-4.5" style={{ background: "rgba(245,241,232,0.08)" }}>
                <span className="text-[11px] font-bold tracking-[0.16em] text-gold">{pad(i)}</span>
                <span className="text-[16px] font-bold leading-[1.3] text-cream">{t}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {env.id === "real-estate" && (
        <section className="bg-cream">
          <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(40px,5vw,72px)] sm:px-8">
            <Eyebrow>INSIDE CONNECTED ESTATE</Eyebrow>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4 sm:gap-6">
              <Reveal className="flex flex-col gap-3.5 rounded-[clamp(26px,3.4vw,44px)] p-[clamp(26px,3vw,40px)] shadow-[0_18px_46px_rgba(6,56,46,0.08)]" style={{ background: "linear-gradient(150deg,#EFEADC,#E6E0CE)" }}>
                <span className="w-max rounded-[4px] px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-forest" style={{ background: "rgba(212,166,55,0.3)" }}>FOR DEVELOPERS</span>
                <p className="m-0 text-[clamp(24px,2.6vw,32px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-forest">{irh.name}</p>
                <p className="m-0 text-[15.5px] font-semibold leading-[1.6] text-forest">{irh.tag}</p>
                <p className="m-0 text-[15.5px] leading-[1.65] text-ink">
                  Structured cabling, a network port in every room that needs one and a central cabinet, installed during construction instead of cut into finished walls.
                </p>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {irh.install.slice(0, 3).map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-[1.55] text-ink">
                      <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <Link href={IRH_PATH} data-track="irh_card" className="mt-auto w-max whitespace-nowrap rounded-full bg-gold px-5.5 py-3.5 text-[14px] font-bold text-forest hover:bg-forest hover:text-cream">
                  See Internet-Ready Homes &rarr;
                </Link>
              </Reveal>
              <Reveal className="flex flex-col gap-3.5 rounded-[clamp(26px,3.4vw,44px)] p-[clamp(26px,3vw,40px)] shadow-[0_18px_46px_rgba(6,56,46,0.08)]" style={{ background: "linear-gradient(150deg,#EFEADC,#E6E0CE)" }}>
                <span className="w-max rounded-[4px] px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-forest" style={{ background: "rgba(212,166,55,0.3)" }}>FOR ESTATES AND RESIDENTS</span>
                <p className="m-0 text-[clamp(24px,2.6vw,32px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-forest">{estateInternet.name}</p>
                <p className="m-0 text-[15.5px] font-semibold leading-[1.6] text-forest">{estateInternet.descriptor}. {estateInternet.tag}.</p>
                <p className="m-0 text-[15.5px] leading-[1.65] text-ink">{estateInternet.body}</p>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {estateInternet.points.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-[1.55] text-ink">
                      <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-3">
                  <Link href={ask("I’d like to talk about EstateLine for an estate.")} data-track="estateline_ask" className="w-max whitespace-nowrap rounded-full bg-gold px-5.5 py-3.5 text-[14px] font-bold text-forest hover:bg-forest hover:text-cream">
                    Ask about EstateLine &rarr;
                  </Link>
                  <Link
                    href={enquiryHref({ topic: "EstateLine", org: "Home", message: "I live on an estate and would like to know if EstateLine is available there. Estate name: ", source: "estateline_resident" })}
                    data-track="estateline_resident"
                    className="w-max whitespace-nowrap rounded-full border border-forest/22 px-5.5 py-3 text-[14px] font-bold text-forest hover:border-gold"
                  >
                    Live on an estate? Ask if it&rsquo;s covered
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1280px] items-stretch gap-4 px-5 pb-[clamp(40px,5vw,72px)] sm:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] sm:gap-6 sm:px-8">
          {env.pkgs.map((pkgName) => {
            const pkg = packages[pkgName];
            return (
              <Reveal
                key={pkgName}
                className="flex flex-col gap-3.5 rounded-[clamp(26px,3.4vw,44px)] p-[clamp(26px,3vw,40px)] shadow-[0_18px_46px_rgba(6,56,46,0.08)]"
                style={{ background: "linear-gradient(150deg,#EFEADC,#E6E0CE)" }}
              >
                <span className="w-max rounded-[4px] px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-forest" style={{ background: "rgba(212,166,55,0.3)" }}>
                  PACKAGE
                </span>
                <p className="m-0 text-[clamp(24px,2.6vw,32px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-forest">{pkgName}</p>
                <p className="m-0 text-[15.5px] leading-[1.65] text-ink">
                  <strong className="text-forest">What&rsquo;s included:</strong> {pkg.included}
                </p>
                <p className="m-0 text-[15.5px] leading-[1.65] text-ink">
                  <strong className="text-forest">For:</strong> {pkg.forWhom}
                </p>
                <Link href={ask(`I’d like to talk about ${pkgName}.`)} className="mt-auto w-max whitespace-nowrap rounded-full bg-gold px-5.5 py-3.5 text-[14px] font-bold text-forest hover:bg-forest hover:text-cream">
                  Ask about this package &rarr;
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {env.nextH && (
        <section className="bg-cream">
          <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(48px,6vw,88px)] sm:px-8">
            <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-end gap-x-12 gap-y-5 border-t-2 border-gold pt-[clamp(28px,3.4vw,44px)]">
              <div>
                <p className="mb-3.5 text-[11.5px] font-bold tracking-[0.2em] text-progress">THE NEXT STEP</p>
                <h2 className="mb-3.5 text-[clamp(28px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest text-balance">{env.nextH}</h2>
                <p className="m-0 max-w-[34em] text-[17px] leading-[1.7] text-ink">{env.nextP}</p>
              </div>
              <div>
                <Link href={ask()} className="inline-block whitespace-nowrap rounded-full bg-gold px-7.5 py-4.5 text-[15px] font-bold text-forest hover:bg-forest hover:text-cream">
                  {env.cta} &rarr;
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pb-[clamp(64px,7vw,110px)] sm:px-8">
          <Reveal>
            <p className="mb-3.5 text-[11px] font-bold tracking-[0.16em] text-progress">OTHER ENVIRONMENTS</p>
            <div className="flex flex-wrap gap-2">
              {otherEnvs.map((o) => (
                <Link
                  key={o.id}
                  href={`/solutions/${o.id}`}
                  className="whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-semibold text-forest hover:!bg-forest hover:!text-cream"
                  style={{ border: "1px solid rgba(6,56,46,0.18)" }}
                >
                  {o.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
