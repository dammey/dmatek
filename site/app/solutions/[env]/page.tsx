import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdireBand from "@/components/AdireBand";
import Eyebrow from "@/components/Eyebrow";
import PilotLabel from "@/components/PilotLabel";
import Reveal from "@/components/Reveal";
import SignalRings from "@/components/SignalRings";
import { environments, packages, pathSteps } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

export function generateStaticParams() {
  return environments.map((v) => ({ env: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ env: string }> }): Promise<Metadata> {
  const { env: envId } = await params;
  const env = environments.find((v) => v.id === envId);
  if (!env) return {};
  return { title: env.name, description: env.headline };
}

export default async function EnvironmentPage({ params }: { params: Promise<{ env: string }> }) {
  const { env: envId } = await params;
  const env = environments.find((v) => v.id === envId);
  if (!env) notFound();

  const otherEnvs = environments.filter((v) => v.id !== env.id);
  const askHref = `/contact?topic=${encodeURIComponent(env.name)}`;

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
                href={askHref}
                className="rounded-full bg-gold px-7.5 py-4.5 text-[15px] font-bold text-forest shadow-[0_10px_26px_rgba(212,166,55,0.35)] transition-transform hover:-translate-y-1 hover:bg-forest hover:text-cream"
              >
                Tell us what you need &rarr;
              </Link>
              <Link
                href={askHref}
                className="rounded-full border border-forest/22 px-7 py-4.5 text-[15px] font-semibold text-forest transition-transform hover:-translate-y-1 hover:border-gold"
                style={{ background: "transparent" }}
              >
                {env.cta}
              </Link>
            </div>
          </div>
          <div
            className="relative flex aspect-[5/4] min-h-[260px] flex-col items-center justify-center gap-3 p-[clamp(28px,4vw,50px)] text-center"
            style={{
              background: "linear-gradient(150deg,#EFEADC,#E6E0CE)",
              borderRadius: "52% 48% 44% 56% / 50% 44% 56% 50%",
              animation: "dm-drift 17s ease-in-out infinite",
              boxShadow: "inset 0 0 0 1px rgba(6,56,46,0.10), 0 30px 60px rgba(6,56,46,0.10)",
            }}
          >
            <p className="m-0 text-[11.5px] font-bold tracking-[0.16em] text-progress">[ REAL PHOTOGRAPHY REQUIRED ]</p>
            <p className="m-0 max-w-[20em] text-[15.5px] leading-[1.65] text-ink">{env.photo}</p>
          </div>
        </div>
      </section>

      {siteConfig.adire && env.id === "home" && <AdireBand variant="strip" />}

      <section className="bg-cream">
        <div className="mx-auto max-w-[1280px] px-5 pt-[clamp(20px,3vw,40px)] pb-[clamp(40px,5vw,72px)] sm:px-8">
          <Eyebrow>WHAT GETS IN THE WAY</Eyebrow>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3.5">
            {env.problems.map((p, i) => (
              <Reveal key={p} className="rounded-[clamp(24px,3vw,38px)] p-[clamp(26px,3vw,36px)]" style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}>
                <span className="mb-4.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-[15px] font-extrabold text-forest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="m-0 text-[clamp(19px,1.9vw,23px)] font-bold leading-[1.3] tracking-[-0.015em] text-forest">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 pb-[clamp(40px,5vw,72px)] sm:px-5">
        <Reveal
          className="mx-auto max-w-[1280px] rounded-[clamp(32px,5vw,64px)] p-[clamp(36px,5vw,72px)] text-cream"
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
          <p className="mb-3.5 mt-9 text-[11px] font-bold tracking-[0.16em] text-gold sm:mt-12">HOW IT WORKS</p>
          <div className="flex flex-wrap gap-2">
            {pathSteps.map((s) => (
              <span key={s.n} className="flex-[1_1_130px] rounded-[4px] px-4.5 py-3.5 text-[15px] font-bold text-forest" style={{ background: "#F5F1E8" }}>
                <span className="mr-2 text-[11px] tracking-[0.12em] text-progress">{s.n}</span>
                {s.name}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1280px] items-stretch gap-4 px-5 pb-[clamp(40px,5vw,72px)] sm:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] sm:gap-6 sm:px-8">
          <Reveal>
            <PilotLabel items={env.pilot} topic={env.name} tone="cream" />
          </Reveal>
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
                <Link
                  href={`/contact?topic=${encodeURIComponent(env.name)}&message=${encodeURIComponent(`I’d like to talk about ${pkgName}.`)}`}
                  className="mt-auto w-max rounded-full bg-gold px-5.5 py-3.5 text-[14px] font-bold text-forest hover:bg-forest hover:text-cream"
                >
                  Ask about this package &rarr;
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1280px] items-start gap-7 px-5 pb-[clamp(64px,7vw,110px)] sm:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] sm:gap-14 sm:px-8">
          <Reveal className="rounded-[clamp(24px,3vw,38px)] p-[clamp(24px,3vw,36px)]" style={{ background: "rgba(6,56,46,0.05)" }}>
            <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-progress">PROOF</p>
            <p className="m-0 text-[16px] leading-[1.65] text-ink">
              [ DELIVERED WORK ONLY &mdash; references for {env.name} appear here once published. ]
            </p>
          </Reveal>
          <Reveal>
            <p className="mb-3.5 text-[11px] font-bold tracking-[0.16em] text-progress">OTHER ENVIRONMENTS</p>
            <div className="flex flex-wrap gap-2">
              {otherEnvs.map((o) => (
                <Link
                  key={o.id}
                  href={`/solutions/${o.id}`}
                  className="rounded-full px-4 py-2.5 text-[14px] font-semibold text-forest hover:!bg-forest hover:!text-cream"
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
