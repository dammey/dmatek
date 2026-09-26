import type { Metadata } from "next";
import { manrope } from "@dmatek/brand";
import BasketDrawer from "@/components/BasketDrawer";
import FlowModal from "@/components/FlowModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { plexMono } from "@/lib/fonts";
import { FlowProvider } from "@/lib/flow-context";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "D’Source", template: "%s · D’Source" },
  description: "Commerce by D’Matek. D’Emporium for home, D’Provision for business.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plexMono.variable}`} style={{ fontFamily: "var(--font-sans)" }}>
        <AuthProvider>
          <CartProvider>
            <FlowProvider>
              <Header />
              {children}
              <Footer />
              <BasketDrawer />
              <FlowModal />
              <Toast />
            </FlowProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
