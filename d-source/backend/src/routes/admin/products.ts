import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminProductsRouter = Router();
adminProductsRouter.use(requireStaff("Products"));

adminProductsRouter.get("/", async (req, res) => {
  const { category } = req.query as { category?: string };
  let query = db.from("products").select("*, categories(name), product_prices(*), inventory(quantity_on_hand)");
  if (category) query = query.eq("category_id", category);
  const { data, error } = await query.order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ products: data });
});

const productSchema = z.object({
  sku: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  store: z.enum(["emporium", "provision"]),
  categoryId: z.string().uuid().optional(),
  specs: z.record(z.unknown()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  price: z.number().optional(),
});

adminProductsRouter.post("/", async (req, res) => {
  const body = productSchema.parse(req.body);
  const { data: product, error } = await db
    .from("products")
    .insert({ sku: body.sku, name: body.name, slug: body.slug, description: body.description, store: body.store, category_id: body.categoryId, specs: body.specs ?? {}, images: body.images ?? [], is_active: body.isActive ?? false })
    .select("id")
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (body.price != null) await db.from("product_prices").insert({ product_id: product.id, price_list: body.store === "provision" ? "business" : "retail", unit_price: body.price });
  await db.from("inventory").insert({ product_id: product.id, quantity_on_hand: 0 });

  res.status(201).json({ id: product.id });
});

adminProductsRouter.patch("/:id", async (req, res) => {
  const body = productSchema.partial().parse(req.body);
  const { price, categoryId, isActive, ...rest } = body;
  const patch: Record<string, unknown> = { ...rest };
  if (categoryId !== undefined) patch.category_id = categoryId;
  if (isActive !== undefined) patch.is_active = isActive;
  if (Object.keys(patch).length) {
    const { error } = await db.from("products").update(patch).eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
  }
  if (price != null) {
    const { data: product } = await db.from("products").select("store").eq("id", req.params.id).maybeSingle();
    const priceList = (body.store ?? product?.store) === "provision" ? "business" : "retail";
    await db.from("product_prices").upsert({ product_id: req.params.id, price_list: priceList, unit_price: price }, { onConflict: "product_id,price_list" });
  }
  res.json({ ok: true });
});

adminProductsRouter.patch("/:id/stock", async (req, res) => {
  const { delta } = z.object({ delta: z.number() }).parse(req.body);
  const { data: inv } = await db.from("inventory").select("id, quantity_on_hand").eq("product_id", req.params.id).maybeSingle();
  if (!inv) return res.status(404).json({ error: "No inventory row for this product" });
  await db.from("inventory").update({ quantity_on_hand: inv.quantity_on_hand + delta, updated_at: new Date().toISOString() }).eq("id", inv.id);
  res.json({ ok: true });
});

/** POST /admin/products/bulk — CSV/XLSX rows already parsed client-side
 * into JSON; new SKUs land hidden (is_active: false) until checked. */
adminProductsRouter.post("/bulk", async (req, res) => {
  const rows = z
    .array(z.object({ sku: z.string(), name: z.string(), store: z.enum(["home", "business"]), category: z.string(), price: z.number(), stock: z.number() }))
    .parse(req.body.rows);

  let imported = 0;
  for (const row of rows) {
    const { data: existing } = await db.from("products").select("id").eq("sku", row.sku).maybeSingle();
    const priceList = row.store === "home" ? "retail" : "business";
    if (existing) {
      await db.from("product_prices").upsert({ product_id: existing.id, price_list: priceList, unit_price: row.price }, { onConflict: "product_id,price_list" });
      const { data: inv } = await db.from("inventory").select("id").eq("product_id", existing.id).maybeSingle();
      if (inv) await db.from("inventory").update({ quantity_on_hand: row.stock }).eq("id", inv.id);
    } else {
      const { data: product } = await db
        .from("products")
        .insert({ sku: row.sku, name: row.name, slug: row.sku.toLowerCase(), store: row.store === "home" ? "emporium" : "provision", specs: { category: row.category }, is_active: false })
        .select("id")
        .single();
      if (product) {
        await db.from("product_prices").insert({ product_id: product.id, price_list: priceList, unit_price: row.price });
        await db.from("inventory").insert({ product_id: product.id, quantity_on_hand: row.stock });
      }
    }
    imported += 1;
  }
  res.json({ imported });
});
