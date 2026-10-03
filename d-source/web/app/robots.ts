import type { MetadataRoute } from "next";

const siteUrl = "https://source.dmatek.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/basket", "/account", "/track", "/search"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
