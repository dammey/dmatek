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
    .select("*, customers(*), addresses:shipping_address_id(*), order_lines(*), payments(*), shipments(*), jobs(id, engineer_staff_id, status, staff:engineer_staff_id(name))")
    .eq("ref", req.params.ref)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ order: data });
});

// v3 stages: Ordered, Sourced, Checked, Out for delivery, Delivered, Returned.
const STATUSES = ["pending", "confirmed", "fulfilling", "shipped", "completed", "returned", "cancelled"] as const;

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

/** PATCH /admin/orders/:ref/checked — unit check results shown to the customer on tracking. */
adminOrdersRouter.patch("/:ref/checked", async (req, res) => {
  const body = z
    .object({ battery: z.string().max(20).optional(), imei: z.enum(["Clean, verified", "Not verified yet", "Failed"]).optional(), condition: z.string().max(40).optional(), media: z.string().max(2000).optional() })
    .parse(req.body);
  const { error } = await db
    .from("orders")
    .update({ check_battery: body.battery ?? null, check_imei: body.imei ?? null, check_condition: body.condition ?? null, check_media: body.media || null })
    .eq("ref", req.params.ref);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

adminOrdersRouter.patch("/:ref/note", async (req, res) => {
  const { note } = z.object({ note: z.string() }).parse(req.body);
  const { error } = await db.from("orders").update({ internal_note: note }).eq("ref", req.params.ref);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/** PATCH /admin/orders/:ref/engineer — sets (or creates) the installation
 * job's assigned engineer from the order drawer. */
adminOrdersRouter.patch("/:ref/engineer", async (req, res) => {
  const { engineerStaffId } = z.object({ engineerStaffId: z.string().uuid() }).parse(req.body);
  const { data: order } = await db.from("orders").select("id").eq("ref", req.params.ref).maybeSingle();
  if (!order) return res.status(404).json({ error: "Not found" });
  const { data: job } = await db.from("jobs").select("id").eq("order_id", order.id).eq("kind", "install").maybeSingle();
  if (job) await db.from("jobs").update({ engineer_staff_id: engineerStaffId }).eq("id", job.id);
  else await db.from("jobs").insert({ kind: "install", order_id: order.id, engineer_staff_id: engineerStaffId });
  res.json({ ok: true });
});

/** POST /admin/orders/:ref/notify — logs a status-update message to the
 * customer (same notification_log the review-request flow uses). */
adminOrdersRouter.post("/:ref/notify", async (req, res) => {
  const { data: order } = await db.from("orders").select("id, status").eq("ref", req.params.ref).maybeSingle();
  if (!order) return res.status(404).json({ error: "Not found" });
  await db.from("notification_log").insert({ order_id: order.id, channel: "whatsapp", body: `Order ${req.params.ref} status update: ${order.status}` });
  res.json({ ok: true });
});
