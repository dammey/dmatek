import { Router } from "express";
import { z } from "zod";
import { withCustomer } from "../auth/middleware.js";
import { db } from "../supabase.js";

export const enquiriesRouter = Router();
enquiriesRouter.use(withCustomer);

const enquirySchema = z.object({
  type: z.enum(["Repair collection", "Pilot interest", "WhatsApp order", "General"]).default("General"),
  fromName: z.string().optional(),
  fromContact: z.string().optional(),
  message: z.string(),
});

/** POST /enquiries — the storefront's catch-all: repairs, pilot interest
 * (device care plan demand log), WhatsApp order intents, general asks. */
enquiriesRouter.post("/", async (req, res) => {
  const body = enquirySchema.parse(req.body);
  const { error } = await db.from("enquiries").insert({
    type: body.type,
    from_name: body.fromName,
    from_contact: body.fromContact,
    customer_id: req.customer?.id ?? null,
    message: body.message,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ok: true });
});
