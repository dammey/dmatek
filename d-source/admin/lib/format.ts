export function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "26 Sep" in Lagos time (WAT), as the admin shows dates everywhere. */
export function shortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(new Date(iso).getTime() + 3600e3);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}
