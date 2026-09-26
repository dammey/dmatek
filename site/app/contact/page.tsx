import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Eyebrow from "@/components/Eyebrow";
import SignalRings from "@/components/SignalRings";
import { badges } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tell Us What You Need",
  description:
    "Let’s figure it out together. Tell us the problem in your own words — you don’t need to know which technology it needs.",
};

type SearchParams = { topic?: string; message?: string; pilot?: string };

export default async function ContactPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { topic, message, pilot } = await searchParams;

  return (
    <div className="bg-cream px-5 py-[clamp(24px,3vw,44px)] pb-[clamp(56px,7vw,96px)] sm:px-5">
      <div
        className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[clamp(32px,5vw,72px)] p-[clamp(40px,6vw,88px)] text-cream"
        style={{ background: "radial-gradient(130% 130% at 10% 0%, #0B4B3D, #06382E 58%)" }}
      >
        <SignalRings tone="gold" className="pointer-events-none" style={{ top: "-20%", right: "-10%", width: "min(46vw,520px)" }} />
        <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-9 sm:gap-18">
          <div>
            <Eyebrow color="#D4A637" className="mb-6">
              TELL US WHAT YOU NEED
            </Eyebrow>
            <h1 className="mb-6.5 text-[clamp(38px,5vw,70px)] font-extrabold leading-none tracking-[-0.035em] text-balance">
              Let&rsquo;s figure it out together.
            </h1>
            <p className="mb-9 max-w-[30em] text-[clamp(17px,1.7vw,20px)] leading-[1.75] text-cream/82">
              Tell us the problem in your own words. You don&rsquo;t need to know which technology it
              needs, or whether it&rsquo;s one problem or four.
            </p>
            <div className="mb-9 flex flex-wrap gap-2.5">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-2.5 rounded-[4px] px-5 py-3.25 text-[14.5px] font-semibold text-cream"
                  style={{ background: "rgba(245,241,232,0.08)" }}
                >
                  <span className="h-1.75 w-1.75 rounded-full bg-gold" style={{ animation: "dm-pulse 2.8s ease-in-out infinite" }} />
                  {b}
                </span>
              ))}
            </div>
            <div className="text-[15.5px] leading-[1.9] text-cream/82">
              <p className="m-0">Lagos, Nigeria</p>
              <p className="m-0">[ PHONE TO BE ADDED ]</p>
              <p className="m-0">[ EMAIL TO BE ADDED ]</p>
            </div>
          </div>

          <ContactForm initialTopic={topic} initialMessage={message} initialPilot={pilot} />
        </div>
      </div>
    </div>
  );
}
