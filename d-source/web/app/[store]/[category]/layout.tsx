import type { Metadata } from "next";
import { EMPORIUM_CATEGORIES, PROVISION_CATEGORIES } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ store: string; category: string }> }): Promise<Metadata> {
  const { store, category } = await params;
  if (store !== "emporium" && store !== "provision") return {};
  const label =
    (store === "emporium" ? EMPORIUM_CATEGORIES : PROVISION_CATEGORIES.map((l) => [l.toLowerCase(), l] as const)).find(([k]) => k === category)?.[1] ?? category;
  const storeLabel = store === "emporium" ? "D’Emporium · Home" : "D’Provision · Business";
  return {
    title: `${label} — ${storeLabel}`,
    description: `Shop ${label} from ${storeLabel}. Genuine, warranty-backed devices, delivered nationwide.`,
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
