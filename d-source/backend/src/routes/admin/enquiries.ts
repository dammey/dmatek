import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminEnquiriesRouter = Router();
adminEnquiriesRouter.use(requireStaff("Enquiries"));

adminEnquiriesRouter.get("/", async (req, res) => {
  const { type } = req.query as { type?: string };
  let query = db.from("enquiries").select("*");
  if (type) query = query.eq("type", type);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ enquiries: data });
});

adminEnquiriesRouter.patch("/:id/toggle", async (req, res) => {
  const { data: current } = await db.from("enquiries").select("done").eq("id", req.params.id).maybeSingle();
  await db.from("enquiries").update({ done: !current?.done }).eq("id", req.params.id);
  res.json({ ok: true });
});
