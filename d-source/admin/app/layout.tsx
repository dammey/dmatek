import type { Metadata } from "next";
import { manrope } from "@dmatek/brand";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/lib/auth-context";
import { plexMono } from "@/lib/fonts";
import { ToastProvider } from "@/lib/toast-context";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "D’Source Admin", template: "%s · D’Source Admin" },
  description: "Internal tool for D'Source staff.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plexMono.variable}`}>
        <AuthProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
