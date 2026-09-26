"use client";

import { createContext, useContext, useState } from "react";

export type FlowKind = "checkout" | "whatsapp" | "enquiry" | "quote" | "account" | "review" | null;

type FlowContextValue = {
  flow: FlowKind;
  note: string;
  meta: Record<string, unknown>;
  startFlow: (flow: Exclude<FlowKind, null>, note?: string, meta?: Record<string, unknown>) => void;
  closeFlow: () => void;
};

const FlowContext = createContext<FlowContextValue | null>(null);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [flow, setFlow] = useState<FlowKind>(null);
  const [note, setNote] = useState("");
  const [meta, setMeta] = useState<Record<string, unknown>>({});

  return (
    <FlowContext.Provider
      value={{
        flow,
        note,
        meta,
        startFlow: (f, n = "", m = {}) => {
          setFlow(f);
          setNote(n);
          setMeta(m);
        },
        closeFlow: () => setFlow(null),
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within FlowProvider");
  return ctx;
}
