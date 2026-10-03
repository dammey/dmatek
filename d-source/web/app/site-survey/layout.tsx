import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Site Survey",
  description: "We survey the site before we specify anything, so what you buy fits the building. Site surveys are free.",
};

export default function SiteSurveyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
