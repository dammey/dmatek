"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONTACT, NOT_SURE_OPTION, entryPoints, liveEnvironments, needOptions, orgOptions } from "@/lib/content";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

const problemOptions = [NOT_SURE_OPTION, ...entryPoints.map((e) => e.title), ...liveEnvironments.map((v) => v.name)];

export type ContactFormProps = {
  initialTopic?: string;
  initialOrg?: string;
  initialNeed?: string;
  initialMessage?: string;
  /** The CTA that opened the form (e.g. home_finder, env_hospitality). */
  source?: string;
};

/** The one enquiry form behind every "Tell us what you need" button. Context
 * arrives prefilled from the page that sent the visitor. */
export default function ContactForm({ initialTopic, initialOrg, initialNeed, initialMessage, source }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [ref, setRef] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [problem, setProblem] = useState(initialTopic && problemOptions.includes(initialTopic) ? initialTopic : NOT_SURE_OPTION);
  const [org, setOrg] = useState(initialOrg && orgOptions.includes(initialOrg) ? initialOrg : orgOptions[0]);
  const [need, setNeed] = useState(initialNeed && needOptions.includes(initialNeed) ? initialNeed : "Not sure");
  const [message, setMessage] = useState(initialMessage ?? "");
  const started = useRef(false);
  // Developer enquiries (Internet-Ready Homes) also ask how big the project is and how far along it is.
  const developer = !!source && (source.startsWith("irh") || source === "home_finder_developer");

  function onStart() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form: "enquiry", source: source ?? "contact" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = "Please tell us your name.";
    if (!data.phone?.trim() && !data.email?.trim()) errs.phone = "Add a phone or WhatsApp number, or an email, so we can reply.";
    if (data.email?.trim() && !/^\S+@\S+\.\S+$/.test(data.email.trim())) errs.email = "That email address doesn’t look right.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: source ?? "contact", page: window.location.pathname + window.location.search }),
      });
      const json = (await res.json().catch(() => ({}))) as { ref?: string; error?: string; fields?: Record<string, string> };
      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        throw new Error(json.error ?? "Request failed");
      }
      setRef(json.ref ?? "");
      setStatus("sent");
      track("form_submit", { form: "enquiry", source: source ?? "contact" });
    } catch {
      setStatus("error");
    }
  }

  const formShell = "rounded-[clamp(26px,3.4vw,48px)] border border-cream/16 p-[clamp(26px,3.4vw,46px)] backdrop-blur-md";

  if (status === "sent") {
    return (
      <div className={formShell} style={{ background: "rgba(3,42,34,0.7)" }} role="status">
        <div style={{ animation: "dm-rise .5s cubic-bezier(.2,.8,.2,1) both" }}>
          <span className="mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-gold text-[24px] font-extrabold text-forest" aria-hidden="true">
            &#10003;
          </span>
          <p className="mb-2.5 text-[22px] font-bold text-cream">Thank you. We&rsquo;ve got it.</p>
          <p className="mb-4.5 text-[15.5px] leading-[1.7] text-cream/82">
            Someone will read this properly and come back to you.
            {ref && (
              <>
                {" "}
                Your reference is <strong className="text-gold">{ref}</strong>.
              </>
            )}
          </p>
          <p className="mb-2.5 text-[11px] font-bold tracking-[0.16em] text-gold">WHAT HAPPENS NEXT</p>
          <ol className="m-0 pl-5 text-[15px] leading-[1.8] text-cream/82">
            <li>We read what you sent.</li>
            <li>We contact you to talk it through.</li>
            <li>We tell you what it would take and what it would cost.</li>
          </ol>
        </div>
      </div>
    );
  }

  const fieldClass = "rounded-full border border-cream/18 px-5.5 py-3.75 text-[16.5px] text-cream outline-none focus:border-gold focus:bg-cream/10 aria-[invalid=true]:border-[#F2C879]";
  const labelClass = "text-[11.5px] font-bold tracking-[0.14em] text-gold";
  const glass = { background: "rgba(245,241,232,0.06)" };
  const select = { background: "#043028" };
  const err = (k: string) =>
    errors[k] ? (
      <p id={`e-${k}`} className="m-0 text-[13.5px] text-[#F2C879]">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `e-${k}` : undefined });

  return (
    <form onSubmit={handleSubmit} onFocus={onStart} noValidate className={`${formShell} flex flex-col gap-5`} style={{ background: "rgba(3,42,34,0.7)" }}>
      {/* Spam trap: invisible to people, filled in by bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-hp">Leave this empty</label>
        <input id="f-hp" name="hp_check" type="text" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore="true" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="f-name" className={labelClass}>NAME</label>
          <input id="f-name" name="name" type="text" required autoComplete="name" maxLength={120} className={fieldClass} style={glass} {...a11y("name")} />
          {err("name")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="f-orgname" className={labelClass}>ORGANISATION (OPTIONAL)</label>
          <input id="f-orgname" name="organisation" type="text" autoComplete="organization" maxLength={160} className={fieldClass} style={glass} />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="f-phone" className={labelClass}>PHONE OR WHATSAPP</label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" placeholder="0705 807 1768" maxLength={40} className={fieldClass} style={glass} {...a11y("phone")} />
          {err("phone")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="f-email" className={labelClass}>EMAIL</label>
          <input id="f-email" name="email" type="email" autoComplete="email" placeholder="name@company.com" maxLength={160} className={fieldClass} style={glass} {...a11y("email")} />
          {err("email")}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="f-org" className={labelClass}>ENVIRONMENT</label>
          <select id="f-org" name="org" value={org} onChange={(e) => setOrg(e.target.value)} className={fieldClass} style={select}>
            {orgOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="f-loc" className={labelClass}>PROJECT LOCATION (OPTIONAL)</label>
          <input id="f-loc" name="location" type="text" placeholder="City or site" maxLength={160} className={fieldClass} style={glass} />
        </div>
      </div>

      {developer && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="f-units" className={labelClass}>NUMBER OF HOMES OR UNITS</label>
            <input id="f-units" name="units" type="text" inputMode="numeric" placeholder="For example 40" maxLength={20} className={fieldClass} style={glass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="f-stage" className={labelClass}>CONSTRUCTION STAGE</label>
            <select id="f-stage" name="stage" defaultValue="Not sure" className={fieldClass} style={select}>
              {["Planning", "Rough-in (walls being framed)", "Finishing (after plastering)", "Already built", "Not sure"].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="f-problem" className={labelClass}>CLOSEST STARTING POINT</label>
          <select id="f-problem" name="problem" value={problem} onChange={(e) => setProblem(e.target.value)} className={fieldClass} style={select}>
            {problemOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="f-need" className={labelClass}>WHAT DO YOU NEED?</label>
          <select id="f-need" name="need" value={need} onChange={(e) => setNeed(e.target.value)} className={fieldClass} style={select}>
            {needOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="f-msg" className={labelClass}>DESCRIBE THE PROBLEM IN YOUR OWN WORDS</label>
        <textarea
          id="f-msg"
          name="message"
          rows={4}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-y rounded-[26px] border border-cream/18 px-5.5 py-4 text-[16.5px] leading-[1.65] text-cream outline-none focus:border-gold focus:bg-cream/10"
          style={glass}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 cursor-pointer whitespace-nowrap rounded-full bg-gold px-6.5 py-4.75 text-[15px] font-bold tracking-[0.04em] text-forest transition-transform hover:-translate-y-1 hover:bg-cream hover:shadow-[0_16px_34px_rgba(0,0,0,0.25)] disabled:opacity-70"
        >
          {status === "sending" ? "Sending…" : "Send it to us →"}
        </button>
        <a
          href={CONTACT.whatsappHref}
          data-track="whatsapp_click"
          className="mt-1 whitespace-nowrap rounded-full border border-cream/35 px-6.5 py-4.5 text-[15px] font-bold text-cream hover:border-gold hover:text-gold"
        >
          Or WhatsApp us
        </a>
      </div>
      {status === "error" && (
        <p role="alert" className="m-0 rounded-[18px] px-4.5 py-3.5 text-[14.5px] leading-[1.6] text-[#F2C879]" style={{ background: "rgba(242,200,121,0.1)" }}>
          We couldn&rsquo;t send that. Your answers are still here. Please try again, or WhatsApp us on {CONTACT.phoneDisplay}.
        </p>
      )}
      <p className="m-0 text-[13.5px] leading-[1.6] text-cream/62">
        You don&rsquo;t need to know which technology it needs. Tell us the problem in your own words.
      </p>
    </form>
  );
}
