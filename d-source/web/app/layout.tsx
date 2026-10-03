import type { Metadata } from "next";
import { manrope } from "@dmatek/brand";
import BasketDrawer from "@/components/BasketDrawer";
import FlowModal from "@/components/FlowModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import KitOverlay from "@/components/KitOverlay";
import Toast from "@/components/Toast";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { plexMono } from "@/lib/fonts";
import { FlowProvider } from "@/lib/flow-context";
import { KitOverlayProvider } from "@/lib/kit-overlay-context";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "D’Source | Commerce by D’Matek", template: "%s · D’Source" },
  description:
    "Commerce by D’Matek. D’Emporium for home, D’Provision for business. Genuine, warranty-backed devices, delivered nationwide and installed by D’Matek engineers.",
  openGraph: {
    type: "website",
    siteName: "D’Source",
    title: "D’Source | Commerce by D’Matek",
    description: "Commerce by D’Matek. D’Emporium for home, D’Provision for business.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "D’Source | Commerce by D’Matek",
    description: "Commerce by D’Matek. D’Emporium for home, D’Provision for business.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body className={`${manrope.variable} ${plexMono.variable}`} style={{ fontFamily: "var(--font-sans)" }}>
        <AuthProvider>
          <CartProvider>
            <FlowProvider>
              <KitOverlayProvider>
                <Header />
                {children}
                <Footer />
                <BasketDrawer />
                <FlowModal />
                <Toast />
                <KitOverlay />
              </KitOverlayProvider>
            </FlowProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
