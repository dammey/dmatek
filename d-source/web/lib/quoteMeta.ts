/** Per-line extras for the quote list (installation wanted, notes), kept in the
 * browser until the quote request is sent. Keyed by line name. */
export type QuoteMeta = { install?: boolean; notes?: string };
const KEY = "ds-quote-meta";

export function readQuoteMeta(): Record<string, QuoteMeta> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function setQuoteMeta(name: string, meta: QuoteMeta) {
  try {
    const all = readQuoteMeta();
    all[name] = { ...all[name], ...meta };
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function clearQuoteMeta() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
