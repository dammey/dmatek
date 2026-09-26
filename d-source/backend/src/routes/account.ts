import { Router } from "express";
import { z } from "zod";
import { withCustomer } from "../auth/middleware.js";
import { db } from "../supabase.js";

export const accountRouter = Router();
accountRouter.use(withCustomer);

function requireCustomer(req: import("express").Request, res: import("express").Response): string | null {
  if (!req.customer) {
    res.status(401).json({ error: "Sign in required" });
    return null;
  }
  return req.customer.id;
}

/** POST /account/link — called once, right after Supabase Auth sign-up, to
 * attach the new auth user to a customers row (creating one if needed). */
accountRouter.post("/link", async (req, res) => {
  const authUserId = req.headers["x-auth-user-id"] as string | undefined;
  const body = z.object({ fullName: z.string(), email: z.string().email() }).parse(req.body);
  if (!authUserId) return res.status(400).json({ error: "Missing auth user" });

  const { data: existing } = await db.from("customers").select("id").eq("email", body.email).maybeSingle();
  if (existing) {
    await db.from("customers").update({ auth_user_id: authUserId }).eq("id", existing.id);
    return res.json({ customerId: existing.id });
  }
  const { data, error } = await db
    .from("customers")
    .insert({ auth_user_id: authUserId, full_name: body.fullName, email: body.email, type: "retail" })
    .select("id")
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ customerId: data.id });
});

accountRouter.get("/me", async (req, res) => {
  const id = requireCustomer(req, res);
  if (!id) return;
  const { data } = await db.from("customers").select("*").eq("id", id).single();
  res.json({ customer: data });
});

accountRouter.get("/orders", async (req, res) => {
  const id = requireCustomer(req, res);
  if (!id) return;
  const { data } = await db.from("orders").select("*, order_lines(*)").eq("customer_id", id).order("placed_at", { ascending: false });
  res.json({ orders: data });
});

accountRouter.get("/quotes", async (req, res) => {
  const id = requireCustomer(req, res);
  if (!id) return;
  const { data } = await db.from("quotes").select("*, quote_lines(*)").eq("customer_id", id).order("created_at", { ascending: false });
  res.json({ quotes: data });
});

accountRouter.get("/reviews", async (req, res) => {
  const id = requireCustomer(req, res);
  if (!id) return;
  const { data } = await db.from("reviews").select("*, products(name)").eq("customer_id", id).order("created_at", { ascending: false });
  res.json({ reviews: data });
});

const businessApplicationSchema = z.object({
  companyName: z.string(),
  taxId: z.string().optional(),
  expectedActivity: z.string().optional(),
});

/** POST /account/business — apply for a D'Provision business account.
 * Approval happens in Admin > Business accounts, never automatically. */
accountRouter.post("/business", async (req, res) => {
  const id = requireCustomer(req, res);
  if (!id) return;
  const body = businessApplicationSchema.parse(req.body);
  const { error } = await db
    .from("customers")
    .update({ type: "business", company_name: body.companyName, tax_id: body.taxId, expected_activity: body.expectedActivity, account_status: "pending", applied_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ status: "pending" });
});
