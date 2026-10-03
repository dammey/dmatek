import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Office in a Box",
  description:
    "A new office on day one. Devices, office network, internet with backup, domain, email and files, a website, and MFA and backup — set up before anyone shows up.",
};

export default function OfficeInABoxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
