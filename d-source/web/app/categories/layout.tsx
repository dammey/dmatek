import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All categories",
  description: "Every category in D’Emporium and D’Provision.",
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
