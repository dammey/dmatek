import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = "https://dfoundry.vercel.app";

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
    <html lang="en" className={`${bricolage.variable} ${instrument.variable} ${plexMono.variable} h-full`}>
      <head>
        <noscript>
          <style>{`[data-rv]{opacity:1 !important;transform:none !important;clip-path:none !important;}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col overflow-x-clip bg-forest text-cream antialiased">
        <a
          href="#main"
          className="absolute left-[-9999px] top-2 z-[200] rounded-full bg-gold px-5 py-3 text-forest focus:left-2"
        >
          Skip to content
        </a>
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
