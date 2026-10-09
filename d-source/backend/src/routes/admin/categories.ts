import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminCategoriesRouter = Router();
adminCategoriesRouter.use(requireStaff("Categories"));

/** GET /admin/categories — every placement across both stores: what shows
 * in the storefront category bar, in what order, under what label. */
adminCategoriesRouter.get("/", async (_req, res) => {
  const { data, error } = await db
    .from("category_placements")
    .select("id, store, slug, label, sort_order, is_active, categories(id, name)")
    .order("store")
    .order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  // Product count per store + category, as "6 products" under each row.
  const { data: prods } = await db.from("products").select("store, category_id");
  const count = (store: string, cat: string | null) => (prods ?? []).filter((x) => x.store === store && x.category_id === cat).length;
  const placements = (data ?? []).map((p) => ({
    id: p.id,
    store: p.store,
    slug: p.slug,
    label: p.label,
    sortOrder: p.sort_order,
    isActive: p.is_active,
    categoryId: (p.categories as unknown as { id: string; name: string } | null)?.id ?? null,
    categoryName: (p.categories as unknown as { id: string; name: string } | null)?.name ?? "",
    productCount: count(p.store, (p.categories as unknown as { id: string } | null)?.id ?? null),
  }));
  res.json({ placements });
});

const addSchema = z.object({ store: z.enum(["emporium", "provision"]), categoryName: z.string().min(1), slug: z.string().min(1), label: z.string().min(1) });

/** POST /admin/categories — add a category to a store's bar. Reuses an
 * existing categories row by name (so the same canonical bucket, e.g.
 * "Networking", can be placed in both stores under different labels), or
 * creates one if this name hasn't been used before. */
adminCategoriesRouter.post("/", async (req, res) => {
  const body = addSchema.parse(req.body);

  let { data: category } = await db.from("categories").select("id").eq("name", body.categoryName).maybeSingle();
  if (!category) {
    const { data: created, error: createErr } = await db
      .from("categories")
      .insert({ name: body.categoryName, slug: body.slug })
      .select("id")
      .single();
    if (createErr) return res.status(500).json({ error: createErr.message });
    category = created;
  }

  const { data: maxRow } = await db.from("category_placements").select("sort_order").eq("store", body.store).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await db
    .from("category_placements")
    .insert({ category_id: category.id, store: body.store, slug: body.slug, label: body.label, sort_order: nextOrder })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ placement: data });
});

const patchSchema = z.object({ label: z.string().min(1).optional(), isActive: z.boolean().optional() });

/** PATCH /admin/categories/:id — rename the storefront label, or show/hide. */
adminCategoriesRouter.patch("/:id", async (req, res) => {
  const body = patchSchema.parse(req.body);
  const update: Record<string, unknown> = {};
  if (body.label !== undefined) update.label = body.label;
  if (body.isActive !== undefined) update.is_active = body.isActive;
  const { data, error } = await db.from("category_placements").update(update).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ placement: data });
});

/** PATCH /admin/categories/:id/move — swap this placement's position with
 * its neighbour in the same store's bar. Order = storefront category bar
 * order, so this directly changes what customers see. */
adminCategoriesRouter.patch("/:id/move", async (req, res) => {
  const { direction } = z.object({ direction: z.enum(["up", "down"]) }).parse(req.body);

  const { data: current, error: curErr } = await db.from("category_placements").select("id, store, sort_order").eq("id", req.params.id).single();
  if (curErr) return res.status(404).json({ error: "Not found" });

  let neighbourQuery = db.from("category_placements").select("id, sort_order").eq("store", current.store);
  neighbourQuery = direction === "up" ? neighbourQuery.lt("sort_order", current.sort_order).order("sort_order", { ascending: false }) : neighbourQuery.gt("sort_order", current.sort_order).order("sort_order", { ascending: true });
  const { data: neighbour } = await neighbourQuery.limit(1).maybeSingle();
  if (!neighbour) return res.json({ ok: true });

  const { error: err1 } = await db.from("category_placements").update({ sort_order: neighbour.sort_order }).eq("id", current.id);
  const { error: err2 } = await db.from("category_placements").update({ sort_order: current.sort_order }).eq("id", neighbour.id);
  if (err1 || err2) return res.status(500).json({ error: (err1 ?? err2)?.message });
  res.json({ ok: true });
});
