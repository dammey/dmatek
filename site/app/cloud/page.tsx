import type { Metadata } from "next";
import CloudClient from "./CloudClient";

export const metadata: Metadata = {
  title: "Cloud · Email, hosting, backup and servers",
  description:
    "D’Matek Cloud sets up and runs business email, websites and hosting, servers, cloud platforms, backup and recovery, so your digital environment is looked after.",
  alternates: { canonical: "/cloud" },
  openGraph: {
    title: "D’Matek Cloud · Run it",
    description: "Your email, websites and data, looked after. Servers, cloud, hosting, email, domains and DNS, set up and run for you.",
  },
};

export default function CloudPage() {
  return <CloudClient />;
}
