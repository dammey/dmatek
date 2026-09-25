// Everything else: Home's ticker/problem-panel/hotel-capability copy, About's
// values, Work's case placeholders, Contact's badges/options, Insights topics.
// Copy verbatim from Dmatek Website v3.1.dc.html and docs/project/v3.1/README.md.

export const tickerItems = ["DISCOVER", "UNDERSTAND", "SOLVE", "DELIVER", "SUPPORT", "IMPROVE", "WE STAY"];

export const problemLines: { a: string; b: string }[] = [
  { a: "Connectivity", b: "productivity." },
  { a: "Security", b: "trust." },
  { a: "Power", b: "availability." },
  { a: "Software", b: "how work gets done." },
  { a: "Devices", b: "the people using them." },
];

export const hotelCaps = [
  "Connectivity and guest Wi-Fi",
  "Security and operations",
  "Guest room technology",
  "Power",
  "Conference technology",
  "Managed IT",
].map((name, i) => ({ n: String(i + 1).padStart(2, "0"), name }));

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
  quote: string;
  attrib: string;
};

export const cases: CaseStudy[] = [1, 2, 3].map((n) => ({
  id: "case-" + n,
  sector: "[ SECTOR ]",
  tenure: "DELIVERED WORK ONLY",
  title: "[ DELIVERED PROJECT " + n + " — TO BE CONFIRMED ]",
  before: "[ The problem, in the client’s words. ]",
  did: "[ What D’Matek did, and which specialists were involved. ]",
  divisions: "",
  after: "[ REAL OUTCOME TO BE ADDED ]",
  photo: "Before and after photos of the delivered work.",
  quote: "“[ CLIENT QUOTE — ONLY WITH PERMISSION ]”",
  attrib: "[ NAME, ROLE, ORGANISATION ]",
}));

export const caseTeasers = cases.map((c) => ({
  id: c.id,
  sector: c.sector,
  title: c.title,
  problem: c.before,
  tenure: c.tenure,
}));

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
