import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminOrdersRouter = Router();
adminOrdersRouter.use(requireStaff("Orders"));

adminOrdersRouter.get("/", async (req, res) => {
  const { status } = req.query as { status?: string };
  let query = db.from("orders").select("*, customers(full_name, company_name), addresses:shipping_address_id(city, state), order_lines(quantity, unit_price), payments(method, status)");
  if (status) query = query.eq("status", status);
  const { data, error } = await query.order("placed_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ orders: data });
});

adminOrdersRouter.get("/:ref", async (req, res) => {
  const { data, error } = await db
    .from("orders")
    .select("*, customers(*), addresses:shipping_address_id(*), order_lines(*), payments(*), shipments(*)")
    .eq("ref", req.params.ref)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ order: data });
});

const STATUSES = ["pending", "confirmed", "fulfilling", "shipped", "completed", "cancelled"] as const;

adminOrdersRouter.patch("/:ref/status", async (req, res) => {
  const { status } = z.object({ status: z.enum(STATUSES) }).parse(req.body);
  const { error } = await db.from("orders").update({ status }).eq("ref", req.params.ref);
  if (error) return res.status(500).json({ error: error.message });

  if (status === "completed") {
    const { data: order } = await db.from("orders").select("id, order_lines(product_id)").eq("ref", req.params.ref).maybeSingle();
    // A "review request" notification is logged for each distinct product on the order.
    const productIds = new Set((order?.order_lines as { product_id: string | null }[] ?? []).map((l) => l.product_id).filter(Boolean));
    for (const productId of productIds) {
      await db.from("notification_log").insert({ order_id: order!.id, channel: "whatsapp", body: `Review request for product ${productId}` });
    }
  }
  res.json({ ok: true });
});

adminOrdersRouter.patch("/:ref/note", async (req, res) => {
  const { note } = z.object({ note: z.string() }).parse(req.body);
  const { error } = await db.from("orders").update({ internal_note: note }).eq("ref", req.params.ref);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
