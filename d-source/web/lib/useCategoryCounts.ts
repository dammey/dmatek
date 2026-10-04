"use client";

import { useEffect, useState } from "react";
import { api } from "./api";
import type { Product, Store } from "./types";

/** Product count per category name for a store. Uses the lightweight
 * /catalogue/category-counts endpoint; falls back to counting the full
 * product list if the backend doesn't have that endpoint yet. */
export function useCategoryCounts(store: Store): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    api
      .get<{ counts: Record<string, number> }>(`/catalogue/category-counts?store=${store}`)
      .then(({ counts }) => setCounts(counts))
      .catch(() =>
        api
          .get<{ items: Product[] }>(`/catalogue/products?store=${store}`)
          .then(({ items }) => {
            const c: Record<string, number> = {};
            for (const p of items) if (p.categories?.name) c[p.categories.name] = (c[p.categories.name] ?? 0) + 1;
            setCounts(c);
          })
          .catch(() => {}),
      );
  }, [store]);

  return counts;
}
