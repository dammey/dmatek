/** The design's props, as build-time config (Vercel env vars).
 * Defaults match the prototype: start on the D'Source front, store
 * transition on, Adire footer strip on, hero background follows the
 * rotating word. */
function flag(v: string | undefined, fallback: boolean): boolean {
  if (v == null || v === "") return fallback;
  return !/^(false|0|off|no)$/i.test(v.trim());
}

export type StartView = "Source" | "Emporium" | "Provision";

const sv = (process.env.NEXT_PUBLIC_DS_START_VIEW ?? "Source").trim();

export const config = {
  startView: (sv === "Emporium" || sv === "Provision" ? sv : "Source") as StartView,
  transition: flag(process.env.NEXT_PUBLIC_DS_TRANSITION, true),
  adire: flag(process.env.NEXT_PUBLIC_DS_ADIRE, true),
  heroRotate: flag(process.env.NEXT_PUBLIC_DS_HERO_ROTATE, true),
};
