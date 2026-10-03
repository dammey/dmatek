/** Saved kits, client-only — the source itself never persists these past
 * the page session (plain React state), so localStorage is a faithful,
 * minimal upgrade (survives reload) rather than a fabricated backend
 * feature. No API endpoint for this exists and none is invented here. */

const KEY = "ds-saved-kits";

export function getSavedKits(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveKit(key: string): string[] {
  const kits = getSavedKits();
  if (kits.includes(key)) return kits;
  const next = [key, ...kits];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function removeSavedKit(key: string): string[] {
  const next = getSavedKits().filter((k) => k !== key);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
