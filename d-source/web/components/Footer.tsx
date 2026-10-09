"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { StoreMail, StoreTel } from "./StoreLinks";
import { Adire, btn, mono } from "./ui";
import { config } from "@/lib/config";
import { PROMISE } from "@/lib/promises";
import { StoreText, WhatsAppLink } from "@/lib/settings-context";

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
          <span style={{ alignSelf: "flex-start" }}>
            <Logo size="lg" />
          </span>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: ".18em", color: "var(--m)" }}>TECH YOU NEED, DELIVERED.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", justifyContent: "space-between", fontSize: 14, lineHeight: 1.8 }}>
            <div>
              <b>Commerce by D’Matek</b>
              <br />
              Lagos, Nigeria
            </div>
            <div>
              Phone · <StoreTel style={{ color: "inherit" }} />
              <br />
              Email · <StoreMail style={{ color: "inherit" }} />
              <br />
              WhatsApp ·{" "}
              <WhatsAppLink style={{ color: "inherit", textDecoration: "underline" }} />
            </div>
            <div>
              Replies {PROMISE.hours}
              <br />
              <StoreText k="delivery" />
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
