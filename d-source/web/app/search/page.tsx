"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    api
      .get<{ items: Product[] }>(`/catalogue/products?${qs}`)
      .then(({ items }) => setItems(items))
      .catch(() => setItems([]));
  }, [q]);

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px,4.4vw,56px)", letterSpacing: "-0.04em", marginBottom: 8 }}>
          {q ? `“${q}”` : "All products"}
        </h1>
        <p style={{ color: "#5E6E68", marginBottom: 32 }}>Results from D&rsquo;Emporium and D&rsquo;Provision.</p>
        {items.length === 0 && <p style={{ color: "#5E6E68" }}>No results.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} store="emporium" />
          ))}
        </div>
      </section>
    </main>
  );
}
