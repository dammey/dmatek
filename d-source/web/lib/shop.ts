import { fmt } from "./format";
import { PROMISE } from "./promises";
import type { Product } from "./types";

export const GROUPS = [
  { slug: "phones-tablets", name: "Phones & Tablets" },
  { slug: "laptops-computers", name: "Laptops & Computers" },
  { slug: "accessories-audio", name: "Accessories & Audio" },
  { slug: "networking-wifi", name: "Networking & Wi-Fi" },
  { slug: "internet-devices", name: "Internet Devices" },
  { slug: "servers-storage", name: "Servers & Storage" },
  { slug: "printers-office", name: "Printers & Office" },
  { slug: "security-cctv", name: "Security & CCTV" },
  { slug: "power", name: "Power" },
  { slug: "tv-displays", name: "TV & Displays" },
] as const;

export type GroupSlug = (typeof GROUPS)[number]["slug"];
export const groupName = (slug: string) => GROUPS.find((g) => g.slug === slug)?.name ?? slug;

/** Category intros (verbatim from the design where it has one). */
export const INTRO: Record<string, string> = {
  "phones-tablets": "New and used phones and tablets from vetted suppliers. Each one is checked for a clean IMEI, battery health and replaced parts.",
  "laptops-computers": "Laptops and desktops, new and UK-used. We check battery cycles, screen, keyboard, ports, charger and that the specs match the listing.",
  "networking-wifi": "Routers, mesh and enterprise access points. Genuine units from verified channels, with serial numbers and firmware checked.",
  "servers-storage": "Servers and storage priced by configuration. Serial verified, specs exactly as quoted, firmware updated before installation.",
  "security-cctv": "Camera kits and systems, quoted per project, installed by D’Matek engineers if you want.",
  power: "Inverters, batteries and UPS, quoted per install.",
};
export const DEFAULT_INTRO = "What we commonly source in this category. Every item is checked before it reaches you.";

export const CONDITIONS = ["New", "UK-used", "Grade A", "Grade B", "Grade C"] as const;
export const GRADES = [
  { k: "New", v: "Sealed, never used." },
  { k: "Grade A", v: "Looks near new; no visible marks." },
  { k: "Grade B", v: "Light wear such as small scuffs." },
  { k: "Grade C", v: "Clear wear; fully working. Marks shown in photos." },
];

const PHONE = ["IMEI clean, not blacklisted", "Battery health", "No replaced parts", "Specs match listing"];
const LAPTOP = ["Battery cycle count", "Screen, keyboard, ports tested", "Genuine charger included", "Specs match listing"];
const EQUIPMENT = ["Genuine unit from a verified channel", "Serial number verified", "Manufacturer warranty status checked", "Model and specs exactly as quoted", "Firmware updated before installation"];
const GENERAL = ["Genuine unit from a verified channel", "Serial number verified", "Model and specs as listed"];

/** The category checklist the Checked by D'Source panel runs. */
export function checklistFor(group: string): string[] {
  if (group === "phones-tablets") return PHONE;
  if (group === "laptops-computers") return LAPTOP;
  if (["networking-wifi", "servers-storage", "printers-office", "internet-devices", "security-cctv"].includes(group)) return EQUIPMENT;
  return GENERAL;
}

/** Short check label for tiles ("Checked · …"). */
export function checkLabel(group: string): string {
  if (group === "phones-tablets") return "IMEI, battery, parts";
  if (group === "laptops-computers") return "battery, screen, ports";
  return "serial verified";
}

export const isUsed = (p: Pick<Product, "condition">) => !!p.condition && p.condition !== "New";
export const warrantyFor = (p: Pick<Product, "condition">) => (isUsed(p) ? `${PROMISE.warrantyUsed} (used)` : `${PROMISE.warrantyNew} (new)`);
export const conditionLine = (p: Pick<Product, "condition">) => (p.condition && p.condition.startsWith("Grade") ? `${p.condition} · UK-used` : p.condition ?? "New");

/** Price as shown: real catalogue price, a visible placeholder if unpriced, "From" on quoted equipment. */
export function priceLabel(p: Pick<Product, "price" | "mode">): string {
  if (p.mode === "Quote") return p.price != null ? `From ${fmt(p.price)}` : "Price on quote";
  return p.price != null ? fmt(p.price) : "₦ [ price ]";
}

/** Design's three product versions: a new item, b used unit, c quoted equipment. */
export const versionOf = (p: Pick<Product, "mode" | "condition">): "a" | "b" | "c" => (p.mode === "Quote" ? "c" : isUsed(p) ? "b" : "a");
