import { SITE_URL } from "@/lib/sites";
import type { MetadataRoute } from "next";

const siteUrl = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/basket", "/account", "/track", "/search"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
