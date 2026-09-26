// The six specialist businesses — Home orbit + Businesses accordion.
// Copy verbatim from Dmatek Website v3.4.dc.html (const bizData).

import { D_FOUNDRY_URL, D_SOURCE_URL } from "./navigation";

export type Business = {
  id: string;
  name: string;
  verb: string;
  prop: string;
  solves: string;
  scope: string;
  note: string;
  pilot: string;
  photo: string;
  site?: string;
  siteLabel?: string;
  /** Optional per v3.4 photography — omit until a rights-cleared photo exists; falls back to the bracketed placeholder. */
  img?: string;
};

export const businesses: Business[] = [
  {
    id: "infrastructure",
    name: "D’Matek Infrastructure",
    verb: "CONNECT IT",
    prop: "Connectivity designed around how you work.",
    solves: "When the network is the thing standing between people and their work.",
    scope:
      "Network design and deployment · enterprise and guest Wi-Fi · internet with backup links and failover · fibre and structured cabling · ISP-ready estate fibre · event connectivity · managed networks · Wi-Fi-as-a-Service · power protection for IT (UPS, surge, earthing).",
    note: "NETWORKS · FIBRE · WI-FI · INTERNET",
    pilot: "",
    photo: "cabling or wireless install in progress",
    img: "/assets/stage-implement.jpg",
  },
  {
    id: "cloud",
    name: "D’Matek Cloud",
    verb: "RUN IT",
    prop: "A digital workplace your people can rely on.",
    solves: "When email, files, sign-in and backup have to just work.",
    scope: "Microsoft 365, Google Workspace and Zoho · identity, MFA and SSO · business email and email security · hosting and website care · verified backup and recovery.",
    note: "EMAIL · IDENTITY · HOSTING · BACKUP",
    pilot: "",
    photo: "a migration or a restore test underway",
    img: "/assets/cloud-illustration.jpg",
  },
  {
    id: "foundry",
    name: "D’Foundry",
    verb: "BUILD IT",
    prop: "Software built around the problem.",
    solves: "When the software you need doesn’t exist yet, or the ones you have won’t talk to each other.",
    scope: "Custom software and products · business systems, integrations and automation · websites.",
    note: "SOFTWARE · INTEGRATIONS · AUTOMATION",
    pilot: "Customer messaging and WhatsApp automation · Guest access and billing platform",
    photo: "screens mid-build, a real interface",
    img: "/assets/foundry-integrations.jpg",
    site: D_FOUNDRY_URL,
    siteLabel: "Explore D’Foundry ↗",
  },
  {
    id: "ilemesh",
    name: "IléMesh",
    verb: "PHYSICAL WORLD",
    prop: "Smart and connected systems for real places.",
    solves: "When a building, estate or room should look after itself and the people in it.",
    scope:
      "CCTV, access control and visitor management · security system care · power continuity (solar, inverter, generator, UPS design) · meeting rooms and AV · building automation and sensors · guest room technology · smart classrooms · worship and event AV.",
    note: "STANDALONE SITE COMING · SUBDOMAIN TO CONFIRM",
    pilot: "Fuel and generator monitoring · Cold chain monitoring · Estate utilities monitoring",
    photo: "access control at a door, a hotel room panel",
    img: "/assets/ilemesh-smartlock.jpg",
  },
  {
    id: "source",
    name: "D’Source",
    verb: "SOURCE IT",
    prop: "Commerce by D’Matek.",
    solves: "When the right equipment has to arrive, genuine and set up.",
    scope: "D’Emporium (retail and consumer technology) · D’Provision (business procurement) · device lifecycle · Office in a Box.",
    note: "D’EMPORIUM · D’PROVISION",
    pilot: "Device care plan",
    photo: "kit checked in and staged for a job",
    img: "/assets/source-kit-staging.jpg",
    site: D_SOURCE_URL,
    siteLabel: "Shop D’Source ↗",
  },
  {
    id: "assurance",
    name: "D’Matek Assurance",
    verb: "MANAGE IT",
    prop: "We keep it running, secure and improving.",
    solves: "When somebody needs to be responsible for all of it.",
    scope: "Managed IT and helpdesk · Technology Health Check · cyber protection (assessment, hardening, identity controls, firewall policy) · IT strategy and vCIO.",
    note: "MANAGED IT · CYBERSECURITY · RESILIENCE",
    pilot: "NDPA readiness and DPO service · ISO / CBN compliance · Security awareness training · Incident response retainer · D’Matek Insight · AI readiness",
    photo: "a support conversation, a review meeting",
    img: "/assets/assurance-support.jpg",
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
