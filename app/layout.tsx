import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://www.dmatek.ng";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "D’Matek Technology Limited | Solving What Matters",
    template: "%s | D’Matek Technology Limited",
  },
  description:
    "A problem-solving company powered by technology. You can trust us. You won’t be alone. We’ll figure it out.",
  openGraph: {
    type: "website",
    siteName: "D’Matek Technology Limited",
    title: "D’Matek Technology Limited | Solving What Matters",
    description:
      "A problem-solving company powered by technology. You can trust us. You won’t be alone. We’ll figure it out.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "D’Matek Technology Limited | Solving What Matters",
    description:
      "A problem-solving company powered by technology. You can trust us. You won’t be alone. We’ll figure it out.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <head>
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
      </body>
    </html>
  );
}
