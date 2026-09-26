// D'Matek family design tokens — shared verbatim across D'Matek, D'Foundry
// (colours only; D'Foundry has its own fonts/type scale) and D'Source.
// Copy is authoritative from docs/project/family/README.md § "Shared family components".

export const brand = {
  color: {
    cream: "#F5F1E8",
    creamCard: "#EFEADC",
    creamCard2: "#E8E2D0",
    deepGreen: "#06382E",
    greenTint: "#0B4B3D",
    greenDeepest: "#043028",
    greenDeepest2: "#032A22",
    midGreen: "#28705A",
    gold: "#D4A637",
    ink: "#1A1A1A",
    body: "#3A4A44",
  },
  radius: {
    /** Buttons, nav pills, inputs. */
    pill: 999,
    /** Chips, tags and step tiles (v3.4). */
    chip: 4,
  },
} as const;

export type Brand = typeof brand;
