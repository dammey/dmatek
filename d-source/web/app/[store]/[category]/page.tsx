"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductListing from "@/components/ProductListing";
import { api } from "@/lib/api";
import { CDESC, EMPORIUM_CATEGORIES, EMPORIUM_CDESC_KEY, PROVISION_CATEGORIES } from "@/lib/constants";
import type { Category, Product, Store } from "@/lib/types";

export default function CategoryPage() {
  const params = useParams<{ store: string; category: string }>();
  const store = params.store as Store;
  if (store !== "emporium" && store !== "provision") notFound();
  const emp = store === "emporium";

  const allCats = emp ? EMPORIUM_CATEGORIES : PROVISION_CATEGORIES.map((l) => [l.toLowerCase(), l] as const);
  const label = allCats.find(([k]) => k === params.category)?.[1] ?? params.category;
  const canonical = emp ? EMPORIUM_CDESC_KEY[params.category] : label;
  const desc = CDESC[store][canonical] ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get<{ categories: Category[] }>("/catalogue/categories")
      .then(({ categories }) => setCategories(categories))
      .catch(() => setCategories([]));
  }, []);

  const categoryId = categories.find((c) => c.slug === params.category)?.id;

  useEffect(() => {
    const qs = new URLSearchParams({ store });
    if (categoryId) qs.set("category", categoryId);
    api
      .get<{ items: Product[] }>(`/catalogue/products?${qs}`)
      .then(({ items }) => setProducts(items))
      .catch(() => setProducts([]));
  }, [store, categoryId]);

  return (
    <ProductListing
      crumbs={[{ label: "D’Source", href: "/" }, { label: emp ? "D’Emporium" : "D’Provision", href: `/${store}` }]}
      crumbLast={label}
      listTag={{ text: emp ? "D’EMPORIUM · FOR HOME" : "D’PROVISION · FOR BUSINESS", bg: emp ? "#0C1411" : "#06382E", ink: emp ? "#A6F000" : "#D4A637" }}
      title={label}
      desc={desc}
      siblings={allCats.map(([k, l]) => ({ label: l, href: `/${store}/${k}`, active: k === params.category }))}
      products={products}
    />
  );
}
