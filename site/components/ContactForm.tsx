"use client";

import { useState, type FormEvent } from "react";
import { problemOptions } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const formShell =
    "rounded-[clamp(26px,3.4vw,48px)] border border-cream/16 p-[clamp(26px,3.4vw,46px)] backdrop-blur-md";

  if (status === "sent") {
    return (
      <div className={formShell} style={{ background: "rgba(3,42,34,0.7)" }}>
        <div style={{ animation: "dm-rise .5s cubic-bezier(.2,.8,.2,1) both" }}>
          <span className="mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-gold text-[24px] font-extrabold text-forest">
            &#10003;
          </span>
          <p className="mb-2.5 text-[22px] font-bold text-cream">Thank you. We&rsquo;ve got it.</p>
          <p className="m-0 text-[15.5px] leading-[1.7] text-cream/82">
            Someone will read this properly and come back to you within four hours.
          </p>
        </div>
      </div>
    );
  }

  const fieldClass =
    "rounded-full border border-cream/18 px-5.5 py-3.75 text-[16.5px] text-cream outline-none focus:border-gold focus:bg-cream/10";

  return (
    <form onSubmit={handleSubmit} className={`${formShell} flex flex-col gap-5.5`} style={{ background: "rgba(3,42,34,0.7)" }}>
      <div className="flex flex-col gap-2">
        <label htmlFor="f-name" className="text-[11.5px] font-bold tracking-[0.14em] text-gold">
          NAME
        </label>
        <input id="f-name" name="name" type="text" required className={fieldClass} style={{ background: "rgba(245,241,232,0.06)" }} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="f-email" className="text-[11.5px] font-bold tracking-[0.14em] text-gold">
          EMAIL
        </label>
        <input id="f-email" name="email" type="email" required className={fieldClass} style={{ background: "rgba(245,241,232,0.06)" }} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="f-problem" className="text-[11.5px] font-bold tracking-[0.14em] text-gold">
          CLOSEST STARTING POINT
        </label>
        <select id="f-problem" name="problem" className={fieldClass} style={{ background: "#043028" }}>
          {problemOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="f-msg" className="text-[11.5px] font-bold tracking-[0.14em] text-gold">
          WHAT&rsquo;S HAPPENING?
        </label>
        <textarea
          id="f-msg"
          name="message"
          rows={5}
          className="resize-y rounded-[26px] border border-cream/18 px-5.5 py-4 text-[16.5px] leading-[1.65] text-cream outline-none focus:border-gold focus:bg-cream/10"
          style={{ background: "rgba(245,241,232,0.06)" }}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 cursor-pointer rounded-full bg-gold px-6.5 py-4.75 text-[15px] font-bold tracking-[0.04em] text-forest transition-transform hover:-translate-y-1 hover:bg-cream hover:shadow-[0_16px_34px_rgba(0,0,0,0.25)] disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send it to us →"}
      </button>
      {status === "error" && (
        <p className="m-0 text-[13.5px] leading-[1.6] text-gold">
          Something went wrong sending that &mdash; please try again, or reach us directly.
        </p>
      )}
      <p className="m-0 text-[13.5px] leading-[1.6] text-cream/62">
        Problem-solving starts here. No sales sequence, no qualification call.
      </p>
    </form>
  );
}
