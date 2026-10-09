import { db } from "../supabase.js";

/** Store settings, field names and defaults exactly as Settings in
 * "DSource Admin v3.dc.html". Blank means [ TO CONFIRM ] on the storefront. */
export type StoreSettings = {
  feeLagos: string;
  feeAbuja: string;
  feeOther: string;
  times: string;
  pod: string;
  returns: string;
  reviewTime: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  sla: string;
  invoiceDays: string;
};

export const SETTINGS_DEFAULTS: StoreSettings = {
  feeLagos: "",
  feeAbuja: "",
  feeOther: "",
  times: "Lagos within 24 hours · outside Lagos within 48 hours",
  pod: "Available, subject to terms and conditions",
  returns: "7 days",
  phone: "07058071768",
  email: "hello@dmatek.ng",
  whatsapp: "07058071768",
  address: "",
  sla: "24",
  invoiceDays: "30",
  reviewTime: "",
};

export const SETTINGS_KEYS = Object.keys(SETTINGS_DEFAULTS) as (keyof StoreSettings)[];

export async function getSettings(): Promise<StoreSettings> {
  const { data } = await db.from("storefront_content").select("value").eq("key", "settings").maybeSingle();
  const saved = (data?.value ?? {}) as Partial<StoreSettings>;
  const out = { ...SETTINGS_DEFAULTS };
  for (const k of SETTINGS_KEYS) if (typeof saved[k] === "string") out[k] = saved[k]!;
  return out;
}

/** Quote reply promise in minutes (Settings › QUOTE REPLY (HOURS)). */
export async function quoteSlaMinutes() {
  const h = Number((await getSettings()).sla);
  return (Number.isFinite(h) && h > 0 ? h : 24) * 60;
}
