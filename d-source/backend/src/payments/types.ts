export type InitResult = {
  authorizationUrl: string | null;
  reference: string;
  sandbox: boolean;
};

export type VerifyResult = {
  reference: string;
  status: "paid" | "failed" | "pending";
  amount: number;
};

export interface PaymentProvider {
  name: "paystack" | "flutterwave";
  /** Sandbox mode is on whenever no secret key has been configured yet. */
  sandbox: boolean;
  initialize(args: { reference: string; amountKobo: number; email: string; callbackUrl: string }): Promise<InitResult>;
  verify(reference: string): Promise<VerifyResult>;
}
