import type { Metadata } from "next";

/** Per-page metadata: title, description, canonical (resolved against
 * https://www.dmatek.ng by the root metadataBase), Open Graph and Twitter,
 * so a shared link previews the page itself rather than the home page. */
export function pageMeta({ title, description, path, ogTitle, image }: { title: string; description: string; path: string; ogTitle?: string; image?: string }): Metadata {
  const t = ogTitle ?? `${title} | D’Matek Technology Limited`;
  const images = [image ?? "/assets/photos/team-real.jpg"];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "D’Matek Technology Limited", title: t, description, url: path, images },
    twitter: { card: "summary_large_image", title: t, description, images },
  };
}
