import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provision · For your business",
  description: "Bulk purchase, IT room and server setup, Wi-Fi and network installation, security and CCTV, company device repairs and Office in a Box. Quotes within 24 hours.",
};

export default function ProvisionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
