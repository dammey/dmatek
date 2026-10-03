import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D’Provision · For business",
  description:
    "Business procurement from D’Matek. Quotes within 4 working hours, free site surveys, volume pricing on larger orders, and 30-day invoice for approved accounts.",
};

export default function ProvisionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
