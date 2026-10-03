"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductListing from "@/components/ProductListing";
import { api } from "@/lib/api";
import { CDESC } from "@/lib/constants";
import { useCategoryNav } from "@/lib/useCategoryNav";
import type { Category, Product, Store } from "@/lib/types";

export default function CategoryPage() {
  const params = useParams<{ store: string; category: string }>();
  const store = params.store as Store;
  if (store !== "emporium" && store !== "provision") notFound();
  const emp = store === "emporium";

  const allCats = useCategoryNav(store);
  const current = allCats.find((c) => c.slug === params.category);
  const label = current?.label ?? params.category;
  const canonical = current?.canonical ?? label;
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
      siblings={allCats.map((c) => ({ label: c.label, href: `/${store}/${c.slug}`, active: c.slug === params.category }))}
      products={products}
    />
  );
}
