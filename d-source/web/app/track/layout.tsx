import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track an Order",
  robots: { index: false, follow: true },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
