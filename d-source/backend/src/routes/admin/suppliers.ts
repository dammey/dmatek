import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";
import { makeRef } from "../../util/ref.js";

export const adminSuppliersRouter = Router();
adminSuppliersRouter.use(requireStaff("Suppliers and POs"));

adminSuppliersRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("suppliers").select("*, product_suppliers(product_id, cost_price, lead_time_days)");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ suppliers: data });
});

adminSuppliersRouter.post("/", async (req, res) => {
  const body = z
    .object({ name: z.string().min(1), supplies: z.string().optional(), brands: z.string().optional(), contact: z.string().optional(), leadTime: z.string().optional() })
    .parse(req.body);
  const { data, error } = await db
    .from("suppliers")
    .insert({ name: body.name, supplies: body.supplies, brands: body.brands, contact: body.contact, lead_time: body.leadTime })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ supplier: data });
});

adminSuppliersRouter.get("/pos", async (_req, res) => {
  const { data, error } = await db.from("purchase_orders").select("*, suppliers(name), po_lines(*)").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  const purchaseOrders = (data ?? []).map((po) => ({ ...po, itemCount: ((po.po_lines as unknown[] | null) ?? []).length }));
  res.json({ purchaseOrders });
});

/** POST /admin/suppliers/pos — as the New purchase order drawer: supplier,
 * items ("10 × Latitude 5550", one per line or comma-separated), value and
 * expected date. Items whose name matches a product are linked so receiving
 * the PO adds them to stock. */
const poSchema = z.object({ supplierId: z.string().uuid(), items: z.string().min(1), value: z.number().nonnegative().optional(), expectedDate: z.string().optional() });

adminSuppliersRouter.post("/pos", async (req, res) => {
  const body = poSchema.parse(req.body);
  const lines = body.items
    .split(/[\n,]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const m = /^(\d+)\s*[×x*]\s*(.+)$/i.exec(t);
      return m ? { quantity: Number(m[1]), description: m[2].trim() } : { quantity: 1, description: t };
    });
  const expected = body.expectedDate && !Number.isNaN(Date.parse(body.expectedDate)) ? new Date(body.expectedDate).toISOString().slice(0, 10) : null;
  const { data: po, error } = await db
    .from("purchase_orders")
    .insert({ ref: makeRef("PO"), supplier_id: body.supplierId, value: body.value ?? 0, expected_date: expected, status: "draft" })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  const rows = [];
  for (const l of lines) {
    const { data: product } = await db.from("products").select("id").ilike("name", l.description).limit(1).maybeSingle();
    rows.push({ po_id: po.id, description: l.description, quantity: l.quantity, product_id: product?.id ?? null });
  }
  if (rows.length) await db.from("po_lines").insert(rows);
  res.status(201).json({ po });
});

adminSuppliersRouter.patch("/pos/:ref/advance", async (req, res) => {
  const { data: po } = await db.from("purchase_orders").select("id, status").eq("ref", req.params.ref).maybeSingle();
  if (!po) return res.status(404).json({ error: "Not found" });
  const next = po.status === "draft" ? "ordered" : "received";
  await db.from("purchase_orders").update({ status: next }).eq("ref", req.params.ref);

  if (next === "received") {
    const { data: lines } = await db.from("po_lines").select("product_id, quantity").eq("po_id", po.id);
    for (const line of lines ?? []) {
      if (!line.product_id) continue;
      const { data: inv } = await db.from("inventory").select("id, quantity_on_hand").eq("product_id", line.product_id).maybeSingle();
      if (inv) await db.from("inventory").update({ quantity_on_hand: inv.quantity_on_hand + Number(line.quantity) }).eq("id", inv.id);
      else await db.from("inventory").insert({ product_id: line.product_id, quantity_on_hand: Number(line.quantity) });
    }
  }
  res.json({ status: next });
});

adminSuppliersRouter.patch("/:id", async (req, res) => {
  const body = z.object({ name: z.string().min(1).optional(), supplies: z.string().optional(), brands: z.string().optional(), contact: z.string().optional(), leadTime: z.string().optional() }).parse(req.body);
  const patch: Record<string, string | undefined> = { name: body.name, supplies: body.supplies, brands: body.brands, contact: body.contact, lead_time: body.leadTime };
  Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);
  const { error } = await db.from("suppliers").update(patch).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
