"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { supabase } from "./supabase-browser";

type AuthContextValue = {
  signedIn: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.localStorage.setItem("ds-token", data.session.access_token);
        setSignedIn(true);
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.localStorage.setItem("ds-token", session.access_token);
        setSignedIn(true);
      } else {
        window.localStorage.removeItem("ds-token");
        setSignedIn(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.session) {
      window.localStorage.setItem("ds-token", data.session.access_token);
      await api.post("/account/link", { fullName, email }, ).catch(() => {});
    }
    return {};
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return <AuthContext.Provider value={{ signedIn, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
