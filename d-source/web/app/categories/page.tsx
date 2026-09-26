import Link from "next/link";
import { EMPORIUM_CATEGORIES, PROVISION_CATEGORIES } from "@/lib/constants";

export const metadata = { title: "All categories" };

export default function CategoriesPage() {
  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px,4.4vw,56px)", letterSpacing: "-0.04em", marginBottom: 32 }}>All categories</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: 24 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 12 }}>D&rsquo;Emporium · For home</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {EMPORIUM_CATEGORIES.map(([key, label]) => (
                <Link key={key} href={`/emporium/${key}`} style={{ padding: "10px 0", borderBottom: "1px solid rgba(6,56,46,.1)", fontWeight: 600 }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 12 }}>D&rsquo;Provision · For business</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {PROVISION_CATEGORIES.map((label) => (
                <Link key={label} href={`/provision/${label.toLowerCase()}`} style={{ padding: "10px 0", borderBottom: "1px solid rgba(6,56,46,.1)", fontWeight: 600 }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
