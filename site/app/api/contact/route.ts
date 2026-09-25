import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const contact = typeof body.contact === "string" ? body.contact.trim() : "";
  const org = typeof body.org === "string" ? body.org.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const problem = typeof body.problem === "string" ? body.problem.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const outcome = typeof body.outcome === "string" ? body.outcome.trim() : "";
  const pilotAsk = typeof body.pilotAsk === "string" ? body.pilotAsk.trim() : "";

  if (!name || !contact) {
    return NextResponse.json({ error: "Name and email or phone are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;

  if (!apiKey || !toEmail) {
    console.error(
      "Contact form submission received but RESEND_API_KEY / RESEND_TO_EMAIL is not configured.",
    );
    return NextResponse.json(
      { error: "Contact form is not yet configured. Please try again later." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  // Pilot demand log: every enquiry that arrived carrying pilot interest is
  // recorded by item + closest starting point (the "environment" pre-fill),
  // per the pilot demand log requirement in the v3.1 handoff.
  if (pilotAsk) {
    console.log("Pilot enquiry:", { items: pilotAsk, closestStartingPoint: problem || null, name });
  }

  try {
    const { error } = await resend.emails.send({
      from: "D’Matek Website <noreply@dmatek.ng>",
      to: toEmail,
      replyTo: contact.includes("@") ? contact : undefined,
      subject: pilotAsk
        ? `New pilot enquiry from ${name} — D’Matek website`
        : `New enquiry from ${name} — D’Matek website`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email or phone:</strong> ${escapeHtml(contact)}</p>
        <p><strong>Organisation type:</strong> ${escapeHtml(org || "—")}</p>
        <p><strong>Location:</strong> ${escapeHtml(location || "—")}</p>
        <p><strong>Closest starting point:</strong> ${escapeHtml(problem || "—")}</p>
        ${pilotAsk ? `<p><strong>Pilot interest:</strong> ${escapeHtml(pilotAsk)}</p>` : ""}
        <p><strong>What they're trying to solve:</strong></p>
        <p>${escapeHtml(message || "—").replace(/\n/g, "<br>")}</p>
        <p><strong>What a good outcome looks like:</strong></p>
        <p>${escapeHtml(outcome || "—").replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
