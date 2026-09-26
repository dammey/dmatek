import type { NextFunction, Request, Response } from "express";
import { db } from "../supabase.js";

export type StaffContext = { id: string; name: string; role: "Owner" | "Sales" | "Warehouse" | "Engineer" | "Support" };
export type CustomerContext = { id: string; type: "retail" | "business" };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      staff?: StaffContext;
      customer?: CustomerContext;
    }
  }
}

export async function userIdFromBearer(req: Request): Promise<string | null> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length);
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

/** Populates req.customer when the bearer token belongs to a signed-in
 * customer. Does not reject the request if absent — routes decide whether
 * a customer is required (guest checkout is allowed on the storefront). */
export async function withCustomer(req: Request, _res: Response, next: NextFunction) {
  const authUserId = await userIdFromBearer(req);
  if (authUserId) {
    const { data } = await db.from("customers").select("id, type").eq("auth_user_id", authUserId).maybeSingle();
    if (data) req.customer = { id: data.id, type: data.type };
  }
  next();
}

/** Requires a signed-in staff member; 401/403 otherwise. Optionally
 * requires a specific admin module permission via role_permissions. */
export function requireStaff(module?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authUserId = await userIdFromBearer(req);
    if (!authUserId) return res.status(401).json({ error: "Sign in required" });
    const { data: staff } = await db
      .from("staff")
      .select("id, name, role, active")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (!staff || !staff.active) return res.status(403).json({ error: "Not an active staff account" });
    req.staff = { id: staff.id, name: staff.name, role: staff.role };
    if (module && staff.role !== "Owner") {
      const { data: perm } = await db
        .from("role_permissions")
        .select("allowed")
        .eq("role", staff.role)
        .eq("module", module)
        .maybeSingle();
      if (!perm?.allowed) return res.status(403).json({ error: `No access to ${module}` });
    }
    next();
  };
}
