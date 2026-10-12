import type { Metadata } from "next";
import InfrastructureClient from "./InfrastructureClient";

export const metadata: Metadata = {
  title: "Infrastructure · Networks, Wi-Fi and business internet",
  description:
    "D’Matek Infrastructure designs, builds and operates networks, Wi-Fi, fibre and business internet for offices, estates and events.",
  alternates: { canonical: "/infrastructure" },
  openGraph: {
    title: "D’Matek Infrastructure · Connect it",
    description: "Networks, Wi-Fi, fibre and business internet for offices, estates and events. Designed, built and operated.",
  },
};

export default function InfrastructurePage() {
  return <InfrastructureClient />;
}
