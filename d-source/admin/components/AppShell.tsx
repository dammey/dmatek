"use client";

import Sidebar from "@/components/Sidebar";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/auth-context";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { staff, loading } = useAuth();

  if (loading) return null;
  if (!staff) return <SignIn />;

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#F5F1E8", color: "#06382E", minHeight: "100vh", display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <main style={{ padding: "clamp(18px,2.4vw,32px) clamp(18px,2.4vw,36px) 64px", display: "flex", flexDirection: "column", gap: 22 }}>{children}</main>
      </div>
    </div>
  );
}
