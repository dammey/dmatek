import type { Metadata } from "next";
import Listing from "@/components/Listing";

export const metadata: Metadata = { title: "Shop", description: "Everything we source, checked before it reaches you." };

export default function ShopPage() {
  return <Listing />;
}
