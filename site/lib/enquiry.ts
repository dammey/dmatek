/** Builds a link to the shared enquiry form with context prefilled, so the
 * visitor never repeats what they already told us. Every enquiry button on
 * the site goes through this. */
export type EnquiryContext = {
  /** "Closest starting point" (an entry point or environment name). */
  topic?: string | null;
  /** Environment / organisation type. */
  org?: string | null;
  /** What do you need? (New setup, Upgrade, …) */
  need?: string | null;
  message?: string | null;
  /** Which CTA sent them, for the owner's notification and analytics. */
  source?: string | null;
};

export function enquiryHref(ctx: EnquiryContext = {}): string {
  const q = new URLSearchParams();
  if (ctx.topic) q.set("topic", ctx.topic);
  if (ctx.org) q.set("org", ctx.org);
  if (ctx.need) q.set("need", ctx.need);
  if (ctx.message) q.set("message", ctx.message);
  if (ctx.source) q.set("src", ctx.source);
  const s = q.toString();
  return s ? `/contact?${s}` : "/contact";
}
