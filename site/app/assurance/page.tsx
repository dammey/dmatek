import type { Metadata } from "next";
import AssuranceClient from "./AssuranceClient";

export const metadata: Metadata = {
  title: "Assurance · Managed IT, security and IT direction",
  description:
    "D’Matek Assurance keeps your IT running, secure and improving: managed IT and helpdesk, security checks and fixes, IT strategy, policies and continuity planning.",
  alternates: { canonical: "/assurance" },
  openGraph: {
    title: "D’Matek Assurance · Manage it",
    description: "We keep your IT running, secure and improving. Request a Technology Health Check.",
  },
};

export default function AssurancePage() {
  return <AssuranceClient />;
}
