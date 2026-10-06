/** The design's props, as build-time config (Vercel env vars). Defaults match
 * the design: Adire bands on, hero place rotation on. */
function flag(v: string | undefined, fallback: boolean): boolean {
  if (v == null || v === "") return fallback;
  return !/^(false|0|off|no)$/i.test(v.trim());
}

export const config = {
  adire: flag(process.env.NEXT_PUBLIC_DS_ADIRE, true),
  heroRotate: flag(process.env.NEXT_PUBLIC_DS_HERO_ROTATE, true),
};
