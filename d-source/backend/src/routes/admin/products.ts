import { Router, raw } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";
import { shape } from "../../shop.js";

export const adminProductsRouter = Router();
adminProductsRouter.use(requireStaff("Products"));

adminProductsRouter.get("/", async (req, res) => {
  const { category } = req.query as { category?: string };
  let query = db.from("products").select("*, categories(name), product_prices(*), inventory(quantity_on_hand, quantity_reserved, reorder_level)");
  if (category) query = query.eq("category_id", category);
  const { data, error } = await query.order("name");
  if (error) return res.status(500).json({ error: error.message });
  // Category options as the admin shows them: "For you · …" / "Business · …".
  const { data: placements } = await db.from("category_placements").select("store, label, sort_order, category_id").order("store").order("sort_order");
  res.json({ products: (data ?? []).map(shape), placements: placements ?? [] });
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
  /** null/absent = sourced on order: no stock held, no inventory row. */
  stock: z.number().int().min(0).nullable().optional(),
});

adminProductsRouter.post("/", async (req, res) => {
  const body = productSchema.parse(req.body);
  const { data: product, error } = await db
    .from("products")
    .insert({ sku: body.sku, name: body.name, slug: body.slug, description: body.description, store: body.store, category_id: body.categoryId, specs: body.specs ?? {}, images: body.images ?? [], is_active: body.isActive ?? false })
    .select("id")
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (body.stock != null) await db.from("inventory").insert({ product_id: product.id, quantity_on_hand: body.stock });
  if (body.price != null) await db.from("product_prices").insert({ product_id: product.id, price_list: body.store === "provision" ? "business" : "retail", unit_price: body.price });

  res.status(201).json({ id: product.id });
});

adminProductsRouter.patch("/:id", async (req, res) => {
  const body = productSchema.partial().parse(req.body);
  const { price, categoryId, isActive, stock, ...rest } = body;
  const patch: Record<string, unknown> = { ...rest };
  if (categoryId !== undefined) patch.category_id = categoryId;
  if (isActive !== undefined) patch.is_active = isActive;
  if (Object.keys(patch).length) {
    const { error } = await db.from("products").update(patch).eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
  }
  if (stock === null) {
    // Back to "sourced on order" only when nothing is held or reserved, so recorded stock is never lost.
    await db.from("inventory").delete().eq("product_id", req.params.id).eq("quantity_on_hand", 0).eq("quantity_reserved", 0);
  } else if (stock != null) {
    const { data: inv } = await db.from("inventory").select("id").eq("product_id", req.params.id).maybeSingle();
    if (inv) await db.from("inventory").update({ quantity_on_hand: stock, updated_at: new Date().toISOString() }).eq("id", inv.id);
    else await db.from("inventory").insert({ product_id: req.params.id, quantity_on_hand: stock });
  }
  if (price != null) {
    const { data: product } = await db.from("products").select("store").eq("id", req.params.id).maybeSingle();
    const priceList = (body.store ?? product?.store) === "provision" ? "business" : "retail";
    await db.from("product_prices").upsert({ product_id: req.params.id, price_list: priceList, unit_price: price }, { onConflict: "product_id,price_list" });
  }
  res.json({ ok: true });
});

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** POST /admin/products/:id/image — raw image body; becomes the main photo. */
adminProductsRouter.post("/:id/image", raw({ type: Object.keys(IMAGE_TYPES), limit: "10mb" }), async (req, res) => {
  const type = (req.headers["content-type"] ?? "").split(";")[0];
  const ext = IMAGE_TYPES[type];
  if (!ext || !Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ error: "Upload a JPG, PNG or WebP photo" });
  const { data: product } = await db.from("products").select("images").eq("id", req.params.id).maybeSingle();
  if (!product) return res.status(404).json({ error: "Not found" });
  const path = `${req.params.id}/${Date.now()}.${ext}`;
  const up = await db.storage.from("product-images").upload(path, req.body, { contentType: type });
  if (up.error) return res.status(500).json({ error: up.error.message });
  const url = db.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  const images = [url, ...((product.images as string[] | null) ?? []).filter((u) => u !== url)];
  const { error } = await db.from("products").update({ images }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ url, images });
});

adminProductsRouter.patch("/:id/stock", async (req, res) => {
  const { delta } = z.object({ delta: z.number() }).parse(req.body);
  const { data: inv } = await db.from("inventory").select("id, quantity_on_hand").eq("product_id", req.params.id).maybeSingle();
  if (!inv) return res.status(404).json({ error: "No inventory row for this product" });
  await db.from("inventory").update({ quantity_on_hand: inv.quantity_on_hand + delta, updated_at: new Date().toISOString() }).eq("id", inv.id);
  res.json({ ok: true });
});

adminProductsRouter.patch("/:id/reorder-level", async (req, res) => {
  const { reorderLevel } = z.object({ reorderLevel: z.number().int().min(0) }).parse(req.body);
  const { error } = await db.from("inventory").update({ reorder_level: reorderLevel }).eq("product_id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/** POST /admin/products/bulk — CSV/XLSX rows already parsed client-side
 * into JSON; new SKUs land hidden (is_active: false) until checked,
 * existing SKUs get their price and stock updated. */
adminProductsRouter.post("/bulk", async (req, res) => {
  const rows = z
    .array(
      z.object({
        sku: z.string(),
        name: z.string(),
        store: z.enum(["home", "business"]),
        category: z.string(),
        brand: z.string().optional(),
        spec: z.string().optional(),
        price: z.number(),
        stock: z.number().int().min(0).nullable().optional(),
        freeSetup: z.boolean().optional(),
      })
    )
    .parse(req.body.rows);

  let imported = 0;
  for (const row of rows) {
    const { data: existing } = await db.from("products").select("id").eq("sku", row.sku).maybeSingle();
    const priceList = row.store === "home" ? "retail" : "business";
    if (existing) {
      await db.from("product_prices").upsert({ product_id: existing.id, price_list: priceList, unit_price: row.price }, { onConflict: "product_id,price_list" });
      if (row.stock != null) {
        const { data: inv } = await db.from("inventory").select("id").eq("product_id", existing.id).maybeSingle();
        if (inv) await db.from("inventory").update({ quantity_on_hand: row.stock, updated_at: new Date().toISOString() }).eq("id", inv.id);
        else await db.from("inventory").insert({ product_id: existing.id, quantity_on_hand: row.stock });
      }
    } else {
      // Category by name, or by the label staff see in Categories (e.g. "Wi-Fi").
      let { data: category } = await db.from("categories").select("id").ilike("name", row.category).maybeSingle();
      if (!category) {
        const { data: pl } = await db.from("category_placements").select("category_id").ilike("label", row.category).limit(1).maybeSingle();
        if (pl?.category_id) category = { id: pl.category_id };
      }
      const { data: product } = await db
        .from("products")
        .insert({
          sku: row.sku,
          name: row.name,
          slug: row.sku.toLowerCase(),
          store: row.store === "home" ? "emporium" : "provision",
          category_id: category?.id,
          specs: { brand: row.brand, spec: row.spec, free: row.freeSetup ?? false },
          is_active: false,
        })
        .select("id")
        .single();
      if (product) {
        await db.from("product_prices").insert({ product_id: product.id, price_list: priceList, unit_price: row.price });
        if (row.stock != null) await db.from("inventory").insert({ product_id: product.id, quantity_on_hand: row.stock });
      }
    }
    imported += 1;
  }
  res.json({ imported });
});
