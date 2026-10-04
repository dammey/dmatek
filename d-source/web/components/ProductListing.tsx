"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useFlow } from "@/lib/flow-context";
import { photosFirst, type Product } from "@/lib/types";

const PAGE = 24;

const BUCKETS: [string, number, number][] = [
  ["Under ₦250k", 0, 250000],
  ["₦250k – ₦750k", 250000, 750000],
  ["₦750k – ₦1.5m", 750000, 1500000],
  ["Over ₦1.5m", 1500000, 1e12],
];

type Crumb = { label: string; href: string };
type Sibling = { label: string; href: string; active: boolean };
type ScopeOption = { label: string; n: number; active: boolean; onPick: () => void };

export default function ProductListing({
  crumbs,
  crumbLast,
  listTag,
  title,
  desc,
  siblings,
  scope,
  products,
}: {
  crumbs: Crumb[];
  crumbLast: string;
  listTag?: { text: string; bg: string; ink: string };
  title: string;
  desc: string;
  siblings?: Sibling[];
  scope?: { stores: ScopeOption[]; cats: ScopeOption[] };
  products: Product[];
}) {
  const { startFlow } = useFlow();
  const [brandSel, setBrandSel] = useState<Record<string, boolean>>({});
  const [priceSel, setPriceSel] = useState<number | null>(null);
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  const brands = useMemo(() => [...new Set(products.map((p) => (p.specs?.brand as string) ?? "").filter(Boolean))], [products]);

  const results = useMemo(() => {
    let res = products.filter((p) => !Object.keys(brandSel).some((k) => brandSel[k]) || brandSel[(p.specs?.brand as string) ?? ""]);
    if (priceSel != null) {
      const [, lo, hi] = BUCKETS[priceSel];
      res = res.filter((p) => (p.price ?? 0) >= lo && (p.price ?? 0) < hi);
    }
    if (freeOnly) res = res.filter((p) => (p.specs?.free as boolean) ?? false);
    if (sort === "low") res = res.slice().sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === "high") res = res.slice().sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else res = photosFirst(res);
    return res;
  }, [products, brandSel, priceSel, freeOnly, sort]);

  const resultCount = `${results.length} product${results.length === 1 ? "" : "s"}`;

  // Render in pages: drawing hundreds of cards at once is what makes big categories slow.
  const filterKey = JSON.stringify([brandSel, priceSel, freeOnly, sort, products.length]);
  const [page, setPage] = useState({ key: filterKey, n: PAGE });
  const shownCount = page.key === filterKey ? page.n : PAGE;
  const visible = results.slice(0, shownCount);

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        {crumbs.map((c) => (
          <span key={c.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link href={c.href} style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
              {c.label}
            </Link>
            <span style={{ color: "#B9B3A6" }}>&rsaquo;</span>
          </span>
        ))}
        <span style={{ fontWeight: 700, color: "#06382E" }}>{crumbLast}</span>
      </div>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(20px,3vh,36px) clamp(18px,3vw,40px) 0" }}>
        {listTag && (
          <span
            style={{ display: "inline-block", fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", padding: "5px 9px", borderRadius: 4, background: listTag.bg, color: listTag.ink, marginBottom: 14 }}
          >
            {listTag.text}
          </span>
        )}
        <h1 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>{title}</h1>
        <p style={{ margin: 0, maxWidth: "44em", fontSize: 17, lineHeight: 1.6, color: "#3A4A44" }}>{desc}</p>
        {siblings && siblings.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 22 }}>
            {siblings.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                style={{ border: `1px solid ${s.active ? "#06382E" : "#E6E2D8"}`, background: s.active ? "#06382E" : "#fff", color: s.active ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "9px 16px", fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap" }}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(24px,3vh,36px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)", display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,40px)", alignItems: "flex-start" }}>
        <aside style={{ flex: "0 1 240px", minWidth: "min(100%,200px)", display: "flex", flexDirection: "column", gap: 22, position: "sticky", top: 130 }}>
          {scope && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#28705A" }}>STORE</span>
                {scope.stores.map((b) => (
                  <button key={b.label} type="button" onClick={b.onPick} style={{ display: "flex", alignItems: "flex-start", gap: 10, border: 0, background: "transparent", padding: 0, minHeight: 24, fontSize: 14.5, lineHeight: 1.35, fontWeight: 600, color: "#06382E", textAlign: "left" }}>
                    <span style={{ flex: "0 0 auto", width: 20, height: 20, borderRadius: "50%", border: "2px solid #06382E", background: b.active ? "#D4A637" : "transparent" }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      {b.label} <span style={{ color: "#9AA59F", fontSize: 12.5 }}>{b.n}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#28705A" }}>CATEGORY</span>
                {scope.cats.map((b) => (
                  <button key={b.label} type="button" onClick={b.onPick} style={{ display: "flex", alignItems: "flex-start", gap: 10, border: 0, background: "transparent", padding: 0, minHeight: 24, fontSize: 14.5, lineHeight: 1.35, fontWeight: 600, color: "#06382E", textAlign: "left" }}>
                    <span style={{ flex: "0 0 auto", width: 20, height: 20, borderRadius: "50%", border: "2px solid #06382E", background: b.active ? "#D4A637" : "transparent" }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      {b.label} <span style={{ color: "#9AA59F", fontSize: 12.5 }}>{b.n}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#28705A" }}>BRAND</span>
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBrandSel((x) => ({ ...x, [b]: !x[b] }))}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, border: 0, background: "transparent", padding: 0, minHeight: 24, fontSize: 14.5, lineHeight: 1.35, fontWeight: 600, color: "#06382E", textAlign: "left" }}
              >
                <span style={{ flex: "0 0 auto", width: 20, height: 20, borderRadius: 5, border: "2px solid #06382E", background: brandSel[b] ? "#06382E" : "transparent", color: "#F5F1E8", display: "grid", placeItems: "center", fontSize: 12 }}>
                  {brandSel[b] ? "✓" : ""}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  {b} <span style={{ color: "#9AA59F", fontSize: 12.5 }}>{products.filter((p) => (p.specs?.brand as string) === b).length}</span>
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#28705A" }}>PRICE</span>
            {BUCKETS.map(([label], i) => (
              <button
                key={label}
                type="button"
                onClick={() => setPriceSel((x) => (x === i ? null : i))}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, border: 0, background: "transparent", padding: 0, minHeight: 24, fontSize: 14.5, lineHeight: 1.35, fontWeight: 600, color: "#06382E", textAlign: "left" }}
              >
                <span style={{ flex: "0 0 auto", width: 20, height: 20, borderRadius: "50%", border: "2px solid #06382E", background: priceSel === i ? "#D4A637" : "transparent" }} />
                <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFreeOnly((x) => !x)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid #E6E2D8", background: "#fff", borderRadius: 14, padding: "12px 14px", fontSize: 14, fontWeight: 700, color: "#06382E" }}
          >
            <span>Free set-up only</span>
            <span style={{ width: 40, height: 24, borderRadius: 999, background: freeOnly ? "#06382E" : "#D9D4C8", position: "relative", transition: "background .3s ease" }}>
              <span style={{ position: "absolute", top: 3, left: freeOnly ? 19 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .3s cubic-bezier(.2,.8,.2,1)" }} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setBrandSel({});
              setPriceSel(null);
              setFreeOnly(false);
            }}
            style={{ alignSelf: "flex-start", border: 0, background: "transparent", padding: 0, fontSize: 13.5, fontWeight: 700, color: "#28705A", borderBottom: "1px solid rgba(40,112,90,.4)" }}
          >
            Clear filters
          </button>
        </aside>

        <div style={{ flex: "1 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", paddingBottom: 12, borderBottom: "1px solid #EEEAE2" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#3A4A44" }}>{resultCount}</span>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#5E6E68" }}>
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                style={{ border: "1px solid #E6E2D8", borderRadius: 999, padding: "9px 14px", fontSize: 14, fontWeight: 700, background: "#fff", color: "#06382E" }}
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          </div>

          {results.length === 0 && (
            <div style={{ background: "#F6F4EF", borderRadius: 24, padding: "clamp(24px,4vw,44px)", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em" }}>Nothing matches yet.</span>
              <span style={{ fontSize: 15.5, lineHeight: 1.6, color: "#3A4A44" }}>Clear a filter, or tell us what you need and we&rsquo;ll source it.</span>
              <button type="button" onClick={() => startFlow("enquiry")} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "14px 22px", fontWeight: 800, fontSize: 14.5 }}>
                Tell us what you need &rarr;
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,230px),1fr))", gap: 12 }}>
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {results.length > visible.length && (
            <button
              type="button"
              onClick={() => setPage({ key: filterKey, n: shownCount + PAGE })}
              style={{ alignSelf: "center", border: "1px solid #E6E2D8", background: "#fff", color: "#06382E", borderRadius: 999, padding: "14px 26px", fontWeight: 800, fontSize: 14.5, marginTop: 8 }}
            >
              Show more · {results.length - visible.length} left
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
