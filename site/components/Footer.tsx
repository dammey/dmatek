import { AdireBand } from "@dmatek/brand";
import Image from "next/image";
import Link from "next/link";
import { CONTACT, businesses, navItems, D_SOURCE_URL } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer style={{ background: "#EFEADC", borderTop: "1px solid rgba(6,56,46,0.12)" }}>
      {siteConfig.adire && <AdireBand variant="footer" />}
      <div className="mx-auto max-w-[1280px] px-8 pb-5 pt-8 sm:pt-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-7 sm:gap-10">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <Image src="/assets/mark-green.png" alt="" width={24} height={24} className="h-6 w-auto" />
              <span className="text-[15px] font-extrabold tracking-[0.05em] text-forest">D&rsquo;MATEK</span>
            </div>
            <p className="max-w-[22em] text-[14px] leading-[1.6] text-ink">
              Solving what matters. A problem-solving company powered by technology. Lagos, Nigeria.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-progress">SERVICES</p>
            <div className="flex flex-col items-start gap-1.5">
              {businesses.map((b) =>
                b.external ? (
                  <a key={b.id} href={b.site} className="whitespace-nowrap py-0.5 text-[14px] font-medium text-charcoal hover:text-progress">
                    {b.name}
                  </a>
                ) : (
                  <Link key={b.id} href={b.site} className="whitespace-nowrap py-0.5 text-[14px] font-medium text-charcoal hover:text-progress">
                    {b.name}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-progress">PAGES</p>
            <div className="flex flex-col items-start gap-1.5">
              {navItems.map((n) => (
                <Link key={n.key} href={n.href} className="whitespace-nowrap py-0.5 text-[14px] font-medium text-charcoal hover:text-progress">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold tracking-[0.16em] text-progress">GET IN TOUCH</p>
            <div className="flex flex-col items-start gap-1.5">
              <Link href="/contact" data-track="cta_contact_footer" className="whitespace-nowrap py-0.5 text-[14px] font-bold text-forest hover:text-progress">
                Tell us what you need &rarr;
              </Link>
              <p className="m-0 py-0.5 text-[14px] leading-[1.7] text-ink">
                <a href={CONTACT.phoneHref} data-track="call_click" className="hover:text-progress">
                  {CONTACT.phoneDisplay}
                </a>
                <br />
                <a href={`mailto:${CONTACT.email}`} data-track="email_click" className="hover:text-progress">
                  {CONTACT.email}
                </a>
              </p>
              <a href={D_SOURCE_URL} className="whitespace-nowrap py-0.5 text-[14px] font-medium text-charcoal hover:text-progress">
                Shop D&rsquo;Source &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-forest/12 pt-4">
          <p className="m-0 text-[12.5px] text-[#4A5A54]">&copy; 2026 D&rsquo;Matek Technology Limited. Lagos, Nigeria.</p>
          <p className="m-0 whitespace-nowrap text-[12.5px] font-bold tracking-[0.12em] text-progress">WE&rsquo;LL FIGURE IT OUT.</p>
        </div>
      </div>
    </footer>
  );
}
