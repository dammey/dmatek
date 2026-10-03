"use client";

import { createContext, useContext, useState } from "react";

type KitOverlayContextValue = {
  openKey: string | null;
  openKit: (key: string) => void;
  closeKit: () => void;
};

const KitOverlayContext = createContext<KitOverlayContextValue | null>(null);

export function KitOverlayProvider({ children }: { children: React.ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <KitOverlayContext.Provider
      value={{
        openKey,
        openKit: (key) => setOpenKey(key),
        closeKit: () => setOpenKey(null),
      }}
    >
      {children}
    </KitOverlayContext.Provider>
  );
}

export function useKitOverlay() {
  const ctx = useContext(KitOverlayContext);
  if (!ctx) throw new Error("useKitOverlay must be used within KitOverlayProvider");
  return ctx;
}
