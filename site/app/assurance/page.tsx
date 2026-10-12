import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import AssuranceClient from "./AssuranceClient";

export const metadata: Metadata = pageMeta({
  title: "Assurance · Managed IT, security and IT direction",
  description: "D’Matek Assurance keeps your IT running, secure and improving: managed IT and helpdesk, security checks and fixes, IT strategy, policies and continuity planning.",
  path: "/assurance",
  ogTitle: "D’Matek Assurance · Manage it",
  image: "/assets/photos/support.jpg",
});

export default function AssurancePage() {
  return <AssuranceClient />;
}
