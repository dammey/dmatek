"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Listing from "@/components/Listing";

function SearchInner() {
  const q = useSearchParams().get("q") ?? "";
  const router = useRouter();
  return <Listing q={q || undefined} onClearQ={() => router.push("/shop")} />;
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
