/** Payment status labels and colours as Payments in "DSource Admin v3.dc.html". */
export type Payment = {
  id: string;
  method: "card" | "transfer" | "invoice_terms" | "pod";
  status: "pending" | "paid" | "partially_paid" | "overdue" | "refunded" | "failed";
  amount: number;
  provider?: string | null;
  provider_ref?: string | null;
  orders?: { ref: string; customers?: { full_name: string; company_name: string | null } | null } | null;
};

export const PST: Record<string, [string, string]> = {
  Paid: ["#D9F0E3", "#1F7A5A"],
  "On invoice": ["#EFEADC", "#06382E"],
  "Pay on delivery": ["#FFF1CC", "#7A5B00"],
  "Awaiting transfer": ["#FFF1CC", "#7A5B00"],
  Failed: ["#FDE7E4", "#B42318"],
  Refunded: ["#E6E2D8", "#3A4A44"],
  "Awaiting payment": ["#FFF1CC", "#7A5B00"],
};

export function payState(p: Payment) {
  if (p.status === "paid") return "Paid";
  if (p.status === "refunded") return "Refunded";
  if (p.status === "failed") return "Failed";
  if (p.method === "invoice_terms") return "On invoice";
  if (p.method === "pod") return "Pay on delivery";
  if (p.method === "transfer") return "Awaiting transfer";
  return "Awaiting payment";
}

