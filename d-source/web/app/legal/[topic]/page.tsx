import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const LEGAL: Record<string, { title: string; sections: string[] }> = {
  terms: {
    title: "Terms of sale",
    sections: ["Who we are", "Ordering and acceptance", "Prices and payment", "Delivery", "Installation and set-up", "Returns and refunds", "Warranty and repairs", "Business accounts and invoices", "Liability", "Governing law"],
  },
  privacy: {
    title: "Privacy policy",
    sections: ["What we collect", "How we use it", "Who we share it with", "How long we keep it", "Your rights under the NDPA", "Contacting our data protection officer"],
  },
  cookies: { title: "Cookie policy", sections: ["What cookies are", "Cookies we use", "Managing cookies"] },
};

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const l = LEGAL[topic];
  if (!l) return {};
  return { title: l.title };
}

export default async function LegalPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const l = LEGAL[topic];
  if (!l) notFound();

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D’Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>›</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>Legal</span>
      </div>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,48px)", alignItems: "flex-start" }}>
          <nav style={{ flex: "0 1 240px", minWidth: "min(100%,200px)", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 130 }}>
            {Object.keys(LEGAL).map((id) => {
              const active = id === topic;
              return (
                <Link
                  key={id}
                  href={`/legal/${id}`}
                  style={{
                    textAlign: "left",
                    borderLeft: `3px solid ${active ? "#D4A637" : "transparent"}`,
                    background: active ? "#F5F1E8" : "transparent",
                    color: "#06382E",
                    padding: "12px 16px",
                    fontSize: 15,
                    fontWeight: active ? 800 : 600,
                    borderRadius: "0 12px 12px 0",
                  }}
                >
                  {LEGAL[id].title}
                </Link>
              );
            })}
          </nav>
          <article style={{ flex: "1 1 520px", minWidth: 0, maxWidth: 760, display: "flex", flexDirection: "column", gap: 18 }}>
            <h1 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>{l.title}</h1>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", color: "#5E6E68" }}>LAST UPDATED [ DATE ] · D’MATEK TECHNOLOGY LIMITED</span>
            {l.sections.map((s, i) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 14, borderTop: "1px solid #EEEAE2" }}>
                <h2 style={{ margin: 0, fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em" }}>
                  {i + 1}. {s}
                </h2>
                <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#5E6E68" }}>[ LEGAL TEXT TO BE SUPPLIED BY COUNSEL ]</p>
              </div>
            ))}
          </article>
        </div>
      </section>
    </main>
  );
}
