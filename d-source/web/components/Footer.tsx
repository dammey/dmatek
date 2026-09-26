import Link from "next/link";
import { AdireBand } from "@dmatek/brand";

const DMATEK_URL = process.env.NEXT_PUBLIC_DMATEK_URL ?? "https://dmatek.ng";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "SHOP",
    links: [
      { label: "All products", href: "/search" },
      { label: "All categories", href: "/categories" },
      { label: "D’Emporium · Home", href: "/emporium" },
      { label: "D’Provision · Business", href: "/provision" },
      { label: "Office in a Box", href: "/office-in-a-box" },
    ],
  },
  {
    title: "BUSINESS",
    links: [
      { label: "Request a quote", href: "/provision" },
      { label: "Book a free site survey", href: "/site-survey" },
      { label: "Apply for a business account", href: "/account?tab=biz" },
    ],
  },
  {
    title: "HELP",
    links: [
      { label: "Delivery", href: "/help/delivery" },
      { label: "Payment", href: "/help/payment" },
      { label: "Installation and set-up", href: "/help/install" },
      { label: "Returns", href: "/help/returns" },
      { label: "Warranty and repairs", href: "/help/warranty" },
      { label: "Track an order", href: "/track" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About D’Source", href: "/about" },
      { label: "My account", href: "/account" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#EFEADC", color: "#06382E", fontSize: 13.5, borderTop: "1px solid rgba(6,56,46,.12)" }}>
      <AdireBand variant="footer" />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 18px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.04em" }}>D&rsquo;Source</span>
            <span style={{ color: "#3A4A44" }}>Commerce by D&rsquo;Matek.</span>
            <span style={{ color: "#3A4A44" }}>[ PHONE ] · [ EMAIL ] · [ WHATSAPP ]</span>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#28705A", marginBottom: 12 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((l) => (
                  <Link key={l.href} href={l.href} style={{ fontSize: 13.5, color: "#06382E" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(6,56,46,.14)",
            marginTop: 28,
            paddingTop: 16,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            letterSpacing: "0.12em",
            color: "#3A4A44",
          }}
        >
          <span>D&rsquo;SOURCE · D&rsquo;EMPORIUM · D&rsquo;PROVISION</span>
          <a href={DMATEK_URL} style={{ color: "#06382E", fontWeight: 600 }}>
            PART OF D&rsquo;MATEK ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
