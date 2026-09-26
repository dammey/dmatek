import { env } from "../env.js";
import type { InitResult, PaymentProvider, VerifyResult } from "./types.js";

const API = "https://api.flutterwave.com/v3";

export const flutterwave: PaymentProvider = {
  name: "flutterwave",
  sandbox: !env.flutterwaveSecretKey,

  async initialize({ reference, amountKobo, email, callbackUrl }): Promise<InitResult> {
    if (!env.flutterwaveSecretKey) {
      return { authorizationUrl: null, reference, sandbox: true };
    }
    const res = await fetch(`${API}/payments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.flutterwaveSecretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tx_ref: reference,
        amount: amountKobo / 100,
        currency: "NGN",
        redirect_url: callbackUrl,
        customer: { email },
      }),
    });
    const json = (await res.json()) as { status: string; data?: { link: string }; message?: string };
    if (json.status !== "success" || !json.data) throw new Error(json.message ?? "Flutterwave initialize failed");
    return { authorizationUrl: json.data.link, reference, sandbox: false };
  },

  async verify(reference: string): Promise<VerifyResult> {
    if (!env.flutterwaveSecretKey) return { reference, status: "pending", amount: 0 };
    const res = await fetch(`${API}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${env.flutterwaveSecretKey}` },
    });
    const json = (await res.json()) as { status: string; data?: { status: string; amount: number } };
    const paid = json.status === "success" && json.data?.status === "successful";
    return { reference, status: paid ? "paid" : json.data ? "failed" : "pending", amount: json.data?.amount ?? 0 };
  },
};
