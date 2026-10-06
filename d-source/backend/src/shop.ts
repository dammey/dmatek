/** One store, one catalogue: the storefront's ten shop groups, condition and
 * buying mode, derived from the existing catalogue (old category + name +
 * spec text) so no product data has to be re-entered. */

export const SHOP_GROUPS = [
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

export type GroupSlug = (typeof SHOP_GROUPS)[number]["slug"];
export type Condition = "New" | "UK-used" | "Grade A" | "Grade B" | "Grade C";
export type Mode = "Buy now" | "Quote";

type Row = { name: string; store: string; specs: unknown; categories?: unknown };

const catName = (r: Row) => ((r.categories as { name?: string } | null)?.name ?? "").toLowerCase();
const specText = (r: Row) => {
  const s = (r.specs ?? {}) as Record<string, unknown>;
  return `${s.spec ?? ""} ${s.condition ?? ""}`;
};

export function groupOf(r: Row): GroupSlug {
  const c = catName(r);
  const n = r.name.toLowerCase();
  if (/\b(printer|scanner|toner|cartridge|photocopier)\b/.test(n)) return "printers-office";
  if (c !== "phones" && c !== "tablets" && /\b(mifi|hotspot|modem|4g router|5g router|lte router|cpe)\b/.test(n)) return "internet-devices";
  if (/\b(server|poweredge|proliant|nas|storage|hard drive|hdd|ssd array)\b/.test(n) && (c === "computing" || c === "networking" || c === "security")) {
    return c === "security" && /hard drive/.test(n) ? "security-cctv" : "servers-storage";
  }
  switch (c) {
    case "phones":
    case "tablets":
      return "phones-tablets";
    case "laptops":
    case "computing":
      return "laptops-computers";
    case "wearables":
    case "accessories":
      return "accessories-audio";
    case "tv & audio":
      return /\b(tv|television|qled|oled|uhd|projector|monitor|display)\b/.test(n) ? "tv-displays" : "accessories-audio";
    case "gaming":
      return /\b(monitor|display|tv)\b/.test(n) ? "tv-displays" : "accessories-audio";
    case "networking":
    case "wi-fi":
      return "networking-wifi";
    case "security":
      return "security-cctv";
    case "power":
      return "power";
    case "displays":
      return "tv-displays";
    default:
      return "accessories-audio";
  }
}

export function conditionOf(r: Row): Condition {
  if (r.store === "provision") return "New";
  const t = `${specText(r)} ${r.name}`.toLowerCase();
  if (/grade\s*c\b/.test(t)) return "Grade C";
  if (/grade\s*b\b/.test(t)) return "Grade B";
  if (/grade\s*a\b/.test(t)) return "Grade A";
  if (/\b(uk[- ]?used|used|pre-owned|refurb)/.test(t)) return "UK-used";
  return "New";
}

/** Business equipment is quoted (installed/configured); personal devices are bought outright. */
export const modeOf = (r: Row): Mode => (r.store === "provision" ? "Quote" : "Buy now");

export function shape<T extends Row>(r: T) {
  return { ...r, group: groupOf(r), condition: conditionOf(r), mode: modeOf(r) };
}
