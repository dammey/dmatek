import type { MetadataRoute } from "next";

const siteUrl = "https://www.dmatek.ng";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/approach", "/businesses", "/work", "/about", "/contact"];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
