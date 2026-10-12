"use client";

import { track } from "@dmatek/brand";
import { useState, type FormEvent } from "react";
import { CONTACT, DMATEK_URL } from "@/lib/sites";

const SISTERS = [
  { verb: "RUN IT", name: "D’Matek Cloud", href: `${DMATEK_URL}/cloud` },
  { verb: "CONNECT IT", name: "D’Matek Infrastructure", href: `${DMATEK_URL}/infrastructure` },
  { verb: "PHYSICAL WORLD", name: "IléMesh", href: `${DMATEK_URL}/ilemesh` },
  { verb: "MANAGE IT", name: "D’Matek Assurance", href: `${DMATEK_URL}/assurance` },
];

type Status = "idle" | "sending" | "sent" | "error";

const mono = "var(--font-plex-mono),monospace";
const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: ".12em", color: "#28705A", fontFamily: mono };
const field = (bad: boolean): React.CSSProperties => ({
  background: "#FFFFFF",
  border: `2px solid ${bad ? "#B3261E" : "#06382E"}`,
  borderRadius: 999,
  padding: "18px 26px",
  fontFamily: "inherit",
  fontSize: "clamp(17px,1.6vw,20px)",
  fontWeight: 600,
  color: "#06382E",
  outline: "none",
});
const errText: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: "#B3261E" };

/** "Bring the problem." (Hero v2): name, contact and the problem in a
 * sentence, sent to D'Matek's shared enquiry backend on the main site. */
export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [tried, setTried] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [need, setNeed] = useState("");
  const [ref, setRef] = useState("");
  const [started, setStarted] = useState(false);
  const eName = tried && !name.trim();
  const eContact = tried && !contact.trim();

  const start = () => {
    if (started) return;
    setStarted(true);
    track("form_start", { form: "foundry", source: "foundry_contact" });
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTried(true);
    if (!name.trim() || !contact.trim()) {
      e.currentTarget.querySelector<HTMLInputElement>(!name.trim() ? "#f-name" : "#f-contact")?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`${DMATEK_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message: need, problem: "D’Foundry", source: "foundry_contact", page: location.href }),
      });
      const json = (await res.json().catch(() => ({}))) as { ref?: string };
      if (!res.ok) throw new Error("failed");
      setRef(json.ref ?? "");
      setStatus("sent");
      track("form_submit", { form: "foundry", source: "foundry_contact" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="start" data-screen-label="Contact" style={{ background: "#F5F1E8", color: "#06382E", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px) 28px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
        <h2 data-rv="rise" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(72px,14vw,260px)", lineHeight: 0.82, letterSpacing: "-.05em" }}>
          Bring the{" "}
          <span style={{ display: "block", fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.03em", color: "#28705A" }}>problem.</span>
        </h2>

        {(status === "idle" || status === "sending") && (
          <form onSubmit={submit} onFocus={start} noValidate style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 260 }}>
                <label htmlFor="f-name" style={label}>YOUR NAME</label>
                <input id="f-name" type="text" autoComplete="name" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-invalid={eName || undefined} aria-describedby={eName ? "e-name" : undefined} style={field(eName)} />
                {eName && <span id="e-name" style={errText}>This one is needed so we can reach you.</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 260 }}>
                <label htmlFor="f-contact" style={label}>EMAIL OR PHONE</label>
                <input id="f-contact" type="text" autoComplete="email" maxLength={160} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Email or phone number" aria-invalid={eContact || undefined} aria-describedby={eContact ? "e-contact" : undefined} style={field(eContact)} />
                {eContact && <span id="e-contact" style={errText}>This one is needed so we can reach you.</span>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="f-need" style={label}>THE PROBLEM, IN ONE SENTENCE</label>
              <input id="f-need" type="text" maxLength={600} value={need} onChange={(e) => setNeed(e.target.value)} placeholder="Describe it in one sentence" style={{ ...field(false), padding: "20px 26px", fontSize: "clamp(17px,1.6vw,22px)" }} />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              data-track="form_submit_foundry"
              className="df-send-btn"
              style={{ alignSelf: "flex-start", background: "#06382E", color: "#F5F1E8", border: 0, borderRadius: 999, padding: "22px 30px", fontSize: 16, fontWeight: 800, whiteSpace: "nowrap", cursor: "pointer", transition: "transform .4s cubic-bezier(.34,1.56,.64,1)" }}
            >
              {status === "sending" ? "Sending…" : "Send it →"}
            </button>
          </form>
        )}

        {status === "sent" && (
          <div role="status" style={{ alignSelf: "flex-start", background: "#D4A637", borderRadius: 32, padding: "18px 28px", fontWeight: 700, fontSize: "clamp(17px,1.6vw,22px)", maxWidth: 760 }}>
            Got it. Someone from D&rsquo;Matek will read it properly and come back to you.{ref && <> Your reference is {ref}.</>}
          </div>
        )}

        {status === "error" && (
          <div role="alert" style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 12, border: "2px solid #06382E", borderRadius: 32, padding: "22px 26px", maxWidth: 640 }}>
            <span style={{ fontWeight: 800, fontSize: 20 }}>That didn&rsquo;t send.</span>
            <span style={{ fontSize: 17, lineHeight: 1.55 }}>Nothing was lost. Try again, or message us on WhatsApp.</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button type="button" onClick={() => setStatus("idle")} className="df-send-btn" style={{ background: "#06382E", color: "#F5F1E8", border: 0, borderRadius: 999, padding: "14px 24px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                Try again
              </button>
              <a href={CONTACT.whatsappHref} data-track="whatsapp_click" className="df-sister-link" style={{ border: "2px solid #06382E", borderRadius: 999, padding: "12px 22px", fontWeight: 800, fontSize: 15 }}>
                WhatsApp us
              </a>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px 28px", flexWrap: "wrap", fontFamily: mono, fontSize: 13, letterSpacing: ".08em", fontWeight: 600 }}>
          <a href={CONTACT.phoneHref} data-track="call_click">{CONTACT.phoneDisplay}</a>
          <a href={`mailto:${CONTACT.email}`} data-track="email_click">{CONTACT.email}</a>
          <a href={CONTACT.whatsappHref} data-track="whatsapp_click">WHATSAPP</a>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SISTERS.map((x) => (
            <a key={x.name} href={x.href} className="df-sister-link" style={{ display: "flex", gap: 10, alignItems: "center", border: "2px solid #06382E", borderRadius: 999, padding: "12px 20px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: "#86660F" }}>{x.verb}</span>
              {x.name} &#8599;
            </a>
          ))}
        </div>

        <footer style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderTop: "2px solid #06382E", paddingTop: 20, fontFamily: mono, fontSize: 12, letterSpacing: ".1em" }}>
          <span style={{ whiteSpace: "nowrap" }}>D&rsquo;FOUNDRY IS A D&rsquo;MATEK BUSINESS</span>
          <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
            <a href={`mailto:${CONTACT.email}`}>HELLO@DMATEK.NG</a>
            <a href={DMATEK_URL}>D&rsquo;MATEK.NG &#8599;</a>
          </span>
        </footer>
      </div>
      <style jsx global>{`
        .df-send-btn:hover:not(:disabled) {
          background: #d4a637;
          color: #06382e;
          transform: rotate(-3deg) scale(1.05);
        }
        .df-sister-link:hover {
          background: #06382e;
          color: #f5f1e8;
        }
      `}</style>
    </section>
  );
}
