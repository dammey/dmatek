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

export default async function LegalPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const l = LEGAL[topic];
  if (!l) notFound();

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {Object.keys(LEGAL).map((id) => (
            <Link key={id} href={`/legal/${id}`} style={{ padding: "8px 4px", fontWeight: id === topic ? 800 : 600, borderBottom: id === topic ? "2px solid #D4A637" : "2px solid transparent" }}>
              {LEGAL[id].title}
            </Link>
          ))}
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-0.04em", marginBottom: 24 }}>{l.title}</h1>
        {l.sections.map((s, i) => (
          <div key={s} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(6,56,46,.08)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#5E6E68" }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontWeight: 700 }}>{s}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
