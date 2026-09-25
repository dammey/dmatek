// Nav, sister-site links, and the shared pilot-programme note.
// Copy is verbatim from docs/project/v3.1/README.md and Dmatek Website v3.1.dc.html — do not rewrite.

export type NavKey = "solutions" | "businesses" | "work" | "about" | "insights";

export const navItems: { label: string; href: string; key: NavKey }[] = [
  { label: "Solutions", href: "/solutions", key: "solutions" },
  { label: "Businesses", href: "/businesses", key: "businesses" },
  { label: "Work", href: "/work", key: "work" },
  { label: "About", href: "/about", key: "about" },
  { label: "Insights", href: "/insights", key: "insights" },
];

// Sister D'Matek sites/anchors that live outside (or partly outside) this app.
export const D_SOURCE_URL = process.env.NEXT_PUBLIC_DSOURCE_URL ?? "/businesses#source";
export const D_FOUNDRY_URL = process.env.NEXT_PUBLIC_DFOUNDRY_URL ?? "https://dfoundry-dammey-s-projects.vercel.app";
export const ILEMESH_HREF = "/businesses#ilemesh";

export const pilotNote =
  "Available as a pilot. We’re rolling this out with a small number of early customers. If it fits what you need, talk to us about joining the pilot.";
