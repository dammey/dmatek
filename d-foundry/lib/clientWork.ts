/** Client names (Droplet / Blessed Water, Omatek, Valour and Valiant) are
 * shown with the clients' written permission (handoff v3.6 §9; approval
 * received from D'Matek). Set NEXT_PUBLIC_FOUNDRY_CLIENT_WORK=hidden to take
 * the case study and every client name down again without a code change. */
export const CLIENT_WORK_APPROVED = process.env.NEXT_PUBLIC_FOUNDRY_CLIENT_WORK !== "hidden";

/** False while copy still holds a "[...]" placeholder from the design. */
export const supplied = (s: string) => !/\[[^\]]*\]/.test(s);
