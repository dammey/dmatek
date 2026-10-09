import type { NextFunction, Request, Response } from "express";
import { db } from "../supabase.js";

/** Readable lines for the Staff and roles › Activity log, by route. */
const RULES: [RegExp, string, (m: RegExpMatchArray) => string][] = [
  [/^\/orders\/([^/]+)\/status$/, "PATCH", (m) => `Moved order ${m[1]} on`],
  [/^\/orders\/([^/]+)\/checked/, "", (m) => `Saved checked results for ${m[1]}`],
  [/^\/quotes\/([^/]+)$/, "PATCH", (m) => `Priced quote ${m[1]}`],
  [/^\/payments\/[^/]+\/confirm$/, "PATCH", () => "Confirmed a payment received"],
  [/^\/payments\/[^/]+\/refund$/, "PATCH", () => "Refunded a payment"],
  [/^\/invoices\/[^/]+\/mark-paid$/, "PATCH", () => "Marked an invoice paid"],
  [/^\/returns\/([^/]+)$/, "PATCH", (m) => `Resolved return ${m[1]}`],
  [/^\/repairs\/([^/]+)\/(\w+)$/, "", (m) => `Repair ${m[1]}: ${m[2]}`],
  [/^\/products\/bulk$/, "POST", () => "Imported a bulk upload"],
  [/^\/products\/[^/]+$/, "PATCH", () => "Changed a product"],
  [/^\/products$/, "POST", () => "Added a product"],
  [/^\/inventory\/[^/]+\/receive$/, "POST", () => "Received stock"],
  [/^\/suppliers\/pos\/([^/]+)\/advance$/, "PATCH", (m) => `Advanced ${m[1]}`],
  [/^\/accounts\/[^/]+\/approve$/, "PATCH", () => "Approved a business account for 30-day invoice"],
  [/^\/accounts\/[^/]+\/decline$/, "PATCH", () => "Declined a business account"],
  [/^\/reviews\/[^/]+\/(approve|reject)$/, "PATCH", (m) => (m[1] === "approve" ? "Approved a review" : "Rejected a review")],
  [/^\/categories/, "", () => "Changed categories"],
  [/^\/kits/, "", () => "Changed a kit"],
  [/^\/content/, "", () => "Published content"],
  [/^\/zones/, "", () => "Changed delivery zones"],
  [/^\/notifications/, "", () => "Changed a notification"],
  [/^\/settings/, "", () => "Saved settings"],
  [/^\/staff\/permissions/, "", () => "Changed role permissions"],
  [/^\/staff\/[^/]+$/, "PATCH", () => "Changed a staff member"],
  [/^\/staff$/, "POST", () => "Invited a staff member"],
  [/^\/discounts/, "", () => "Changed discounts"],
];

/** Records successful admin writes (not GETs) once the response is sent. */
export function activityLog(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET") return next();
  res.on("finish", () => {
    if (res.statusCode >= 400 || !req.staff) return;
    const path = req.path;
    for (const [re, method, text] of RULES) {
      const m = path.match(re);
      if (m && (!method || method === req.method)) {
        void db.from("admin_log").insert({ staff_id: req.staff.id, who: req.staff.name, text: text(m) });
        return;
      }
    }
  });
  next();
}
