/** Provider-neutral analytics shared by every D'Matek site. Events go to
 * window.dataLayer (Google Tag Manager / GA4) and window.gtag when present,
 * so the provider can be chosen without touching components. */
export type TrackParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(name: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;
  const payload = { page_path: window.location.pathname, site: window.location.hostname, ...params };
  (window.dataLayer = window.dataLayer || []).push({ event: name, ...payload });
  window.gtag?.("event", name, payload);
}

/** Name for a click: its own data-track, or call / email / WhatsApp for
 * contact links that were not tagged by hand. */
export function eventFor(target: Element): { name: string; el: Element } | null {
  const tagged = target.closest("[data-track]");
  if (tagged) return { name: tagged.getAttribute("data-track") || "", el: tagged };
  const a = target.closest("a[href]");
  if (!a) return null;
  const href = a.getAttribute("href") || "";
  if (href.startsWith("tel:")) return { name: "call_click", el: a };
  if (href.startsWith("mailto:")) return { name: "email_click", el: a };
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return { name: "whatsapp_click", el: a };
  return null;
}
