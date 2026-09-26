import { Router } from "express";
import { z } from "zod";
import { withCustomer } from "../auth/middleware.js";
import { db } from "../supabase.js";
import { makeRef } from "../util/ref.js";

export const surveysRouter = Router();
surveysRouter.use(withCustomer);

const surveySchema = z.object({
  organisation: z.string().optional(),
  siteType: z.string().optional(),
  address: z.string(),
  preferredDate: z.string().optional(),
  timeWindow: z.string().optional(),
  contactName: z.string(),
  contact: z.string(),
  purpose: z.string().optional(),
});

/** POST /surveys — free D'Provision site survey booking. */
surveysRouter.post("/", async (req, res) => {
  const body = surveySchema.parse(req.body);
  const ref = makeRef("SV");
  const { error } = await db.from("site_surveys").insert({
    ref,
    customer_id: req.customer?.id ?? null,
    organisation: body.organisation,
    site_type: body.siteType,
    address: body.address,
    preferred_date: body.preferredDate || null,
    time_window: body.timeWindow,
    stage: "requested",
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ref });
});

surveysRouter.get("/:ref", async (req, res) => {
  const { data, error } = await db.from("site_surveys").select("*").eq("ref", req.params.ref).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ survey: data });
});
