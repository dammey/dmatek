import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminStaffRouter = Router();

/** POST /admin/staff/link — called once after a staff member's Supabase
 * Auth sign-in, to attach the auth user to their staff row. Staff rows
 * themselves are created by an Owner via POST /admin/staff (invite). */
adminStaffRouter.post("/link", async (req, res) => {
  const authUserId = req.headers["x-auth-user-id"] as string | undefined;
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  if (!authUserId) return res.status(400).json({ error: "Missing auth user" });
  const { data: staff } = await db.from("staff").select("id, active").is("auth_user_id", null).limit(1).maybeSingle();
  if (!staff) return res.status(404).json({ error: "No unclaimed staff invite for this account" });
  await db.from("staff").update({ auth_user_id: authUserId, last_active_at: new Date().toISOString() }).eq("id", staff.id);
  res.json({ ok: true, email });
});

adminStaffRouter.get("/", requireStaff("Staff and roles"), async (_req, res) => {
  const { data } = await db.from("staff").select("id, name, role, active, last_active_at").order("name");
  res.json({ staff: data });
});

adminStaffRouter.post("/", requireStaff("Staff and roles"), async (req, res) => {
  const body = z.object({ name: z.string(), role: z.enum(["Owner", "Sales", "Warehouse", "Engineer", "Support"]) }).parse(req.body);
  const { data, error } = await db.from("staff").insert({ name: body.name, role: body.role, active: true }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ staff: data });
});

adminStaffRouter.patch("/:id", requireStaff("Staff and roles"), async (req, res) => {
  const body = z.object({ role: z.enum(["Owner", "Sales", "Warehouse", "Engineer", "Support"]).optional(), active: z.boolean().optional() }).parse(req.body);
  const { data: target } = await db.from("staff").select("role").eq("id", req.params.id).maybeSingle();
  if (target?.role === "Owner" && body.active === false) return res.status(400).json({ error: "Owner access can’t be removed" });
  const { error } = await db.from("staff").update(body).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

adminStaffRouter.get("/permissions", requireStaff("Staff and roles"), async (_req, res) => {
  const { data } = await db.from("role_permissions").select("*");
  res.json({ permissions: data });
});

adminStaffRouter.patch("/permissions/:role/:module", requireStaff("Staff and roles"), async (req, res) => {
  const { allowed } = z.object({ allowed: z.boolean() }).parse(req.body);
  if (req.params.role === "Owner") return res.status(400).json({ error: "Owner access can’t be changed" });
  await db.from("role_permissions").update({ allowed }).eq("role", req.params.role).eq("module", req.params.module);
  res.json({ ok: true });
});
