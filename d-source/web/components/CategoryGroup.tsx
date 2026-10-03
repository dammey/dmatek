import Link from "next/link";
import { EMPORIUM_CATEGORIES, PROVISION_CATEGORIES } from "@/lib/constants";
import type { Product, Store } from "@/lib/types";

/** Real, verbatim category descriptions from the design source (CDESC). */
const CDESC: Record<Store, Record<string, string>> = {
  emporium: {
    Laptops: "Laptops for work, study and home. Genuine and warranty-backed, with free set-up and data transfer.",
    Phones: "Phones and tablets, with free set-up and data transfer from your old phone.",
    Networking: "Mesh Wi-Fi, routers and extenders so every room gets signal.",
    "TV & Audio": "TVs, soundbars and projectors. Wall mounting is free on TVs.",
    Power: "Inverters, batteries, UPS and power banks that keep things on through outages.",
    Security: "Cameras, doorbells and smart locks for your gate and your home.",
  },
  provision: {
    Networking: "Access points, switches and gateways for the whole building, specified to the site.",
    Computing: "Laptops and desktops for teams, with volume pricing on larger orders.",
    Security: "NVRs, cameras, intercoms and access control for sites and estates.",
    Displays: "Signage, interactive boards and meeting-room displays.",
  },
};

// Emporium URL slugs vs. the canonical category name products are filed under
// (the nav tab label can differ from it, e.g. slug "networking" shows as "Wi-Fi").
const EMPORIUM_CDESC_KEY: Record<string, string> = { laptops: "Laptops", phones: "Phones", networking: "Networking", tvaudio: "TV & Audio", power: "Power", security: "Security" };

type Tile = { slug: string; label: string; desc: string; count: number };

function tilesFor(store: Store, products: Product[]): Tile[] {
  const list: [string, string][] = store === "emporium" ? EMPORIUM_CATEGORIES : PROVISION_CATEGORIES.map((l) => [l.toLowerCase(), l]);
  return list.map(([slug, label]) => {
    const canonical = store === "emporium" ? EMPORIUM_CDESC_KEY[slug] : label;
    return { slug, label, desc: CDESC[store][canonical] ?? "", count: products.filter((p) => p.categories?.name === canonical).length };
  });
}

export function CategoryGroup({ store, products }: { store: Store; products: Product[] }) {
  const emp = store === "emporium";
  const tiles = tilesFor(store, products);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderTop: "2px solid #D4A637", paddingTop: 12 }}>
        <span style={{ fontWeight: 800, fontSize: "clamp(22px,2.4vw,30px)", letterSpacing: "-0.03em" }}>{emp ? "D’Emporium · For home" : "D’Provision · For business"}</span>
        <Link href={`/${store}`} style={{ border: 0, background: "transparent", padding: "0 0 2px", fontWeight: 800, fontSize: 14, color: "#06382E", borderBottom: "2px solid #D4A637" }}>
          {emp ? "All home products →" : "All business products →"}
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,260px),1fr))", gap: 12 }}>
        {tiles.map((t) => (
          <Link
            key={t.slug}
            href={`/${store}/${t.slug}`}
            style={{ textAlign: "left", border: "1px solid #E6E2D8", background: "#FFFFFF", color: "#06382E", borderRadius: emp ? 6 : 22, padding: "12px 12px 18px", display: "flex", flexDirection: "column", gap: 10 }}
          >
            <span style={{ display: "block", position: "relative", aspectRatio: "16/10", borderRadius: emp ? 3 : 16, overflow: "hidden", background: "#F6F4EF" }} />
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, padding: "0 4px" }}>
              <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}>{t.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#5E6E68" }}>
                {t.count} product{t.count === 1 ? "" : "s"}
              </span>
            </span>
            <span style={{ fontSize: 14, lineHeight: 1.5, color: "#3A4A44", padding: "0 4px" }}>{t.desc}</span>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: "#06382E", padding: "0 4px" }}>Shop {t.label} &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
