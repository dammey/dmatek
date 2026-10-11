// Nav and sister-site links. Copy is verbatim from docs/project/v3.4/README.md
// and Dmatek Website v3.4.dc.html — do not rewrite. (The shared pilot-programme
// note now lives in @dmatek/brand, since D'Source uses it too.)

// Insights stays hidden until 3+ posts exist (handoff v3.6 §Routing).
export type NavKey = "solutions" | "businesses" | "work" | "about";

export const navItems: { label: string; href: string; key: NavKey }[] = [
  { label: "Solutions", href: "/solutions", key: "solutions" },
  { label: "Businesses", href: "/businesses", key: "businesses" },
  { label: "Work", href: "/work", key: "work" },
  { label: "About", href: "/about", key: "about" },
];

// Sister D'Matek sites/anchors that live outside (or partly outside) this app.
// NEXT_PUBLIC_SOURCE_URL / NEXT_PUBLIC_FOUNDRY_URL are the handoff's names;
// the older NEXT_PUBLIC_DSOURCE_URL / NEXT_PUBLIC_DFOUNDRY_URL still work.
export const D_SOURCE_URL = process.env.NEXT_PUBLIC_SOURCE_URL ?? process.env.NEXT_PUBLIC_DSOURCE_URL ?? "https://source.dmatek.ng";
export const D_FOUNDRY_URL = process.env.NEXT_PUBLIC_FOUNDRY_URL ?? process.env.NEXT_PUBLIC_DFOUNDRY_URL ?? "https://foundry.dmatek.ng";
export const ILEMESH_HREF = "/businesses#ilemesh";
