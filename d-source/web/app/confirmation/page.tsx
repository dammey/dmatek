"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Receipt, { type ReceiptLine } from "@/components/Receipt";
import { PageTitle, btn, pagePad } from "@/components/ui";
import { api } from "@/lib/api";
import { PROMISE } from "@/lib/promises";
import { StoreText } from "@/lib/settings-context";

type Tracked = { ref: string; placed_at: string; order_lines: ReceiptLine[] };

function ConfirmInner() {
  const ref = useSearchParams().get("ref") ?? "";
  const [order, setOrder] = useState<Tracked | null>(null);
  useEffect(() => {
    if (!ref) return;
    api
      .get<{ order: Tracked }>(`/track/${encodeURIComponent(ref)}`)
      .then(({ order }) => setOrder(order))
      .catch(() => {});
  }, [ref]);

  const date = order ? new Date(order.placed_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : undefined;
  return (
    <main style={{ ...pagePad, boxSizing: "content-box", display: "flex", flexDirection: "column", gap: 22, maxWidth: 820 }}>
      <div>
        <PageTitle>Order confirmed</PageTitle>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          <StoreText k="delivery" />. {PROMISE.podTerms}
        </p>
      </div>
      <Receipt refNo={order?.ref ?? (ref || undefined)} date={date} lines={order?.order_lines ?? []}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/guarantee" style={{ fontWeight: 700, textDecoration: "underline" }}>
            Read the guarantee
          </Link>
          <Link href={ref ? `/track?ref=${encodeURIComponent(ref)}` : "/track"} style={btn("deep", { padding: "10px 16px" })}>
            Track your order
          </Link>
        </div>
      </Receipt>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  );
}
