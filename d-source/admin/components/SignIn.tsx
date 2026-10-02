"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { btnPrimary, inputStyle } from "./ui";

export default function SignIn() {
  const { signIn, error: accessError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = await signIn(email, password);
    if (result.error) setError(result.error);
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F1E8" }}>
      <form onSubmit={submit} style={{ width: "min(380px,90vw)", display: "flex", flexDirection: "column", gap: 14 }}>
        <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em", color: "#06382E" }}>D&rsquo;Source Admin</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Staff email" style={inputStyle} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={inputStyle} />
        {(error || accessError) && <p style={{ color: "#B42318", fontSize: 14, margin: 0 }}>{error || accessError}</p>}
        <button type="submit" style={btnPrimary}>
          Sign in →
        </button>
      </form>
    </main>
  );
}
