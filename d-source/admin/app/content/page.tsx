"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Data = { heroWords: string[]; bestSellers: string[]; help: Record<string, string>; about: string; promo: string; products: { id: string; name: string; store: string }[] };

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 12 };
const label: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" };
const input: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: "10px 12px", fontSize: 14, background: "#fff", color: "#06382E" };
const area: React.CSSProperties = { ...input, fontSize: 14.5, lineHeight: 1.5, letterSpacing: 0, fontWeight: 500, resize: "vertical" };

/** Content publishes to the storefront: hero words, best sellers, top bar, about and help text. */
export default function ContentPage() {
  const [d, setD] = useState<Data | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [best, setBest] = useState<string[]>(["", "", "", ""]);
  const [text, setText] = useState({ promo: "", about: "", helpDelivery: "" });
  const [heroNew, setHeroNew] = useState("");
  const { say } = useToast();

  useEffect(() => {
    api.get<Data>("/admin/content").then((x) => {
      setD(x);
      setWords(x.heroWords);
      setBest([0, 1, 2, 3].map((i) => x.bestSellers[i] ?? ""));
      setText({ promo: x.promo ?? "", about: x.about ?? "", helpDelivery: x.help?.helpDelivery ?? "" });
    });
  }, []);

  function add() {
    const v = heroNew.trim();
    if (!v) return;
    setWords((w) => [...w, v.endsWith(".") ? v : `${v}.`]);
    setHeroNew("");
  }

  async function publish() {
    await api.put("/admin/content", { heroWords: words, bestSellers: best, ...text });
    say("Content published to the storefront");
  }

  const opts = (d?.products ?? []).map((p) => ({ v: p.id, l: `${p.store === "emporium" ? "For you" : "Business"} · ${p.name}` }));
  const groups: { title: string; fields: [keyof typeof text, string][] }[] = [
    { title: "Top bar and about", fields: [["promo", "TOP BAR LINE"], ["about", "ABOUT PAGE INTRO"]] },
    { title: "Help pages", fields: [["helpDelivery", "DELIVERY PAGE"]] },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: 16, alignItems: "start" }}>
        <section style={card}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Hero · “Sourced for the ___”</span>
          <span style={{ fontSize: 13, color: "#5E6E68" }}>Words rotate every 2.3 seconds. Each opens the kit with the same name.</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {words.map((w, i) => (
              <span key={`${w}-${i}`} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F5F1E8", borderRadius: 999, padding: "7px 8px 7px 14px", fontWeight: 700, fontSize: 13.5 }}>
                {w}
                <button type="button" onClick={() => setWords((x) => x.filter((_, j) => j !== i))} aria-label="Remove" style={{ width: 22, height: 22, borderRadius: "50%", border: 0, background: "#fff", color: "#06382E", fontSize: 12 }}>
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={heroNew} onChange={(e) => setHeroNew(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="e.g. pharmacy." style={{ ...input, flex: 1 }} />
            <button type="button" onClick={add} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "10px 16px", fontWeight: 800, fontSize: 13.5 }}>
              Add
            </button>
          </div>
        </section>
        <section style={card}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Best sellers on the front page</span>
          {best.map((id, i) => (
            <label key={i} style={label}>
              SLOT {i + 1}
              <select value={id} onChange={(e) => setBest((b) => b.map((x, j) => (j === i ? e.target.value : x)))} style={input}>
                <option value="">[ PRODUCT ]</option>
                {opts.map((o) => (
                  <option key={o.v} value={o.v}>
                    {o.l}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </section>
        {groups.map((g) => (
          <section key={g.title} style={card}>
            <span style={{ fontWeight: 800, fontSize: 18 }}>{g.title}</span>
            {g.fields.map(([k, l]) => (
              <label key={k} style={label}>
                {l}
                <textarea rows={3} value={text[k]} onChange={(e) => setText((t) => ({ ...t, [k]: e.target.value }))} style={area} />
              </label>
            ))}
          </section>
        ))}
      </div>
      <button type="button" onClick={publish} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 26px", fontWeight: 800, fontSize: 15 }}>
        Publish content
      </button>
    </>
  );
}
