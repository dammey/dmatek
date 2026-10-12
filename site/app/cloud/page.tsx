import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import CloudClient from "./CloudClient";

export const metadata: Metadata = pageMeta({
  title: "Cloud · Email, hosting, backup and servers",
  description: "D’Matek Cloud sets up and runs business email, websites and hosting, servers, cloud platforms, backup and recovery, so your digital environment is looked after.",
  path: "/cloud",
  ogTitle: "D’Matek Cloud · Run it",
  image: "/assets/photos/planning.jpg",
});

export default function CloudPage() {
  return <CloudClient />;
}
