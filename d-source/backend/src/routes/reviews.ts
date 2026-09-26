import { Router } from "express";
import { z } from "zod";
import { withCustomer } from "../auth/middleware.js";
import { db } from "../supabase.js";

export const reviewsRouter = Router();
reviewsRouter.use(withCustomer);

/** GET /reviews/product/:productId — approved reviews only; the pending
 * ones only ever appear to the reviewer (via /account/reviews) or staff. */
reviewsRouter.get("/product/:productId", async (req, res) => {
  const { data, error } = await db
    .from("reviews")
    .select("id, stars, title, body, reviewer_name, created_at, order_id")
    .eq("product_id", req.params.productId)
    .eq("state", "approved")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ reviews: data, pendingNote: "Reviews only show once checked against a real D’Source purchase." });
});

const reviewSchema = z.object({
  productId: z.string().uuid(),
  stars: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string(),
  reviewerName: z.string().optional(),
  orderRef: z.string().optional(),
});

reviewsRouter.post("/", async (req, res) => {
  const body = reviewSchema.parse(req.body);
  let orderId: string | null = null;
  if (body.orderRef) {
    const { data } = await db.from("orders").select("id").eq("ref", body.orderRef).maybeSingle();
    orderId = data?.id ?? null;
  }
  const { error } = await db.from("reviews").insert({
    product_id: body.productId,
    order_id: orderId,
    customer_id: req.customer?.id ?? null,
    stars: body.stars,
    title: body.title,
    body: body.body,
    reviewer_name: body.reviewerName ?? "D’Source customer",
    state: "pending",
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ok: true });
});
