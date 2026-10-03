import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About D’Source",
  description:
    "Commerce by D’Matek. Genuine, warranty-backed devices and equipment, set up and supported by the same team that builds the connectivity and systems behind it.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
