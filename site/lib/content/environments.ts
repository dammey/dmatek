// The 10 environments, rendered by the single EnvironmentPage template at
// /solutions/[env]. Copy verbatim from Dmatek Website v3.4.dc.html (const ENV, PKG).

export type Environment = {
  id: string;
  name: string;
  sol: string;
  headline: string;
  support: string;
  problems: string[];
  now: string[];
  pilot: string[];
  pkgs: string[];
  cta: string;
  photo: string;
  /** Optional per v3.4 photography — omit until a rights-cleared photo exists; falls back to the bracketed placeholder. */
  img?: string;
};

export const environments: Environment[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    sol: "CONNECTED ESTATE",
    headline: "Estates built connected and secure.",
    support: "ISP-ready fibre to every home, and security from the gate, designed in before the first resident moves in.",
    problems: [
      "Every new ISP digs up the estate and damages finishes.",
      "Gates run on notebooks, so incidents have no evidence.",
      "Pumps, gates and common areas fail when power does.",
    ],
    now: [
      "ISP-ready estate fibre infrastructure",
      "Estate gate and perimeter security (CCTV, number-plate recognition, access control, visitor codes, intercom)",
      "Common-area power",
      "Estate technology management",
    ],
    pilot: ["Internet-Ready Homes", "Estate utilities monitoring", "Automated gates, barriers and remote video monitoring"],
    pkgs: ["Connected Estate Essentials"],
    cta: "Plan my estate",
    photo: "An estate gatehouse, or fibre being laid before finishes.",
  },
  {
    id: "enterprise",
    name: "Enterprise & Corporate",
    sol: "CONNECTED WORKPLACE",
    headline: "One accountable partner for your whole technology environment.",
    support: "Connectivity, workplace platforms, devices, security, backup and meeting spaces, run under one relationship.",
    problems: [
      "Too many vendors and nobody accountable.",
      "Security gaps nobody has measured.",
      "Staff losing hours to slow devices and bad meetings.",
    ],
    now: [
      "Multi-site networks",
      "Microsoft 365 / Google Workspace / Zoho with identity and MFA",
      "Device lifecycle",
      "Cyber protection and email security",
      "Verified backup",
      "Meeting spaces",
      "Managed IT and vCIO",
      "Integration, automation and software",
    ],
    pilot: ["Governance, risk and compliance (ISO 27001, CBN)", "Endpoint detection and security monitoring", "Executive dashboards (D’Matek Insight)", "AI readiness"],
    pkgs: ["Connected Workplace Essentials", "Secure Workplace"],
    cta: "Plan my workplace",
    photo: "An office floor, a meeting room in use.",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    sol: "CONNECTED HOTEL",
    headline: "Hotels where guests stay connected, rooms run efficiently and the property stays secure.",
    support: "From guest Wi-Fi to room keys, power and security, designed as one hotel environment and looked after once it is live.",
    problems: [
      "Guests judge you by the Wi-Fi.",
      "Rooms are cooled and lit while empty.",
      "Nobody can see what’s happening in public areas or stores.",
    ],
    now: [
      "Hotel connectivity and guest Wi-Fi",
      "Security and operations (including people counting and queues)",
      "Guest room technology (key cards, room power, IPTV, elevator access)",
      "Hotel power",
      "Conference and banqueting technology",
      "Hotel IT management and backup",
    ],
    pilot: ["Guest messaging", "Diesel and generator monitoring", "Guest data compliance"],
    pkgs: ["Connected Hotel Essentials"],
    cta: "Plan a hotel project",
    photo: "A hotel corridor, a guest room door panel.",
  },
  {
    id: "education",
    name: "Education",
    sol: "CONNECTED SCHOOL",
    headline: "Reliable, safe campuses where technology helps teachers teach.",
    support: "Campus Wi-Fi with safe internet, classrooms that work, devices ready for every lesson, and a campus you can secure.",
    problems: [
      "Wi-Fi fails in classrooms and labs.",
      "No record of who is on campus or who collected a child.",
      "Nobody in-house to fix IT when term starts.",
    ],
    now: [
      "Campus connectivity and safe internet",
      "Smart classrooms",
      "Computer labs and devices",
      "Campus safety (CCTV, access, visitor and collection records)",
      "Campus power",
      "Managed campus IT",
    ],
    pilot: ["Children’s data protection (NDPA)", "Attendance systems"],
    pkgs: ["Connected School Essentials"],
    cta: "Plan my school",
    photo: "A classroom in use, a school gate at pick-up.",
  },
  {
    id: "retail",
    name: "Retail",
    sol: "CONNECTED RETAIL",
    headline: "Stores that keep trading, protect stock and know their busy hours.",
    support: "Payments that don’t stop when the internet does, cameras that deter loss and show footfall, and IT that keeps tills running.",
    problems: [
      "When the internet drops, card payments stop.",
      "Shrinkage nobody can explain.",
      "No idea when the store is busiest.",
    ],
    now: [
      "Store connectivity and payment uptime",
      "Loss prevention and store security (including footfall and peak-time analytics)",
      "Store power",
      "Store IT management",
    ],
    pilot: ["POS and inventory", "Conversion analytics (footfall + sales)", "Customer messaging", "Cold chain monitoring"],
    pkgs: ["Connected Retail Essentials"],
    cta: "Improve my stores",
    photo: "A store floor at a busy hour, a till point.",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    sol: "CONNECTED CLINIC",
    headline: "Clinics where the network, power and systems don’t fail during care.",
    support: "A segmented, reliable network, protected power, controlled access to pharmacy and records, and IT that’s supported and backed up.",
    problems: [
      "Outages interrupt care.",
      "Pharmacy and records rooms aren’t controlled.",
      "IT failures during clinic hours with nobody to call.",
    ],
    now: ["Clinical network and connectivity", "Clinical power", "Clinic security and access", "Clinical IT management and backup"],
    pilot: ["Patient data protection (NDPA)", "Cold chain and critical environment monitoring", "Patient calls and messaging"],
    pkgs: ["Connected Clinic Essentials"],
    cta: "Plan a clinic",
    photo: "A clinic reception, a controlled pharmacy door.",
  },
  {
    id: "worship",
    name: "Worship",
    sol: "CONNECTED WORSHIP CENTRE",
    headline: "Services that sound right, look right and run on time, every week.",
    support: "Sound, screens and cameras that work for the auditorium and your online members, with safety, power and support behind them.",
    problems: [
      "Sound and screens fail mid-service.",
      "Volunteers fighting the technology.",
      "Large crowds with little visibility.",
    ],
    now: ["Worship AV and media (sound, screens, cameras)", "Connectivity for services and online members", "Safety and crowd management", "Worship power", "Media team support"],
    pilot: ["Attendance and engagement insight"],
    pkgs: ["Connected Worship Essentials"],
    cta: "Plan our technology",
    photo: "An auditorium during a service, the media desk.",
  },
  {
    id: "events",
    name: "Events",
    sol: "CONNECTED EVENT",
    headline: "Events where the Wi-Fi holds, the stage works and sponsors see the numbers.",
    support: "High-density connectivity with a post-event report as standard, professional AV, and power for every piece of kit.",
    problems: [
      "Wi-Fi collapses at the keynote.",
      "Presentations and sound fail on the day.",
      "No evidence for sponsors afterwards.",
    ],
    now: ["Event connectivity with a post-event report", "Event AV and media", "Event power"],
    pilot: [],
    pkgs: ["Connected Event Essentials"],
    cta: "Plan an event",
    photo: "A full hall mid-keynote, the stage from the back.",
  },
  {
    id: "smart-buildings",
    name: "Smart Buildings",
    sol: "SMART BUILDING",
    headline: "Buildings that are secure, powered and easier to run.",
    support: "A segmented building network, controlled access, reliable power, working meeting rooms, and building systems that flag problems early.",
    problems: [
      "Faults found by complaint.",
      "Energy and diesel costs nobody can explain.",
      "Visitors and contractors uncontrolled.",
    ],
    now: [
      "Building network and tenant connectivity",
      "Building security and access",
      "Building power",
      "Building automation and environment (sensors, monitoring, BMS integration)",
      "Meeting and workplace technology",
      "Building technology management",
    ],
    pilot: ["Fuel, generator and energy monitoring", "Building insight"],
    pkgs: ["Smart Building Essentials"],
    cta: "Modernise my building",
    photo: "A building lobby with access gates, a plant room.",
  },
  {
    id: "home",
    name: "At Home",
    sol: "AT HOME",
    headline: "Devices, power and security for your home, handled.",
    support: "Genuine devices set up properly, power that stays on, and a home you can see and secure.",
    problems: [
      "Fake or wrong devices, and no honest repair.",
      "Outages stop work from home.",
      "You can’t see your home when you’re away.",
    ],
    now: ["Personal devices and care", "Home power", "Home security and smart home"],
    pilot: ["Home internet and Wi-Fi", "Device care plan", "Building a home? Internet-Ready Homes"],
    pkgs: ["Home Essentials"],
    cta: "Tell us what you need",
    photo: "A home office, a front gate camera.",
  },
];

export const packages: Record<string, { included: string; forWhom: string }> = {
  "Office in a Box": {
    included: "Devices, office network and internet with backup, domain, email and files, website, MFA and backup, set up and documented",
    forWhom: "New businesses",
  },
  "Connected Workplace Essentials": {
    included: "Technology Health Check, managed connectivity, digital workplace and identity, managed IT",
    forWhom: "Organisations needing a dependable baseline",
  },
  "Secure Workplace": {
    included: "Connected Workplace Essentials + cyber protection, email security, verified backup",
    forWhom: "Organisations exposed to security or fraud risk",
  },
  "Connected Estate Essentials": {
    included: "ISP-ready estate fibre, estate gate and perimeter security, common-area power, managed estate technology",
    forWhom: "Developers and estate operators",
  },
  "Connected Hotel Essentials": {
    included: "Connectivity and guest Wi-Fi, security and operations, guest room technology, power, conference technology, managed IT",
    forWhom: "Hotels, serviced apartments, lodges",
  },
  "Connected School Essentials": {
    included: "Campus connectivity, smart classrooms, devices, campus safety, power, managed campus IT",
    forWhom: "Schools and training centres",
  },
  "Connected Retail Essentials": {
    included: "Store connectivity and payment uptime, security with footfall analytics, power, store IT",
    forWhom: "Retailers, pharmacies, restaurants, showrooms",
  },
  "Connected Clinic Essentials": {
    included: "Clinical network, security and access, power, managed IT and backup",
    forWhom: "Clinics and diagnostic centres",
  },
  "Connected Worship Essentials": {
    included: "Worship AV and media, connectivity, safety, power, media team support",
    forWhom: "Worship centres",
  },
  "Connected Event Essentials": {
    included: "Event connectivity with post-event report, event AV and media (+ event power)",
    forWhom: "Organisers and venues",
  },
  "Smart Building Essentials": {
    included: "Building network, security and access, power, building automation, meeting technology, managed IT",
    forWhom: "Building owners and facility managers",
  },
  "Home Essentials": {
    included: "Personal devices and care, home power, home security",
    forWhom: "Individuals, families, estate residents",
  },
};
