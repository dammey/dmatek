import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminCustomersRouter = Router();
adminCustomersRouter.use(requireStaff("Customers"));

adminCustomersRouter.get("/", async (req, res) => {
  const { type } = req.query as { type?: string };
  let query = db.from("customers").select("*, orders(id, ref)");
  if (type) query = query.eq("type", type);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ customers: data });
});

adminCustomersRouter.get("/:id", async (req, res) => {
  const { data, error } = await db.from("customers").select("*, orders(*), addresses(*)").eq("id", req.params.id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ customer: data });
});
