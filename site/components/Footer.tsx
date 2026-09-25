import Image from "next/image";
import Link from "next/link";
import { businesses, navItems, D_SOURCE_URL, D_FOUNDRY_URL, ILEMESH_HREF } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-cream px-5 pb-7 sm:px-5">
      <div
        className="mx-auto max-w-[1280px] rounded-[clamp(32px,5vw,64px)] px-7 pb-7 pt-10 sm:px-14 sm:pb-10 sm:pt-18"
        style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-8 sm:gap-14">
          <div>
            <div className="mb-5.5 flex items-center gap-3">
              <Image src="/assets/mark-green.png" alt="" width={30} height={30} className="h-[30px] w-auto" />
              <span className="text-[17px] font-extrabold tracking-[0.05em] text-forest">D&rsquo;MATEK</span>
            </div>
            <p className="mb-3.5 text-[clamp(20px,2.2vw,27px)] font-extrabold tracking-[-0.02em] text-forest">
              Solving what matters.
            </p>
            <p className="max-w-[24em] text-[15px] leading-[1.7] text-ink">
              A problem-solving company powered by technology. Lagos, Nigeria.
            </p>
          </div>

          <div>
            <p className="mb-4.5 text-[11.5px] font-bold tracking-[0.16em] text-progress">THE SIX BUSINESSES</p>
            <div className="flex flex-col items-start gap-2">
              {businesses.map((b) => (
                <Link
                  key={b.id}
                  href={`/businesses#${b.id}`}
                  className="rounded-full px-3.5 py-1.5 text-[15px] font-medium text-charcoal hover:bg-forest/[0.07] hover:text-forest"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4.5 text-[11.5px] font-bold tracking-[0.16em] text-progress">PAGES</p>
            <div className="flex flex-col items-start gap-2">
              {navItems.map((n) => (
                <Link
                  key={n.key}
                  href={n.href}
                  className="rounded-full px-3.5 py-1.5 text-[15px] font-medium text-charcoal hover:bg-forest/[0.07] hover:text-forest"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4.5 text-[11.5px] font-bold tracking-[0.16em] text-progress">GET IN TOUCH</p>
            <Link
              href="/contact"
              className="mb-5 inline-block rounded-full bg-gold px-6 py-4 text-[14px] font-bold tracking-[0.04em] text-forest transition-transform hover:-translate-y-0.5 hover:bg-forest hover:text-cream"
            >
              Tell us what you need &rarr;
            </Link>
            <p className="mb-5 text-[15px] leading-[1.8] text-ink">
              [ PHONE ]
              <br />
              [ EMAIL ]
              <br />
              [ SOCIAL LINKS ]
            </p>
            <div className="flex flex-col items-start gap-2.5">
              <a
                href={D_SOURCE_URL}
                className="inline-flex items-center gap-2 rounded-full border border-forest/22 px-5.5 py-3.5 text-[14px] font-bold tracking-[0.04em] text-forest hover:bg-forest hover:text-cream"
              >
                Shop D&rsquo;Source &rarr;
              </a>
              <Link
                href={ILEMESH_HREF}
                className="rounded-full px-3.5 py-2 text-[14px] font-bold text-forest hover:bg-forest/[0.07]"
              >
                Explore Il&eacute;Mesh &rarr;
              </Link>
              <a
                href={D_FOUNDRY_URL}
                className="rounded-full px-3.5 py-2 text-[14px] font-bold text-forest hover:bg-forest/[0.07]"
              >
                Explore D&rsquo;Foundry &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-forest/12 pt-5.5 sm:mt-12">
          <p className="m-0 text-[13px] text-[#4A5A54]">&copy; 2026 D&rsquo;Matek Technology Limited. Lagos, Nigeria.</p>
          <p className="m-0 text-[13px] font-bold tracking-[0.12em] text-progress">WE&rsquo;LL FIGURE IT OUT.</p>
        </div>
      </div>
    </footer>
  );
}
