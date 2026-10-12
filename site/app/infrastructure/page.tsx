import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import InfrastructureClient from "./InfrastructureClient";

export const metadata: Metadata = pageMeta({
  title: "Infrastructure · Networks, Wi-Fi and business internet",
  description: "D’Matek Infrastructure designs, builds and operates networks, Wi-Fi, fibre and business internet for offices, estates and events.",
  path: "/infrastructure",
  ogTitle: "D’Matek Infrastructure · Connect it",
  image: "/assets/photos/cabling-site.jpg",
});

export default function InfrastructurePage() {
  return <InfrastructureClient />;
}
