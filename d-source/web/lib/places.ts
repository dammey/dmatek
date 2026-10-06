/** Hero places and the kit selector's place kits (design v11.1). */
export const PLACES = ["home", "office", "server room", "shop", "hotel", "classroom"] as const;
export type Place = (typeof PLACES)[number];
export const placeKey = (p: string) => p.replace(" ", "-");

export const PLACE_PHOTO: Record<Place, string> = {
  home: "Photo: living room",
  office: "Photo: open-plan office",
  "server room": "Photo: server room with racks",
  shop: "Photo: shop counter and till",
  hotel: "Photo: hotel lobby",
  classroom: "Photo: classroom with display",
};

export const KITS: Record<Place, [string, string][]> = {
  home: [
    ["Mesh Wi-Fi, 3-pack", "Covers a 3–4 bed home"],
    ["CCTV kit", "Cameras and recorder"],
    ["Inverter and battery", "Backup power"],
  ],
  office: [
    ["Router and switch", "Wired and Wi-Fi network"],
    ["Access points", "Office-wide Wi-Fi"],
    ["UPS", "Power backup"],
  ],
  "server room": [
    ["Rack server", "2U, dual PSU"],
    ["Firewall", "Network protection"],
    ["UPS and rack", "Power and housing"],
  ],
  shop: [
    ["Router and Wi-Fi", "Counter and floor"],
    ["CCTV kit", "Door and till cameras"],
    ["UPS", "Keeps tills running"],
  ],
  hotel: [
    ["Access points", "Rooms and lobby"],
    ["CCTV system", "Common areas"],
    ["Commercial displays", "Lobby and rooms"],
  ],
  classroom: [
    ["Access points", "Classroom Wi-Fi"],
    ["Display or projector", "Teaching screen"],
    ["Power and surge protection", "Per room"],
  ],
};
