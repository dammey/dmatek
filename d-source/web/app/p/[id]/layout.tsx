import type { Metadata } from "next";
import type { Product } from "@/lib/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${apiUrl}/catalogue/products/${id}`, { cache: "no-store" });
    if (!res.ok) return {};
    const { product } = (await res.json()) as { product: Product };
    const description = product.description ?? `${product.name} — genuine, warranty-backed, delivered nationwide.`;
    return {
      title: product.name,
      description,
      openGraph: { title: product.name, description, images: product.images ?? [] },
    };
  } catch {
    return {};
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
