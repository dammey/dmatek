"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, btnPrimary, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

export default function ContentPage() {
  const [heroWords, setHeroWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [about, setAbout] = useState("");
  const { say } = useToast();

  useEffect(() => {
    api.get<{ heroWords: string[]; about: string }>("/content").then((d) => {
      setHeroWords(d.heroWords);
      setAbout(d.about);
    });
  }, []);

  async function saveWords(words: string[]) {
    setHeroWords(words);
    await api.put("/admin/content/hero-words", { words });
  }

  function addWord() {
    const v = newWord.trim();
    if (!v) return;
    saveWords([...heroWords, v.endsWith(".") ? v : v + "."]);
    setNewWord("");
  }

  async function saveAbout() {
    await api.put("/admin/content/text", { key: "about", value: about });
    say("Content published to the storefront");
  }

  return (
    <div>
      <PageHeader title="Content" subtitle="Front page words, best sellers and help text" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16 }}>
        <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Hero · &ldquo;Sourced for the ___&rdquo;</span>
          <span style={{ fontSize: 13, color: "#5E6E68" }}>Words rotate every 2.3 seconds on the storefront home page.</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {heroWords.map((w, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F5F1E8", borderRadius: 999, padding: "7px 8px 7px 14px", fontWeight: 700, fontSize: 13.5 }}>
                {w}
                <button type="button" onClick={() => saveWords(heroWords.filter((_, j) => j !== i))} aria-label="Remove" style={{ width: 22, height: 22, borderRadius: "50%", border: 0, background: "#fff", fontSize: 12 }}>
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="e.g. pharmacy." style={{ ...inputStyle, flex: 1 }} />
            <button type="button" onClick={addWord} style={btnPrimary}>
              Add
            </button>
          </div>
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>About page intro</span>
          <label style={labelStyle}>
            <textarea rows={5} value={about} onChange={(e) => setAbout(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </label>
          <button type="button" onClick={saveAbout} style={{ ...btnPrimary, alignSelf: "flex-start" }}>
            Publish content
          </button>
        </Card>
      </div>
    </div>
  );
}
