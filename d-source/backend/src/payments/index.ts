import { env } from "../env.js";
import { flutterwave } from "./flutterwave.js";
import { paystack } from "./paystack.js";
import type { PaymentProvider } from "./types.js";

const providers: Record<"paystack" | "flutterwave", PaymentProvider> = { paystack, flutterwave };

/** The active card gateway, feature-flagged by PAYMENT_PROVIDER. Both are
 * always registered so checkout can offer either without a redeploy once
 * both merchant accounts exist — this just picks the default. */
export const activePaymentProvider: PaymentProvider = providers[env.paymentProvider];

export function paymentProviderByName(name: string): PaymentProvider {
  const p = providers[name as "paystack" | "flutterwave"];
  if (!p) throw new Error(`Unknown payment provider: ${name}`);
  return p;
}
