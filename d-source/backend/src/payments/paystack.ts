import { env } from "../env.js";
import type { InitResult, PaymentProvider, VerifyResult } from "./types.js";

const API = "https://api.paystack.co";

export const paystack: PaymentProvider = {
  name: "paystack",
  sandbox: !env.paystackSecretKey,

  async initialize({ reference, amountKobo, email, callbackUrl }): Promise<InitResult> {
    if (!env.paystackSecretKey) {
      // No merchant account yet — the order still gets created, just
      // parked as "awaiting confirmation" instead of actually charging.
      return { authorizationUrl: null, reference, sandbox: true };
    }
    const res = await fetch(`${API}/transaction/initialize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.paystackSecretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reference, amount: amountKobo, email, callback_url: callbackUrl }),
    });
    const json = (await res.json()) as { status: boolean; data?: { authorization_url: string }; message?: string };
    if (!json.status || !json.data) throw new Error(json.message ?? "Paystack initialize failed");
    return { authorizationUrl: json.data.authorization_url, reference, sandbox: false };
  },

  async verify(reference: string): Promise<VerifyResult> {
    if (!env.paystackSecretKey) return { reference, status: "pending", amount: 0 };
    const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${env.paystackSecretKey}` },
    });
    const json = (await res.json()) as { status: boolean; data?: { status: string; amount: number } };
    const paid = json.status && json.data?.status === "success";
    return { reference, status: paid ? "paid" : json.data ? "failed" : "pending", amount: (json.data?.amount ?? 0) / 100 };
  },
};
