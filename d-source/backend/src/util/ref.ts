/** Matches the prototype's reference format, e.g. DS-8K2Q1M. */
export function makeRef(prefix: "DS" | "DQ" | "SV"): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}
