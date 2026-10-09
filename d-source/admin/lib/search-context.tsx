"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState } from "react";

const SearchContext = createContext<{ q: string; setQ: (q: string) => void }>({ q: "", setQ: () => {} });

/** The header search box. Like the prototype, switching module clears it. */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState({ path: pathname, q: "" });
  const q = state.path === pathname ? state.q : "";
  return <SearchContext.Provider value={{ q, setQ: (v) => setState({ path: pathname, q: v }) }}>{children}</SearchContext.Provider>;
}

export const useSearch = () => useContext(SearchContext);
