// Nav and sister-site links. Copy is verbatim from docs/project/v3.1/README.md
// and Dmatek Website v3.1.dc.html — do not rewrite. (The shared pilot-programme
// note now lives in @dmatek/brand, since D'Source uses it too.)

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
