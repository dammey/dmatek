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
  const body = z.object({ name: z.string(), contactEmail: z.string().optional(), contactPhone: z.string().optional() }).parse(req.body);
  const { data, error } = await db.from("suppliers").insert({ name: body.name, contact_email: body.contactEmail, contact_phone: body.contactPhone }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ supplier: data });
});

adminSuppliersRouter.get("/pos", async (_req, res) => {
  const { data, error } = await db.from("purchase_orders").select("*, suppliers(name), po_lines(*)").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ purchaseOrders: data });
});

const poSchema = z.object({ supplierId: z.string().uuid(), items: z.array(z.object({ description: z.string(), quantity: z.number(), unitCost: z.number().optional() })), expectedDate: z.string().optional() });

adminSuppliersRouter.post("/pos", async (req, res) => {
  const body = poSchema.parse(req.body);
  const value = body.items.reduce((a, i) => a + i.quantity * (i.unitCost ?? 0), 0);
  const { data: po, error } = await db
    .from("purchase_orders")
    .insert({ ref: makeRef("DS").replace("DS", "PO"), supplier_id: body.supplierId, value, expected_date: body.expectedDate, status: "draft" })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  await db.from("po_lines").insert(body.items.map((i) => ({ po_id: po.id, description: i.description, quantity: i.quantity, unit_cost: i.unitCost })));
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
      if (inv) await db.from("inventory").update({ quantity_on_hand: inv.quantity_on_hand + line.quantity }).eq("id", inv.id);
    }
  }
  res.json({ status: next });
});
