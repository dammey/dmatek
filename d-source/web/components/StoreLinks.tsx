"use client";

import { useStore } from "@/lib/settings-context";

/** Phone and email links to the numbers published in Admin › Settings. */
export function StoreTel({ style }: { style?: React.CSSProperties }) {
  const s = useStore();
  return (
    <a href={`tel:${s.phone.replace(/\s/g, "")}`} style={style}>
      {s.phone}
    </a>
  );
}

export function StoreMail({ style }: { style?: React.CSSProperties }) {
  const s = useStore();
  return (
    <a href={`mailto:${s.email}`} style={style}>
      {s.email}
    </a>
  );
}
