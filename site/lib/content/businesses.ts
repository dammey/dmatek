// The six specialists — Home orbit, Services relationship diagram, footer and
// "Six specialists. Try one." Copy verbatim from Dmatek Website v3.6.dc.html
// (const bizData and BW). The "How it works with the others" lines (works)
// are awaiting D'Matek sign-off (handoff v3.6 §9).

import { D_FOUNDRY_URL, D_SOURCE_URL } from "./navigation";

export type Business = {
  id: "infrastructure" | "cloud" | "foundry" | "ilemesh" | "source" | "assurance";
  name: string;
  /** Name without the "D’Matek " prefix (orbit, tiles). */
  short: string;
  verb: string;
  /** Role line in the profile. */
  prop: string;
  solves: string;
  /** Short role shown on the diagram tile. */
  tag: string;
  /** How it works with the other specialists (awaiting sign-off). */
  works: string;
  /** Profile chips, "AVAILABLE NOW". */
  items: string[];
  /** The business's own page: a route on this site or its own subdomain. */
  site: string;
  external: boolean;
  siteLabel: string;
  ctaLabel: string;
  img: string;
};

export const businesses: Business[] = [
  {
    id: "infrastructure",
    name: "D’Matek Infrastructure",
    short: "Infrastructure",
    verb: "CONNECT IT",
    prop: "You shouldn’t have to work around your network. We provide reliable connectivity that works around your business, your people and the way you work.",
    solves: "Reliable internet, Wi-Fi and network infrastructure for businesses, schools, properties, events and homes.",
    tag: "Networks and connectivity",
    works: "Works with Cloud on internet and hosting, IléMesh on CCTV and access, and Assurance for support after handover.",
    items: ["Network Design & Deployment", "Enterprise & Guest Wi-Fi", "Internet with Backup Links & Failover", "Fibre & Structured Cabling", "ISP-Ready Estate Fibre", "Event Connectivity", "Managed Networks", "Wi-Fi-as-a-Service", "IT Power Protection (UPS, Surge & Earthing)"],
    site: "/infrastructure",
    external: false,
    siteLabel: "Explore D’Matek Infrastructure →",
    ctaLabel: "Get connected today →",
    img: "/assets/photos/cabling-site.jpg",
  },
  {
    id: "cloud",
    name: "D’Matek Cloud",
    short: "Cloud",
    verb: "RUN IT",
    prop: "Professional digital tools that keep your business secure and working.",
    solves: "Your business deserves professional email, secure information and control over its digital tools.",
    tag: "Cloud and business infrastructure",
    works: "Works with Infrastructure on connectivity, D’Source on licences, D’Foundry to host the applications it builds, and Assurance on security.",
    items: ["Business Email", "Company Files & Cloud Storage", "Account & Access Management", "Email Security", "Website Hosting & Maintenance", "Backup & Recovery"],
    site: "/cloud",
    external: false,
    siteLabel: "Enter D’Matek Cloud →",
    ctaLabel: "Get started now →",
    img: "/assets/photos/support.jpg",
  },
  {
    id: "foundry",
    name: "D’Foundry",
    short: "D’Foundry",
    verb: "BUILD IT",
    prop: "Software built around the problem.",
    solves: "When the software you need doesn’t exist yet, or the ones you have won’t talk to each other.",
    tag: "Software and integration",
    works: "Works with Cloud to host what it builds, Infrastructure and IléMesh to connect to real systems, and Assurance to support it.",
    items: ["Custom software and products", "business systems, integrations and automation", "websites"],
    site: D_FOUNDRY_URL,
    external: true,
    siteLabel: "Explore D’Foundry ↗",
    ctaLabel: "Get started now →",
    img: "/assets/photos/foundry.jpg",
  },
  {
    id: "ilemesh",
    name: "IléMesh",
    short: "IléMesh",
    verb: "PHYSICAL WORLD",
    prop: "Smart and connected systems for real places.",
    solves: "When a building, estate or room should look after itself and the people in it.",
    tag: "Connected physical environments",
    works: "Works with Infrastructure for the network, D’Source for equipment, Cloud for recordings and backup, and Assurance for system care.",
    items: ["CCTV, access control and visitor management", "security system care", "power continuity (solar, inverter, generator, UPS design)", "meeting rooms and AV", "building automation and sensors", "guest room technology", "smart classrooms", "worship and event AV"],
    site: "/ilemesh",
    external: false,
    siteLabel: "Explore IléMesh →",
    ctaLabel: "Get started now →",
    img: "/assets/photos/smart-lock.jpg",
  },
  {
    id: "source",
    name: "D’Source",
    short: "D’Source",
    verb: "SOURCE IT",
    prop: "Commerce by D’Matek.",
    solves: "When the right equipment has to arrive, genuine and set up.",
    tag: "Technology sourcing and equipment",
    works: "Supplies genuine equipment, devices and licences to every other specialist, then sets them up for you.",
    items: ["D’Emporium (retail and consumer technology)", "D’Provision (business procurement)", "device lifecycle", "Office in a Box"],
    site: D_SOURCE_URL,
    external: true,
    siteLabel: "Shop D’Source ↗",
    ctaLabel: "Get started now →",
    img: "/assets/photos/source-kit.jpg",
  },
  {
    id: "assurance",
    name: "D’Matek Assurance",
    short: "Assurance",
    verb: "MANAGE IT",
    prop: "We keep it running, secure and improving.",
    solves: "When somebody needs to be responsible for all of it.",
    tag: "Support and maintenance",
    works: "Looks after what the other specialists put in place once it is live, and keeps it secure and improving.",
    items: ["Managed IT and helpdesk", "Technology Health Check", "cyber protection (assessment, hardening, identity controls, firewall policy)", "IT strategy and vCIO"],
    site: "/assurance",
    external: false,
    siteLabel: "Explore D’Matek Assurance →",
    ctaLabel: "Get started now →",
    img: "/assets/photos/planning.jpg",
  },
];

// Six positions around the home-page orbit ring.
export const orbitPositions: [string, string][] = [
  ["50%", "17%"],
  ["78%", "33.5%"],
  ["78%", "66.5%"],
  ["50%", "83%"],
  ["22%", "66.5%"],
  ["22%", "33.5%"],
];

/** Home "Six specialists. Try one." — each opens that business's demo. */
export const tryTiles: { label: string; title: string; href: string; track: string }[] = [
  { label: "INFRASTRUCTURE", title: "Untangle the cables", href: "/infrastructure", track: "try_infrastructure" },
  { label: "CLOUD", title: "Lose a file. Get it back.", href: "/cloud", track: "try_cloud" },
  { label: "ILÉMESH", title: "The hotel at night", href: "/ilemesh", track: "try_ilmesh" },
  { label: "ASSURANCE", title: "One night, someone watching", href: "/assurance", track: "try_assurance" },
  { label: "D’FOUNDRY", title: "Watch it get built", href: D_FOUNDRY_URL, track: "try_dfoundry" },
  { label: "D’SOURCE", title: "Checked, genuine, set up", href: D_SOURCE_URL, track: "try_dsource" },
];
