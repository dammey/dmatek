import type { MetadataRoute } from "next";
import { EMPORIUM_CATEGORIES, PROVISION_CATEGORIES } from "@/lib/constants";

const siteUrl = "https://source.dmatek.com";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const HELP_TOPICS = ["delivery", "payment", "install", "returns", "warranty", "biz", "contact"];
const LEGAL_TOPICS = ["terms", "privacy", "cookies"];

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
  const staticRoutes = [
    "",
    "/emporium",
    "/provision",
    "/categories",
    "/emporium/categories",
    "/provision/categories",
    ...EMPORIUM_CATEGORIES.map(([key]) => `/emporium/${key}`),
    ...PROVISION_CATEGORIES.map((label) => `/provision/${label.toLowerCase()}`),
    "/about",
    "/office-in-a-box",
    "/site-survey",
    ...HELP_TOPICS.map((t) => `/help/${t}`),
    ...LEGAL_TOPICS.map((t) => `/legal/${t}`),
  ];
  const routes = [...staticRoutes, ...(await productRoutes())];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/p/") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/p/") ? 0.6 : 0.7,
  }));
}
