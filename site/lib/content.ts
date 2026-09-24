// Central content/design-token data for the D'Matek site.
// Copy is taken verbatim from the approved Claude Design mockup
// (project/Dmatek Website v3.dc.html) — do not invent statistics,
// outcomes, quotes or client names here. Bracketed placeholders are
// intentional and must stay bracketed until real content is supplied.

export type NavKey = "home" | "approach" | "businesses" | "work" | "about";

export const navItems: { label: string; href: string; key: NavKey }[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "Approach", href: "/approach", key: "approach" },
  { label: "Businesses", href: "/businesses", key: "businesses" },
  { label: "Work", href: "/work", key: "work" },
  { label: "About", href: "/about", key: "about" },
];

export const tickerItems = ["TRUST", "SOLVE", "CONNECT", "IMPROVE", "WE STAY"];

export type Business = {
  slug: string;
  name: string;
  verb: string;
  prop?: string;
  solves: string;
  scope: string;
  note: string;
  photo: string;
  photoSrc?: string;
  stat: string;
  statLabel: string;
};

export const businesses: Business[] = [
  {
    slug: "infrastructure",
    name: "D’Matek Infrastructure",
    verb: "CONNECT IT",
    prop: "Infrastructure Doesn’t Happen by Accident.",
    solves: "When the network is the thing standing between people and their work.",
    scope:
      "Design, build and operation of connectivity and physical network infrastructure — structured cabling, wireless, links, power and the parts nobody sees.",
    note: "USUALLY THE FIRST DIVISION ON SITE",
    photo: "cabling or wireless install in progress",
    photoSrc: "/assets/stage-implement.jpg",
    stat: "35",
    statLabel: "Sites connected and still supported",
  },
  {
    slug: "cloud",
    name: "D’Matek Cloud",
    verb: "RUN IT",
    solves: "When data has to survive whatever happens next.",
    scope:
      "Cloud, servers, hosting, storage, backup and disaster recovery — sized for the business rather than the brochure.",
    note: "BACKUP TESTED, NOT ASSUMED",
    photo: "server room or a recovery test underway",
    photoSrc: "/assets/cloud-illustration.jpg",
    stat: "12",
    statLabel: "Workloads under managed recovery",
  },
  {
    slug: "foundry",
    name: "D’Foundry",
    verb: "BUILD IT",
    solves:
      "When the software you need doesn’t exist yet, or the ones you have won’t talk to each other.",
    scope:
      "Custom software, apps, automation, integrations, SaaS and digital products — including QADPAY.",
    note: "BUILT TO BE HANDED OVER CLEANLY",
    photo: "screens mid-build, a whiteboard, a real interface",
    photoSrc: "/assets/foundry-integrations.jpg",
    stat: "7",
    statLabel: "Products and integrations shipped",
  },
  {
    slug: "ilemesh",
    name: "IléMesh",
    verb: "SENSE IT",
    solves: "When a building should look after itself and the people in it.",
    scope:
      "Smart homes and buildings, IoT, CCTV, access control, hotel technology, building automation and connected facilities.",
    note: "STRONGEST IN PROPERTY AND HOSPITALITY",
    photo: "access control at a door, a hotel room panel",
    photoSrc: "/assets/ilemesh-smartlock.jpg",
    stat: "40",
    statLabel: "Buildings running on IléMesh",
  },
  {
    slug: "commerce",
    name: "D’Source",
    verb: "SUPPLY IT",
    solves: "When the right equipment has to arrive, correctly, on time.",
    scope:
      "Sourcing, supply, distribution and procurement — specified against the design, not the cheapest catalogue line. Matek Emporium for retail, Matek Provision for business.",
    note: "COMMERCE BY D’MATEK — EMPORIUM (RETAIL) · PROVISION (BUSINESS)",
    photo: "goods being checked in, kit staged for a job",
    photoSrc: "/assets/source-kit-staging.jpg",
    stat: "200",
    statLabel: "Orders fulfilled to specification",
  },
  {
    slug: "assurance",
    name: "D’Matek Assurance",
    verb: "OWN IT",
    solves: "When somebody needs to be responsible for all of it, permanently.",
    scope:
      "Managed technology, advisory, cybersecurity and ongoing operational responsibility for what we built.",
    note: "THIS IS WHY CUSTOMERS STAY TEN YEARS",
    photo: "a support conversation, a site visit, a review meeting",
    photoSrc: "/assets/assurance-support.jpg",
    stat: "24/7",
    statLabel: "Coverage on managed accounts",
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

export type Stage = {
  id: string;
  num: string;
  name: string;
  body: string;
  value: string;
  photo: string;
  photoSrc?: string;
  outcome: string;
};

export const stages: Stage[] = [
  {
    id: "understand",
    num: "01",
    name: "Understand",
    body: "We listen before we prescribe. What is actually going wrong, who it affects, and what has already been tried. Most briefs change shape in this conversation.",
    value: "TRUST",
    photo: "a planning meeting, notebooks out",
    photoSrc: "/assets/stage-understand.jpg",
    outcome: "The real problem, named.",
  },
  {
    id: "design",
    num: "02",
    name: "Design",
    body: "Around seventy percent of the work happens here, on paper. Options, trade-offs and costs in plain language, so the decision is yours and it is an informed one.",
    value: "SIMPLIFY",
    photo: "drawings, floor plans, a whiteboard",
    photoSrc: "/assets/stage-design.jpg",
    outcome: "70% of the work, before anything is bought.",
  },
  {
    id: "implement",
    num: "03",
    name: "Implement",
    body: "Installation, build and integration, coordinated across whichever of our businesses the job needs. One schedule, one point of contact, one accountable party.",
    value: "SOLVE",
    photo: "infrastructure work in progress on site",
    photoSrc: "/assets/stage-implement.jpg",
    outcome: "One team on site, not five vendors.",
  },
  {
    id: "operate",
    num: "04",
    name: "Operate",
    body: "We run it. Monitoring, maintenance, response and the small interventions that stop small things becoming outages.",
    value: "SUPPORT",
    photo: "monitoring screens, a site check",
    photoSrc: "/assets/stage-operate.jpg",
    outcome: "Problems handled before they’re noticed.",
  },
  {
    id: "optimise",
    num: "05",
    name: "Optimise",
    body: "Buildings change, businesses grow, requirements move. We revisit what we built and improve it rather than waiting for a replacement project.",
    value: "IMPROVE",
    photo: "a review session with a client",
    photoSrc: "/assets/stage-optimise.jpg",
    outcome: "Better in year three than year one.",
  },
  {
    id: "own",
    num: "06",
    name: "Own the result",
    body: "If it isn’t working, it’s ours to fix. Own it, fix it, learn from it — and stay long enough that the relationship outlasts the equipment.",
    value: "WE STAY",
    photo: "a long-standing client and the team together",
    photoSrc: "/assets/own-result.jpg",
    outcome: "Ten years and counting.",
  },
];

// The typical multi-division project path shown on the Businesses page —
// process stages, verbatim from the approved mockup.
export const pathSteps = [
  { step: "STEP 01", name: "Understand" },
  { step: "STEP 02", name: "Design" },
  { step: "STEP 03", name: "Supply" },
  { step: "STEP 04", name: "Implement" },
  { step: "STEP 05", name: "Operate" },
  { step: "STEP 06", name: "Own the result" },
];

export type CaseStudy = {
  id: string;
  sector: string;
  tenure: string;
  title: string;
  before: string;
  did: string;
  divisions: string;
  after: string;
  photo: string;
  photoSrc?: string;
  quote: string;
  attrib?: string;
};

export const cases: CaseStudy[] = [
  {
    id: "safwah",
    sector: "HOSPITALITY — LAGOS",
    tenure: "ONGOING MANAGED PARTNERSHIP",
    title: "A hotel opening with no working technology and six weeks on the clock.",
    before:
      "Guest WiFi, CCTV, access control and room systems had each been quoted separately by different suppliers. None of them matched, nothing was scheduled, and the opening date had already been announced.",
    did: "We took the whole scope, redesigned it as one system, and sequenced the install around the construction programme. One schedule, one contact, one accountable party.",
    divisions: "Infrastructure · IléMesh · Cloud · Assurance",
    after:
      "[ REAL OUTCOME TO BE ADDED — uptime, guest satisfaction, or cost against the original separate quotes. ]",
    photo: "Safwah Hotel: the comms room and a guest floor, before and after.",
    photoSrc: "/assets/safwah-hotel.jpg",
    quote: "The hotel opened on schedule, on one system, with one team responsible for all of it.",
  },
  {
    id: "estate",
    sector: "RESIDENTIAL ESTATE",
    tenure: "10-YEAR PARTNERSHIP",
    title: "An estate where security depended on whoever was awake at the gate.",
    before:
      "Cameras that recorded to a box nobody checked, no access records, and residents paying for a service that couldn’t answer a single question after an incident.",
    did: "Designed coverage around the actual movement of people and vehicles, then put the footage and access logs somewhere retrievable and backed up. Facility managers were trained on it, not just handed it.",
    divisions: "IléMesh · Infrastructure · Cloud · Assurance",
    after:
      "[ REAL OUTCOME TO BE ADDED — incident response time, resident satisfaction, or insurance position. ]",
    photo: "Gatehouse and perimeter, before and after.",
    photoSrc: "/assets/estate-street.jpg",
    quote: "Every camera has a purpose, every entry is logged, and the answers are always retrievable.",
  },
  {
    id: "commercial",
    sector: "COMMERCIAL PROPERTY",
    tenure: "5-YEAR PARTNERSHIP",
    title: "A building where every tenant complaint was somebody else’s problem.",
    before:
      "Shared connectivity nobody owned, three overlapping support contracts, and a landlord fielding calls they had no way to resolve.",
    did: "Consolidated the infrastructure, put tenant services on a managed platform, and took operational responsibility for the whole stack so the landlord had one number to call.",
    divisions: "Infrastructure · Cloud · Source · Assurance",
    after:
      "[ REAL OUTCOME TO BE ADDED — tenant retention, complaint volume, or operating cost. ]",
    photo: "Risers, tenant floor and the building entrance.",
    photoSrc: "/assets/commercial-tower.jpg",
    quote: "One number to call, one team responsible — and the complaints stopped being the landlord’s problem.",
  },
];

export const caseTeasers = cases.map((c) => ({
  id: c.id,
  sector: c.sector,
  title: c.title,
  problem: c.before.slice(0, 120) + "…",
  tenure: c.tenure,
}));

export const values = [
  {
    i: "01",
    name: "Trust",
    body: "We say what is true about cost, timeline and risk, including when it is inconvenient.",
  },
  {
    i: "02",
    name: "Solve",
    body: "The problem is ours until it is actually solved, not until the invoice clears.",
  },
  {
    i: "03",
    name: "Connect",
    body: "One relationship with us, however many specialists the job needs behind it.",
  },
  {
    i: "04",
    name: "Improve",
    body: "Leave people better than you found them. Own it, fix it, learn from it.",
  },
];

export const stats: { num: number; suffix: string; label: string }[] = [
  { num: 10, suffix: "+", label: "Years alongside our longest-standing customers" },
  { num: 70, suffix: "%", label: "Of the work done in design, before deployment" },
  { num: 6, suffix: "", label: "Specialist businesses, one relationship with you" },
  { num: 24, suffix: "/7", label: "Response on managed accounts" },
];

export const aboutStats = [
  { figure: "51", label: "Enterprise deployments" },
  { figure: "24/7", label: "Support, answered by people you know" },
  { figure: "10+", label: "Years in the game" },
];

export const quotes: {
  text: string;
  attrib: string;
  tone: "light" | "dark";
}[] = [
  {
    text: "“Our internet went down, and Dmatek came in, diagnosed the problem and found that the access point had failed. They replaced it and had us back online without the usual back-and-forth. It was a huge relief.”",
    attrib: "OAA, Admin Office, MaxiMedia Global",
    tone: "light",
  },
  {
    text: "“We didn’t have to explain the problem five times or keep calling for updates. They understood what was wrong, fixed it quickly, and kept us informed. That made a stressful situation surprisingly easy.”",
    attrib: "Amaka Eze, Operations Manager, Northbridge Consulting",
    tone: "dark",
  },
  {
    text: "“Dmatek is usually the first call we make when something isn’t working. They don’t just sell us another device or tell us what to buy — they help us figure out what the actual problem is.”",
    attrib: "Daniel Okoro, IT Manager, Westfield Properties",
    tone: "light",
  },
  {
    text: "“We’ve worked with Dmatek for years, through new equipment, network changes and the occasional problem we didn’t see coming. What keeps us coming back is simple: they stay involved after the sale.”",
    attrib: "AO, V & V",
    tone: "light",
  },
];

export const badges = [
  "24/7 support on managed accounts",
  "We respond within four hours",
  "Problem-solving starts here",
];

export const problemOptions = [
  "I’m not sure yet — help me figure it out",
  "Connectivity or network problems",
  "Servers, hosting, backup or recovery",
  "Software, apps or systems that don’t talk",
  "A building, hotel or estate to make smart",
  "Sourcing and supplying equipment",
  "Someone to manage and be responsible for all of it",
];
