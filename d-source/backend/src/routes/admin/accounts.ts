import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminAccountsRouter = Router();
adminAccountsRouter.use(requireStaff("Business accounts"));

adminAccountsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("customers").select("*").eq("type", "business").order("applied_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ accounts: data });
});

adminAccountsRouter.patch("/:id/approve", async (req, res) => {
  const { creditTermsDays } = z.object({ creditTermsDays: z.number().default(30) }).parse(req.body);
  const { error } = await db.from("customers").update({ account_status: "approved", credit_terms_days: creditTermsDays }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

adminAccountsRouter.patch("/:id/decline", async (req, res) => {
  await db.from("customers").update({ account_status: "declined" }).eq("id", req.params.id);
  res.json({ ok: true });
});
