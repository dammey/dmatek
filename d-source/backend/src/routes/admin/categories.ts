import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminCategoriesRouter = Router();
adminCategoriesRouter.use(requireStaff("Categories"));

adminCategoriesRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("categories").select("*").order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ categories: data });
});

adminCategoriesRouter.post("/", async (req, res) => {
  const body = z.object({ name: z.string(), slug: z.string(), parentId: z.string().uuid().optional() }).parse(req.body);
  const { data, error } = await db.from("categories").insert({ name: body.name, slug: body.slug, parent_id: body.parentId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ category: data });
});
