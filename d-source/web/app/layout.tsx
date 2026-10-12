import type { Metadata } from "next";
import { Analytics, DmatekBar, manrope } from "@dmatek/brand";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import Toast from "@/components/Toast";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { SettingsProvider } from "@/lib/settings-context";
import { plexMono } from "@/lib/fonts";
import { DMATEK_URL, SITE_URL } from "@/lib/sites";
import "./globals.css";

const siteUrl = SITE_URL;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "D’Source",
  url: siteUrl,
  telephone: "+2347058071768",
  email: "hello@dmatek.ng",
  parentOrganization: { "@type": "Organization", name: "D’Matek Technology Limited", url: DMATEK_URL },
};

const description = "Technology sourcing in Lagos, by D’Matek. Every item checked before it reaches you. Inspect on delivery, 7-day returns.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "D’Source | Commerce by D’Matek", template: "%s · D’Source" },
  description,
  openGraph: { type: "website", siteName: "D’Source", title: "D’Source | Commerce by D’Matek", description, url: siteUrl },
  twitter: { card: "summary_large_image", title: "D’Source | Commerce by D’Matek", description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className={`${manrope.variable} ${plexMono.variable}`}>
        <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <DmatekBar dmatekUrl={DMATEK_URL} />
            <Header />
            {children}
            <Footer />
            <Toast />
            <Reveal />
            <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          </CartProvider>
        </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
