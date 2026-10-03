import type { MetadataRoute } from "next";
import { environments } from "@/lib/content";

const siteUrl = "https://www.dmatek.ng";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/solutions", "/businesses", "/work", "/about", "/insights", "/contact"];
  const envRoutes = environments.map((e) => `/solutions/${e.id}`);
  return [...routes, ...envRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : route.startsWith("/solutions/") ? 0.6 : 0.7,
  }));
}
