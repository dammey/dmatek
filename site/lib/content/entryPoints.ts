// The "Or start with what you need" entry points — Solutions accordion and
// the home finder's pills. Copy verbatim from Dmatek Website v3.6.dc.html (const EP).

export type EntryPointExtra =
  | { type: "health" }
  | { type: "foundry" }
  | { type: "source" }
  | { type: "env"; envId: string }
  | null;

export type EntryPoint = {
  id: string;
  title: string;
  copy: string;
  now: string[];
  extra: EntryPointExtra;
};

export const entryPoints: EntryPoint[] = [
  {"id":"connect","title":"Connect my business","copy":"Internet and Wi-Fi designed for how your site is used, with backup links, and watched for you. Or Wi-Fi for a monthly fee, with no equipment to buy.","now":["Managed Connectivity & Wi-Fi","Wi-Fi-as-a-Service"],"extra":null},
  {"id":"start","title":"Start or move my business","copy":"Everything a new office needs, set up right the first time. Or a move where you’re working on day one and nothing goes missing.","now":["Office in a Box","Office Relocation","Digital Workplace & Identity","Website & Hosting Care"],"extra":null},
  {"id":"it","title":"Keep my IT running","copy":"One number to call. Problems fixed or prevented. A plain-language picture every month. Not sure where to start? Begin with a Technology Health Check.","now":["Managed IT","Technology Health Check","Device Lifecycle Management"],"extra":{"type":"health"}},
  {"id":"secure","title":"Secure my organisation","copy":"Know your risk and close the gaps that matter. Stop phishing and invoice fraud. Back up what you can’t lose, and prove you can restore it. Control who comes in.","now":["Cyber Protection","Email Security & Anti-Fraud","Verified Backup & Recovery","Security & Access","Security System Care"],"extra":null},
  {"id":"power","title":"Keep the power on","copy":"Power you can count on, at a cost you can see: grid, solar, inverter, generator and protection for your IT.","now":["Power Continuity"],"extra":null},
  {"id":"software","title":"Build software","copy":"Software, systems and automation built around your problem. Continues on D’Foundry.","now":["Custom Software & Products","Business Systems & Automation"],"extra":{"type":"foundry"}},
  {"id":"building","title":"Modernise a building","copy":"Secure access, rooms that work, and building systems that respond to how the space is used.","now":["Security & Access","Meeting & Workplace Technology","Building Automation & Environment"],"extra":null},
  {"id":"estate","title":"Prepare a new estate","copy":"ISP-ready fibre to every home, and security from the gate, designed into the development.","now":["Estate Fiber (infrastructure)","Internet-Ready Homes","Estate Gate & Perimeter Security","Power Continuity"],"extra":{"type":"env","envId":"real-estate"}},
  {"id":"equip","title":"Equip my business","copy":"Genuine devices and equipment, set up and supported. Continues on D’Source.","now":["Device Lifecycle Management","D’Provision"],"extra":{"type":"source"}},
];
