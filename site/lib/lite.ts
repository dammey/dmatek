/** Lite mode for the canvas/3D pieces: reduced motion, data saver, a 2G
 * connection, or ?lite=1. They then draw a still, finished frame instead of
 * animating. */
export function isLite(): boolean {
  if (typeof window === "undefined") return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return (
    location.search.includes("lite=1") ||
    !!(c && (c.saveData || /2g/.test(c.effectiveType ?? ""))) ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
