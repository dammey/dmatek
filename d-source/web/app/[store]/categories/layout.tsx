import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ store: string }> }): Promise<Metadata> {
  const { store } = await params;
  if (store !== "emporium" && store !== "provision") return {};
  return {
    title: store === "emporium" ? "Home categories" : "Business categories",
    description: "Pick a category to see every product in it.",
  };
}

export default function StoreCategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
