export function fmt(n: number | null | undefined): string {
  if (n == null) return "Quoted";
  return "₦" + Math.round(n).toLocaleString("en-NG");
}
