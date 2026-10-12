import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Enquiry backend (handoff v3.6 §Enquiry backend): server-side validation,
// a honeypot and per-IP rate limit against spam, a reference number for the
// visitor, and a notification to the designated owner with every field plus
// the source page and CTA. RESEND_API_KEY / RESEND_TO_EMAIL live only in env.

const LIMITS: Record<string, number> = {
  name: 120,
  organisation: 160,
  phone: 40,
  email: 160,
  org: 80,
  location: 160,
  problem: 160,
  need: 40,
  message: 4000,
  source: 80,
  page: 300,
};

// Best-effort rate limit per server instance: 5 enquiries per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

// D'Foundry (foundry.dmatek.ng) posts its contact form here too. Any
// *.dmatek.ng origin is allowed; preview hosts can be added via the
// comma-separated ENQUIRY_ALLOWED_ORIGINS env var.
function allowedOrigin(origin: string | null) {
  if (!origin) return null;
  if (/^https:\/\/([a-z0-9-]+\.)*dmatek\.ng$/.test(origin)) return origin;
  const extra = (process.env.ENQUIRY_ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  return extra.includes(origin) ? origin : null;
}

function cors(request: Request): Record<string, string> {
  const origin = allowedOrigin(request.headers.get("origin"));
  return origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {};
}

export function OPTIONS(request: Request) {
  const h = cors(request);
  if (!h["Access-Control-Allow-Origin"]) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers: { ...h, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" } });
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** DM-XXXXX: short, unambiguous, quotable on the phone. */
function reference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "DM-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

async function handle(request: Request): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const f: Record<string, string> = {};
  for (const [k, max] of Object.entries(LIMITS)) {
    const v = typeof body[k] === "string" ? (body[k] as string).trim() : "";
    f[k] = v.slice(0, max);
  }
  // Older links and forms sent a single "contact" field.
  const legacy = typeof body.contact === "string" ? body.contact.trim().slice(0, 160) : "";
  if (legacy && !f.phone && !f.email) {
    if (legacy.includes("@")) f.email = legacy;
    else f.phone = legacy;
  }

  // Honeypot: real visitors never see this field. Pretend success to bots.
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true, ref: reference() });

  const fields: Record<string, string> = {};
  if (!f.name) fields.name = "Please tell us your name.";
  if (!f.phone && !f.email) fields.phone = "Add a phone or WhatsApp number, or an email, so we can reply.";
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) fields.email = "That email address doesn’t look right.";
  if (f.phone && !/^[+\d][\d\s()-]{5,}$/.test(f.phone)) fields.phone = "That phone number doesn’t look right.";
  if (Object.keys(fields).length) return NextResponse.json({ error: "Please check the highlighted fields.", fields }, { status: 400 });

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many enquiries from here. Please WhatsApp us instead." }, { status: 429 });

  // RESEND_KEY_TEST is accepted too, for projects that stored the key under that name.
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_KEY_TEST;
  const toEmail = process.env.RESEND_TO_EMAIL;
  if (!apiKey || !toEmail) {
    console.error("Enquiry received but RESEND_API_KEY / RESEND_TO_EMAIL is not configured.");
    return NextResponse.json({ error: "The enquiry form is not configured yet. Please WhatsApp us." }, { status: 503 });
  }

  const ref = reference();
  const row = (label: string, v: string) => `<tr><td style="padding:6px 14px 6px 0;color:#28705A;font-weight:700;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0">${escapeHtml(v || "—").replace(/\n/g, "<br>")}</td></tr>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      // Until dmatek.ng is verified in Resend, set RESEND_FROM to
      // "D’Matek Website <onboarding@resend.dev>" (Resend only delivers that
      // sender to the account owner's own address).
      from: process.env.RESEND_FROM || "D’Matek Website <noreply@dmatek.ng>",
      to: toEmail,
      replyTo: f.email || undefined,
      subject: `${ref} · New enquiry from ${f.name}${f.organisation ? ` (${f.organisation})` : ""}`,
      html: `
        <p style="font-family:Arial,sans-serif;font-size:15px">New enquiry <strong>${ref}</strong>. Status: <strong>New</strong> (track it to qualified, declined, proposal or resolved).</p>
        <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
          ${row("Name", f.name)}
          ${row("Organisation", f.organisation)}
          ${row("Phone / WhatsApp", f.phone)}
          ${row("Email", f.email)}
          ${row("Environment", f.org)}
          ${row("Closest starting point", f.problem)}
          ${row("What they need", f.need)}
          ${row("Location", f.location)}
          ${row("Message", f.message)}
          ${row("Source page", f.page)}
          ${row("Source CTA", f.source)}
        </table>
      `,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("Enquiry send failed:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const res = await handle(request);
  for (const [k, v] of Object.entries(cors(request))) res.headers.set(k, v);
  return res;
}
