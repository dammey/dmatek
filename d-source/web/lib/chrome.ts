export type ChromeTone = "source" | "emporium-front" | "provision-front" | "white";
export type SubBrand = "emporium" | "provision" | null;

export function chromeFor(pathname: string): { tone: ChromeTone; subBrand: SubBrand } {
  if (pathname === "/") return { tone: "source", subBrand: null };
  if (pathname === "/emporium") return { tone: "emporium-front", subBrand: "emporium" };
  if (pathname === "/provision") return { tone: "provision-front", subBrand: "provision" };
  if (pathname.startsWith("/emporium/")) return { tone: "white", subBrand: "emporium" };
  if (pathname.startsWith("/provision/")) return { tone: "white", subBrand: "provision" };
  if (pathname === "/office-in-a-box" || pathname === "/site-survey") return { tone: "white", subBrand: "provision" };
  return { tone: "white", subBrand: null };
}
