"use client";

import Link from "next/link";
import { CDESC } from "@/lib/constants";
import { useCategoryNav } from "@/lib/useCategoryNav";
import { useCategoryCounts } from "@/lib/useCategoryCounts";
import type { Store } from "@/lib/types";

type Tile = { slug: string; label: string; desc: string; count: number };

export function CategoryGroup({ store }: { store: Store }) {
  const emp = store === "emporium";
  const placements = useCategoryNav(store);
  const counts = useCategoryCounts(store);
  const tiles: Tile[] = placements.map((p) => ({ slug: p.slug, label: p.label, desc: CDESC[store][p.canonical] ?? "", count: counts[p.canonical] ?? 0 }));
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
