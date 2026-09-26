import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminReviewsRouter = Router();
adminReviewsRouter.use(requireStaff("Reviews"));

adminReviewsRouter.get("/", async (req, res) => {
  const { state } = req.query as { state?: string };
  let query = db.from("reviews").select("*, products(name), orders(ref)");
  if (state) query = query.eq("state", state);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ reviews: data });
});

adminReviewsRouter.patch("/:id/approve", async (req, res) => {
  await db.from("reviews").update({ state: "approved" }).eq("id", req.params.id);
  res.json({ ok: true });
});

adminReviewsRouter.patch("/:id/reject", async (req, res) => {
  await db.from("reviews").update({ state: "rejected" }).eq("id", req.params.id);
  res.json({ ok: true });
});
