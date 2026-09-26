export function fmt(n: number | null | undefined): string {
  if (n == null || n === 0) return "Quoted";
  return "₦" + Math.round(n).toLocaleString("en-NG");
}
