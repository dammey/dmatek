"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import ProductListing from "@/components/ProductListing";
import { api } from "@/lib/api";
import { LABEL_BY_CANON } from "@/lib/constants";
import type { Product, Store } from "@/lib/types";

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
  const [qMatched, setQMatched] = useState<Product[]>([]);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    api
      .get<{ items: Product[] }>(`/catalogue/products?${qs}`)
      .then(({ items }) => setQMatched(items))
      .catch(() => setQMatched([]));
  }, [q]);

  return <SearchResults key={q} q={q} qMatched={qMatched} />;
}

function SearchResults({ q, qMatched }: { q: string; qMatched: Product[] }) {
  const [fStore, setFStore] = useState<Store | null>(null);
  const [fCat, setFCat] = useState<string | null>(null);

  const catKeys = useMemo(() => {
    const scoped = fStore ? qMatched.filter((p) => p.store === fStore) : qMatched;
    return [...new Set(scoped.map((p) => `${p.store}|${p.categories?.name ?? ""}`))].filter((k) => !k.endsWith("|"));
  }, [qMatched, fStore]);

  const scopedProducts = useMemo(() => {
    let res = qMatched;
    if (fStore) res = res.filter((p) => p.store === fStore);
    if (fCat) res = res.filter((p) => `${p.store}|${p.categories?.name ?? ""}` === fCat);
    return res;
  }, [qMatched, fStore, fCat]);

  const title = q ? `“${q}”` : fStore === "emporium" ? "All home products" : fStore === "provision" ? "All business products" : "All products";
  const desc = q
    ? "Results from D’Emporium and D’Provision."
    : "Everything in D’Emporium and D’Provision. Filter by store, category, brand and price.";
  const crumbLast = q ? "Search" : fStore === "emporium" ? "All home products" : fStore === "provision" ? "All business products" : "All products";

  return (
    <ProductListing
      crumbs={[{ label: "D’Source", href: "/" }]}
      crumbLast={crumbLast}
      title={title}
      desc={desc}
      products={scopedProducts}
      scope={{
        stores: (["emporium", "provision"] as const).map((k) => ({
          label: k === "emporium" ? "D’Emporium · Home" : "D’Provision · Business",
          n: qMatched.filter((p) => p.store === k).length,
          active: fStore === k,
          onPick: () => {
            setFStore((x) => (x === k ? null : k));
            setFCat(null);
          },
        })),
        cats: catKeys.map((ck) => {
          const [st, canon] = ck.split("|") as [Store, string];
          const label = (LABEL_BY_CANON[st]?.[canon] ?? canon) + (!fStore && st === "provision" ? " (business)" : "");
          return {
            label,
            n: qMatched.filter((p) => p.store === st && (p.categories?.name ?? "") === canon).length,
            active: fCat === ck,
            onPick: () => setFCat((x) => (x === ck ? null : ck)),
          };
        }),
      }}
    />
  );
}
