/** Provider-neutral analytics. Events go to window.dataLayer (Google Tag
 * Manager / GA4) and window.gtag when present, so the provider can be chosen
 * later without touching components. Nothing is sent until D'Matek supplies
 * an analytics ID (NEXT_PUBLIC_GA_ID). */
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const payload = { page_path: window.location.pathname, ...params };
  window.dataLayer?.push({ event: name, ...payload });
  window.gtag?.("event", name, payload);
}
