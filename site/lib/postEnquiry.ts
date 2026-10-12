import { track } from "@/lib/analytics";

/** Sends an enquiry from a business page's own short form to the shared
 * enquiry backend (/api/contact), so it reaches the same owner with the same
 * validation, spam checks and reference number as the main contact form. */
export async function postEnquiry(fields: {
  name: string;
  contact: string;
  location?: string;
  message?: string;
  problem?: string;
  source: string;
}): Promise<string> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...fields, page: window.location.pathname }),
  });
  const json = (await res.json().catch(() => ({}))) as { ref?: string; error?: string };
  if (!res.ok) throw new Error(json.error ?? "Request failed");
  track("form_submit", { form: fields.source, source: fields.source });
  return json.ref ?? "";
}
