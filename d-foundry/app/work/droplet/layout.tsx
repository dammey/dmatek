import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLIENT_WORK_APPROVED } from "@/lib/clientWork";

export const metadata: Metadata = {
  title: "Droplet — Case Study",
  description:
    "Water on demand for Blessed Water, live in Lagos and Ibadan. How D’Foundry built Droplet: one-tap reorders, subscriptions and recycling pickups.",
  openGraph: {
    title: "Droplet — Case Study | D’Foundry",
    description: "Water on demand for Blessed Water, live in Lagos and Ibadan.",
    images: ["/assets/droplet-dash.jpg"],
  },
};

export default function DropletLayout({ children }: { children: React.ReactNode }) {
  // Hidden until Blessed Water gives written permission to be named.
  if (!CLIENT_WORK_APPROVED) notFound();
  return children;
}
