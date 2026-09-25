// D'Foundry content — carried over verbatim from the Claude Design handoff
// (design_handoff_dmatek_website/DFoundry Hero.dc.html and Droplet Case Study.dc.html).
// Bracketed strings are intentional placeholders awaiting real client data.

export const DMATEK_URL = process.env.NEXT_PUBLIC_DMATEK_URL ?? "https://dmatek-website.vercel.app";

export type Problem = {
  text: string;
  plan: { step: string; title: string; body: string }[];
};

export const problems: Problem[] = [
  {
    text: "A core process still runs on paper and three spreadsheets.",
    plan: [
      { step: "01 DIAGNOSE", title: "Map the paperwork", body: "Who touches each sheet, and when." },
      { step: "02 BUILD", title: "One web app", body: "Roles, approvals and an audit trail." },
      { step: "03 SHIP", title: "Pilot with one team", body: "Rollout after two weeks of real use." },
      { step: "04 RUN", title: "Hosted and supported", body: "On D’Matek Cloud, backed up." },
    ],
  },
  {
    text: "Two systems we rely on refuse to talk to each other.",
    plan: [
      { step: "01 DIAGNOSE", title: "Map the re-keying", body: "Who copies what between systems." },
      { step: "02 BUILD", title: "One integration", body: "Data moves once, validated." },
      { step: "03 SHIP", title: "Shadow mode", body: "Runs beside the manual process until it matches." },
      { step: "04 RUN", title: "Monitored", body: "Failures alert a person, not a log file." },
    ],
  },
  {
    text: "We have an idea that needs to become a real product.",
    plan: [
      { step: "01 DIAGNOSE", title: "Find the core", body: "Who pays, for what, and how often." },
      { step: "02 BUILD", title: "The first version", body: "Web and mobile, payments, admin." },
      { step: "03 SHIP", title: "First customers", body: "Measure, fix, repeat." },
      { step: "04 GROW", title: "Into a product", body: "Project, then reusable solution, then product." },
    ],
  },
];

export const services = [
  "Custom software development",
  "Web development and web applications",
  "Business application development",
  "System integration",
  "Automation and integration work",
  "Digital solution development",
  "QADPAY: D’Matek-owned fintech venture",
];

export const stages = [
  { num: "1", n: "CUSTOMER PROJECT", title: "Solve it for one client", body: "Built around a specific problem, with the people who live with it every day." },
  { num: "2", n: "REUSABLE SOLUTION", title: "Keep what repeats", body: "The parts every client needs become platforms we maintain and reuse." },
  { num: "3", n: "PRODUCT", title: "Ship it to many", body: "Some platforms become products of their own, like QADPAY and Droplet." },
];

export const dropletFeats = [
  { n: "01", title: "Reorder in one tap", body: "Spots when a customer is running low from their order history, and offers their usual." },
  { n: "02", title: "Subscriptions", body: "Scheduled deliveries that keep coming without a new order." },
  { n: "03", title: "Recycling for points", body: "Customers book a pickup for their empties by material and earn points for it." },
];

export const inProgressCases = [
  { client: "Omatek", body: "Website revamp, with company email on D’Matek Cloud." },
  { client: "Valour and Valiant", body: "New website, with business email on D’Matek Cloud." },
];

export const sisters = [
  { verb: "RUN IT", name: "D’Matek Cloud", href: `${DMATEK_URL}/businesses` },
  { verb: "CONNECT IT", name: "D’Matek Infrastructure", href: `${DMATEK_URL}/businesses` },
];

export const DROPLET_URL = "https://web-gamma-fawn-29.vercel.app/";

export const dropletProcess = [
  { key: "diagnose", label: "01 DIAGNOSE", title: "[What we mapped]", body: "[Who we spoke to, what we learned about how orders really flowed.]", meta: "[0 WEEKS]", bg: "bg-cream", ink: "text-forest", metaColor: "" },
  { key: "build", label: "02 BUILD", title: "[The first version]", body: "[What went into v1: web app, payments, admin, driver view.]", meta: "[0 WEEKS]", bg: "bg-gold", ink: "text-forest", metaColor: "" },
  { key: "ship", label: "03 SHIP", title: "[The pilot]", body: "[Where it launched first, what changed after real use.]", meta: "[0 WEEKS]", bg: "bg-midgreen", ink: "text-cream", metaColor: "" },
  { key: "run", label: "04 RUN", title: "Hosted and supported", body: "On D’Matek Cloud, backed up and monitored. [Anything added since launch.]", meta: "ONGOING", bg: "bg-casedark", ink: "text-cream", metaColor: "text-gold" },
];

export const dropletResults = [
  { value: "00%", label: "of orders are reorders from the one-tap prompt" },
  { value: "0,000", label: "customers ordering in the app" },
  { value: "000", label: "active delivery subscriptions" },
  { value: "0,000kg", label: "of bottles collected through recycling pickups" },
];
