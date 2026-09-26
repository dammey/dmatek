"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { EMPORIUM_CATEGORIES, PROVISION_CATEGORIES } from "@/lib/constants";
import type { Category, Product, Store } from "@/lib/types";

const BUCKETS: [string, number, number][] = [
  ["Under ₦250k", 0, 250000],
  ["₦250k – ₦750k", 250000, 750000],
  ["₦750k – ₦1.5m", 750000, 1500000],
  ["Over ₦1.5m", 1500000, 1e12],
];

export default function CategoryPage() {
  const params = useParams<{ store: string; category: string }>();
  const store = params.store as Store;
  if (store !== "emporium" && store !== "provision") notFound();

  const label =
    (store === "emporium" ? EMPORIUM_CATEGORIES : PROVISION_CATEGORIES.map((l) => [l.toLowerCase(), l] as const)).find(([k]) => k === params.category)?.[1] ??
    params.category;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brand, setBrand] = useState<string | null>(null);
  const [bucket, setBucket] = useState<number | null>(null);
  const [freeSetup, setFreeSetup] = useState(false);
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  useEffect(() => {
    api.get<{ categories: Category[] }>("/catalogue/categories").then(({ categories }) => setCategories(categories));
  }, []);

  const categoryId = categories.find((c) => c.slug === params.category)?.id;

  useEffect(() => {
    const qs = new URLSearchParams({ store });
    if (categoryId) qs.set("category", categoryId);
    if (brand) qs.set("brand", brand);
    if (freeSetup) qs.set("freeSetup", "true");
    if (bucket != null) {
      qs.set("priceMin", String(BUCKETS[bucket][1]));
      qs.set("priceMax", String(BUCKETS[bucket][2]));
    }
    if (sort !== "featured") qs.set("sort", sort);
    api
      .get<{ items: Product[] }>(`/catalogue/products?${qs}`)
      .then(({ items }) => setProducts(items))
      .catch(() => setProducts([]));
  }, [store, categoryId, brand, bucket, freeSetup, sort]);

  const brands = useMemo(() => [...new Set(products.map((p) => (p.specs?.brand as string) ?? "").filter(Boolean))], [products]);

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.1em",
            padding: "5px 9px",
            borderRadius: 4,
            background: store === "emporium" ? "#0C1411" : "#06382E",
            color: store === "emporium" ? "#A6F000" : "#D4A637",
          }}
        >
          {store === "emporium" ? "D’EMPORIUM · FOR HOME" : "D’PROVISION · FOR BUSINESS"}
        </span>
        <h1 style={{ margin: "16px 0 32px", fontWeight: 800, fontSize: "clamp(32px,4.4vw,56px)", letterSpacing: "-0.04em" }}>{label}</h1>

        <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0,1fr)", gap: 32 }}>
          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {brands.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#5E6E68", marginBottom: 8 }}>BRAND</p>
                {brands.map((b) => (
                  <button key={b} type="button" onClick={() => setBrand(brand === b ? null : b)} style={{ display: "block", border: 0, background: "transparent", padding: "6px 0", fontWeight: brand === b ? 800 : 500, color: "#06382E" }}>
                    {b}
                  </button>
                ))}
              </div>
            )}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#5E6E68", marginBottom: 8 }}>PRICE</p>
              {BUCKETS.map(([l], i) => (
                <button key={l} type="button" onClick={() => setBucket(bucket === i ? null : i)} style={{ display: "block", border: 0, background: "transparent", padding: "6px 0", fontWeight: bucket === i ? 800 : 500, color: "#06382E" }}>
                  {l}
                </button>
              ))}
            </div>
            {store === "emporium" && (
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700 }}>
                <input type="checkbox" checked={freeSetup} onChange={(e) => setFreeSetup(e.target.checked)} /> Free set-up only
              </label>
            )}
          </aside>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#5E6E68" }}>{products.length} product{products.length === 1 ? "" : "s"}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 999, padding: "8px 14px", fontSize: 14 }}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
            {products.length === 0 && <p style={{ color: "#5E6E68" }}>Nothing here yet — the catalogue is still being loaded by staff.</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} store={store} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
