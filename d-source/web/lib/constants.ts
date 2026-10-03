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
