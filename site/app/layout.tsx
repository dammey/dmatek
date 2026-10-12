import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import WhatsAppFab from "@/components/WhatsAppFab";
import { Analytics } from "@dmatek/brand";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://www.dmatek.ng";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "D’Matek Technology Limited",
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  telephone: "+2347058071768",
  email: "hello@dmatek.ng",
  // Street address, RC number and social profiles are added only once
  // D'Matek supplies them (handoff v3.6 §9).
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "D’Matek Technology Limited | Solving What Matters",
    template: "%s | D’Matek Technology Limited",
  },
  description:
    "D’Matek designs, builds and runs the technology behind businesses, hotels, estates and homes in Lagos: networks, cloud, security, power and managed IT.",
  openGraph: {
    type: "website",
    siteName: "D’Matek Technology Limited",
    title: "D’Matek Technology Limited | Solving What Matters",
    description:
      "D’Matek designs, builds and runs the technology behind businesses, hotels, estates and homes in Lagos: networks, cloud, security, power and managed IT.",
    url: siteUrl,
    images: ["/assets/photos/team-real.jpg"],
  },
  alternates: { canonical: "/" },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/photos/team-real.jpg"],
    title: "D’Matek Technology Limited | Solving What Matters",
    description:
      "D’Matek designs, builds and runs the technology behind businesses, hotels, estates and homes in Lagos: networks, cloud, security, power and managed IT.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-cream antialiased">
        <a
          href="#main"
          className="absolute left-[-9999px] top-2 z-[200] rounded-full bg-forest px-5 py-3 text-cream focus:left-2"
        >
          Skip to content
        </a>
        <ScrollProgressBar />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
