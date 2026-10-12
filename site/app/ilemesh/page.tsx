import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import IleMeshClient from "./IleMeshClient";

export const metadata: Metadata = pageMeta({
  title: "IléMesh · Smart, connected systems for real places",
  description: "IléMesh plans and installs CCTV, door access, building sensors, hotel room technology, screens and sound, and backup power for hotels, estates, schools and offices.",
  path: "/ilemesh",
  ogTitle: "IléMesh · Physical world",
  image: "/assets/photos/smart-lock.jpg",
});

export default function IleMeshPage() {
  return <IleMeshClient />;
}
