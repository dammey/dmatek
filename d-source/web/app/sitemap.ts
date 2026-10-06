import type { MetadataRoute } from "next";
import { GROUPS } from "@/lib/shop";

const siteUrl = "https://source.dmatek.com";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";


async function productRoutes(): Promise<string[]> {
  try {
    const res = await fetch(`${apiUrl}/catalogue/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const { items } = (await res.json()) as { items: { id: string }[] };
    return items.map((p) => `/p/${p.id}`);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/shop", ...GROUPS.map((g) => `/shop/${g.slug}`), "/provision", "/source", "/repair", "/guarantee", "/help", "/terms", "/track"];
  const routes = [...staticRoutes, ...(await productRoutes())];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/p/") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/p/") ? 0.6 : 0.7,
  }));
}
