import { Manrope } from "next/font/google";

// Shared across D'Matek, D'Source storefront and D'Source Admin.
// D'Foundry has its own fonts (Bricolage Grotesque, Instrument Serif, IBM Plex Mono) — not this.
export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});
