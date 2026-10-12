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
  // Shown with Blessed Water’s written permission; NEXT_PUBLIC_FOUNDRY_CLIENT_WORK=hidden takes it down.
  if (!CLIENT_WORK_APPROVED) notFound();
  return children;
}
