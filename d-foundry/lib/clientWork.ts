/** Client names (Droplet / Blessed Water, Omatek, Valour and Valiant) need
 * the clients' written permission before they appear (handoff v3.6 §9).
 * Set NEXT_PUBLIC_FOUNDRY_CLIENT_WORK=approved once permission is in hand;
 * until then the case study and every client name stay hidden. */
export const CLIENT_WORK_APPROVED = process.env.NEXT_PUBLIC_FOUNDRY_CLIENT_WORK === "approved";

/** False while copy still holds a "[...]" placeholder from the design. */
export const supplied = (s: string) => !/\[[^\]]*\]/.test(s);
