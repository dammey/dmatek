/** Cross-site URLs. Defaults are the launch domains; Vercel env vars point
 * them at preview hosts until the custom domains are attached. */
export const DMATEK_URL = (process.env.NEXT_PUBLIC_DMATEK_URL ?? "https://www.dmatek.ng").replace(/\/$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://source.dmatek.ng").replace(/\/$/, "");
