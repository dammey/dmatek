"use client";

import { createContext, useContext, useState } from "react";

const ToastContext = createContext<{ toast: string; say: (m: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState("");

  function say(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  }

  return (
    <ToastContext.Provider value={{ toast, say }}>
      {children}
      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 26,
            transform: "translateX(-50%)",
            zIndex: 200,
            background: "#06382E",
            color: "#F5F1E8",
            borderRadius: 999,
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 14px 40px rgba(0,0,0,.2)",
          }}
        >
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
