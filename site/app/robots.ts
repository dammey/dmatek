import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const siteUrl = "https://www.dmatek.ng";

/** Crawlable only on dmatek.ng; every other host (e.g. *.vercel.app) is closed. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get("host") ?? "").split(":")[0];
  if (!/(^|\.)dmatek\.ng$/.test(host)) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
