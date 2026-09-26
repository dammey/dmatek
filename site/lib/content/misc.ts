// Everything else: Home's ticker/problem-panel/hotel-capability copy, About's
// values, Work's case placeholders, Contact's badges/options, Insights topics.
// Copy verbatim from Dmatek Website v3.4.dc.html and docs/project/v3.4/README.md.

export const tickerItems = ["DISCOVER", "UNDERSTAND", "SOLVE", "DELIVER", "SUPPORT", "IMPROVE", "WE STAY"];

export const problemLines: { a: string; b: string }[] = [
  { a: "Connectivity", b: "productivity." },
  { a: "Security", b: "trust." },
  { a: "Power", b: "availability." },
  { a: "Software", b: "how work gets done." },
  { a: "Devices", b: "the people using them." },
];

export const hotelCaps = [
  ["Connectivity and guest Wi-Fi", "INFRASTRUCTURE"],
  ["Security and operations", "ILÉMESH"],
  ["Guest room technology", "ILÉMESH"],
  ["Power", "ILÉMESH"],
  ["Conference technology", "ILÉMESH"],
  ["Managed IT", "ASSURANCE"],
].map(([name, spec], i) => ({ n: String(i + 1).padStart(2, "0"), name, spec }));

export const stayWords = ["Support.", "Management.", "Improvement.", "Problem-solving."];

export const values = [
  { i: "01", name: "Trust", body: "We say what is true about cost, timeline and risk, including when it is inconvenient." },
  { i: "02", name: "Solve", body: "The problem is ours until it is actually solved, not until the invoice clears." },
  { i: "03", name: "Connect", body: "One relationship with us, however many specialists the job needs behind it." },
  { i: "04", name: "Improve", body: "Leave people better than you found them. Own it, fix it, learn from it." },
];

export const insightTopics = ["Connectivity", "Security", "Power", "Operations", "Data and AI"];

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

// Real, delivered work the client previously supplied and approved. The
// "after" figures were never supplied, so those stay bracketed — everything
// else here is genuine, not invented.
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
    divisions: "Infrastructure · Cloud · D’Source · Assurance",
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
  problem: c.before,
  tenure: c.tenure,
}));

// Real client testimonials, previously supplied and approved by the client.
// Not part of the v3.4 mockup's About section, but real content is never
// left unused — shown in a new "Why clients stick around" panel on About.
export const quotes: { text: string; attrib: string; tone: "light" | "dark" }[] = [
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

export const badges = ["Tell us in your own words", "No technical knowledge needed", "One team from the first conversation"];

export const orgOptions = [
  "Business or office",
  "Estate or developer",
  "Hotel or hospitality",
  "School",
  "Retail",
  "Clinic",
  "Worship centre",
  "Event or venue",
  "Building owner or facility manager",
  "Home",
  "Other",
];

export const NOT_SURE_OPTION = "I’m not sure yet — help me figure it out";
