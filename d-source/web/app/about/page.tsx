"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AboutPage() {
  const [about, setAbout] = useState("");

  useEffect(() => {
    api
      .get<{ about: string }>("/content")
      .then(({ about }) => setAbout(about))
      .catch(() => {});
  }, []);

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px,4.4vw,56px)", letterSpacing: "-0.04em", marginBottom: 20 }}>About D&rsquo;Source</h1>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#3A4A44", marginBottom: 24 }}>
          {about || "Commerce by D’Matek. Genuine, warranty-backed devices and equipment, set up and supported by the same team that builds the connectivity and systems behind it."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 15, color: "#3A4A44" }}>
          <span>D&rsquo;Emporium sells to individuals and homes. D&rsquo;Provision supplies businesses, on account.</span>
          <span>Every device is delivered nationwide and installed by D&rsquo;Matek engineers where booked.</span>
        </div>
        <a href="https://dmatek.ng" style={{ display: "inline-block", marginTop: 28, fontWeight: 800, color: "#06382E", borderBottom: "2px solid #D4A637" }}>
          Visit D&rsquo;Matek ↗
        </a>
      </section>
    </main>
  );
}
