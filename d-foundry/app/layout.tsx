import type { Metadata } from "next";
import "./globals.css";

// Loaded via the exact Google Fonts CSS2 URL from the source <helmet> (not next/font/google):
// next/font serves Bricolage Grotesque as static per-weight instances with no variable axes,
// which drops its opsz (optical size) axis. At the title sequence's large display sizes that
// changes character widths enough to shift line-wrapping versus the source -- confirmed via
// side-by-side screenshot comparison. The literal Google Fonts URL preserves opsz 12..96
// exactly like the reference, so glyph metrics match at every size.
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

const siteUrl = "https://dfoundry-dammey-s-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "D’Foundry: Built for your problem",
    template: "%s | D’Foundry",
  },
  description:
    "D’Foundry builds the software, applications, automations and integrations that solve a specific problem properly. A D’Matek business.",
  openGraph: {
    type: "website",
    siteName: "D’Foundry",
    title: "D’Foundry: Built for your problem, not for a demo.",
    description: "Software, applications, automations and integrations. A D’Matek business.",
    url: siteUrl,
    images: ["/assets/dmatek-team.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "D’Foundry: Built for your problem, not for a demo.",
    description: "Software, applications, automations and integrations. A D’Matek business.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body>{children}</body>
    </html>
  );
}
