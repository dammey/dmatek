import type { MetadataRoute } from "next";

const siteUrl = "https://www.dmatek.ng";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
