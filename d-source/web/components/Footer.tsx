"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Adire, btn, mono } from "./ui";
import { config } from "@/lib/config";
import { PROMISE } from "@/lib/promises";

/** "Can't find it? We'll source it" strip, on every page except the request itself. */
function SourceStrip() {
  return (
    <div style={{ background: "var(--t)", padding: "18px var(--gut)", display: "flex", flexWrap: "wrap", gap: "10px 18px", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: 700, fontSize: 15 }}>Can’t find it? We’ll source it. {PROMISE.replyPersonal}</span>
      <Link href="/source" style={btn("buy", { padding: "11px 18px" })}>
        Request an item
      </Link>
    </div>
  );
}

const LINKS: [string, string][] = [
  ["ACCOUNT", "/account"],
  ["TRACK ORDER", "/track"],
  ["GUARANTEE", "/guarantee"],
  ["TERMS", "/terms"],
  ["HELP", "/help"],
];

export default function Footer() {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/source" && <SourceStrip />}
      <footer style={{ background: "var(--t)", color: "var(--d)", borderTop: "1px solid var(--line)" }}>
        {config.adire && <Adire h={22} />}
        <div style={{ padding: "clamp(24px,4vw,40px) var(--gut) 20px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontWeight: 800, fontSize: "clamp(44px,12vw,120px)", lineHeight: 0.85, letterSpacing: "-.07em", color: "var(--m)" }}>D’Source</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", justifyContent: "space-between", fontSize: 14, lineHeight: 1.8 }}>
            <div>
              <b>Commerce by D’Matek</b>
              <br />
              Lagos, Nigeria
            </div>
            <div>
              Phone · <a href={`tel:${PROMISE.phone}`} style={{ color: "inherit" }}>{PROMISE.phone}</a>
              <br />
              Email · <a href={`mailto:${PROMISE.email}`} style={{ color: "inherit" }}>{PROMISE.email}</a>
              <br />
              WhatsApp ·{" "}
              <a href={PROMISE.whatsapp} style={{ color: "inherit", textDecoration: "underline" }}>
                {PROMISE.phone}
              </a>
            </div>
            <div>
              Replies {PROMISE.hours}
              <br />
              {PROMISE.delivery}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", justifyContent: "space-between", ...mono, letterSpacing: ".12em", color: "var(--mutedMono)" }}>
            <span>D’SOURCE · PART OF D’MATEK</span>
            <span style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {LINKS.map(([l, h]) => (
                <Link key={h} href={h} style={{ color: "inherit", textDecoration: "underline" }}>
                  {l}
                </Link>
              ))}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
