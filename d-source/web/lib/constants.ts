/** [word, kit key, photo A alt, photo B alt] — the home hero's rotating word
 * and the two placeholder photo slots beside it. Kit keys match the "Pick a
 * place" rope below; there's no kit overlay yet, so the word is a label, not
 * a live link, until that's built. */
export const HERO: [string, string, string, string][] = [
  ["home.", "home", "Photo: mesh Wi-Fi in a living room", "Photo: smart TV"],
  ["front gate.", "gate", "Photo: CCTV at a gate", "Photo: video doorbell"],
  ["weekend.", "weekend", "Photo: action camera", "Photo: earbuds"],
  ["office.", "office", "Photo: laptops on desks", "Photo: printer"],
  ["classroom.", "classroom", "Photo: projector", "Photo: student laptops"],
  ["clinic.", "clinic", "Photo: reception PC", "Photo: backup power"],
  ["restaurant.", "restaurant", "Photo: POS terminal", "Photo: menu screen"],
  ["hotel lobby.", "lobby", "Photo: signage screen", "Photo: guest Wi-Fi"],
  ["event hall.", "hall", "Photo: PA system", "Photo: wireless mics"],
  ["student hostel.", "hostel", "Photo: room router", "Photo: study laptop"],
  ["whole building.", "building", "Photo: server rack", "Photo: solar + battery"],
];

export const TINTS: [string, string][] = [
  ["#EFEADC", "#DCE5D6"],
  ["#E8E2D0", "#EDE6CF"],
  ["#E4DECC", "#E3EAD9"],
];

export const EMPORIUM_CATEGORIES: [string, string][] = [
  ["laptops", "Laptops"],
  ["phones", "Phones"],
  ["networking", "Wi-Fi"],
  ["tvaudio", "TV & Audio"],
  ["power", "Power"],
  ["security", "Security"],
];

export const PROVISION_CATEGORIES = ["Networking", "Computing", "Security", "Displays"];

/** Real, verbatim category descriptions from the design source (CDESC). */
export const CDESC: Record<"emporium" | "provision", Record<string, string>> = {
  emporium: {
    Laptops: "Laptops for work, study and home. Genuine and warranty-backed, with free set-up and data transfer.",
    Phones: "Phones and tablets, with free set-up and data transfer from your old phone.",
    Networking: "Mesh Wi-Fi, routers and extenders so every room gets signal.",
    "TV & Audio": "TVs, soundbars and projectors. Wall mounting is free on TVs.",
    Power: "Inverters, batteries, UPS and power banks that keep things on through outages.",
    Security: "Cameras, doorbells and smart locks for your gate and your home.",
  },
  provision: {
    Networking: "Access points, switches and gateways for the whole building, specified to the site.",
    Computing: "Laptops and desktops for teams, with volume pricing on larger orders.",
    Security: "NVRs, cameras, intercoms and access control for sites and estates.",
    Displays: "Signage, interactive boards and meeting-room displays.",
  },
};

// Emporium URL slugs vs. the canonical category name products are filed under
// (the nav tab label can differ from it, e.g. slug "networking" shows as "Wi-Fi").
export const EMPORIUM_CDESC_KEY: Record<string, string> = { laptops: "Laptops", phones: "Phones", networking: "Networking", tvaudio: "TV & Audio", power: "Power", security: "Security" };

/** Canonical category name (what products are filed under) -> the label shown in nav/filters. */
export const LABEL_BY_CANON: Record<"emporium" | "provision", Record<string, string>> = {
  emporium: Object.fromEntries(EMPORIUM_CATEGORIES.map(([slug, label]) => [EMPORIUM_CDESC_KEY[slug], label])),
  provision: Object.fromEntries(PROVISION_CATEGORIES.map((l) => [l, l])),
};
