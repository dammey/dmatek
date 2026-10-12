import type { Metadata } from "next";
import IleMeshClient from "./IleMeshClient";

export const metadata: Metadata = {
  title: "IléMesh · Smart, connected systems for real places",
  description:
    "IléMesh plans and installs CCTV, door access, building sensors, hotel room technology, screens and sound, and backup power for hotels, estates, schools and offices.",
  alternates: { canonical: "/ilemesh" },
  openGraph: {
    title: "IléMesh · Physical world",
    description: "Smart, connected systems for real places: security, entry, rooms, screens and backup power, planned together.",
  },
};

export default function IleMeshPage() {
  return <IleMeshClient />;
}
