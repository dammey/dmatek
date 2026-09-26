import Link from "next/link";
import { notFound } from "next/navigation";
import { EMPORIUM_CATEGORIES, PROVISION_CATEGORIES } from "@/lib/constants";

export default async function StoreCategoriesPage({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params;
  if (store !== "emporium" && store !== "provision") notFound();
  const isEmp = store === "emporium";
  const cats = isEmp ? EMPORIUM_CATEGORIES.map(([k, l]) => [k, l] as const) : PROVISION_CATEGORIES.map((l) => [l.toLowerCase(), l] as const);

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px,4.4vw,56px)", letterSpacing: "-0.04em", marginBottom: 32 }}>
          {isEmp ? "Home categories" : "Business categories"}
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {cats.map(([key, label]) => (
            <Link
              key={key}
              href={`/${store}/${key}`}
              style={{ background: "#F6F4EF", borderRadius: isEmp ? 6 : 22, padding: 20, fontWeight: 800, fontSize: 18, display: "block" }}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
