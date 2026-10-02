"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { supabase } from "./supabase-browser";

export type StaffRole = "Owner" | "Sales" | "Warehouse" | "Engineer" | "Support";
export type Staff = { id: string; name: string; role: StaffRole };

type AuthContextValue = {
  staff: Staff | null;
  modules: string[];
  loading: boolean;
  error: string;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  can: (module: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMe() {
    try {
      const { staff, modules } = await api.get<{ staff: Staff; modules: string[] }>("/admin/staff/me");
      setStaff(staff);
      setModules(modules);
      setError("");
    } catch (e) {
      setStaff(null);
      setModules([]);
      if (e instanceof ApiError && e.status === 403) setError(e.message);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        window.localStorage.setItem("ds-staff-token", data.session.access_token);
        await loadMe();
      }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        window.localStorage.setItem("ds-staff-token", session.access_token);
        await loadMe();
      } else {
        window.localStorage.removeItem("ds-staff-token");
        setStaff(null);
        setModules([]);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    try {
      await api.post("/admin/staff/link", { email });
    } catch {
      // Already linked from a previous sign-in — fine.
    }
    await loadMe();
    return {};
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function can(module: string) {
    return staff?.role === "Owner" || modules.includes(module);
  }

  return <AuthContext.Provider value={{ staff, modules, loading, error, signIn, signOut, can }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
