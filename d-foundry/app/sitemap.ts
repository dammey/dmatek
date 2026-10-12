import type { MetadataRoute } from "next";

import { CLIENT_WORK_APPROVED } from "@/lib/clientWork";
import { SITE_URL } from "@/lib/sites";

const siteUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = CLIENT_WORK_APPROVED ? ["", "/work/droplet"] : [""];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
