"use client";

import { useEffect, useState } from "react";
import { api } from "./api";
import { EMPORIUM_CATEGORIES, EMPORIUM_CDESC_KEY, PROVISION_CATEGORIES } from "./constants";
import type { Store } from "./types";

export type CategoryPlacement = { slug: string; label: string; canonical: string };

function defaultsFor(store: Store): CategoryPlacement[] {
  return store === "emporium"
    ? EMPORIUM_CATEGORIES.map(([slug, label]) => ({ slug, label, canonical: EMPORIUM_CDESC_KEY[slug] }))
    : PROVISION_CATEGORIES.map((label) => ({ slug: label.toLowerCase(), label, canonical: label }));
}

/** The live, admin-managed category bar for a store (Admin > Categories:
 * reorder/show-hide/add). Initializes to today's known-good defaults so
 * there's no empty-nav flash, then upgrades to the real, live order once
 * /catalogue/category-placements resolves — falling back to the defaults
 * if that fails, so Admin being misconfigured never breaks navigation. */
export function useCategoryNav(store: Store): CategoryPlacement[] {
  const [placements, setPlacements] = useState<CategoryPlacement[]>(() => defaultsFor(store));

  useEffect(() => {
    api
      .get<{ placements: CategoryPlacement[] }>(`/catalogue/category-placements?store=${store}`)
      .then(({ placements }) => {
        if (placements.length) setPlacements(placements);
      })
      .catch(() => {});
  }, [store]);

  return placements;
}
