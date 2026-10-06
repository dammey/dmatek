import type { Metadata } from "next";
import { manrope } from "@dmatek/brand";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import Toast from "@/components/Toast";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { plexMono } from "@/lib/fonts";
import "./globals.css";

const siteUrl = "https://source.dmatek.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "D’Source",
  url: siteUrl,
  telephone: "+2347058071768",
  email: "hello@dmatek.ng",
  parentOrganization: { "@type": "Organization", name: "D’Matek Technology Limited", url: "https://www.dmatek.ng" },
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
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <Toast />
            <Reveal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
