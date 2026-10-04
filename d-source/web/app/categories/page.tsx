"use client";

import Link from "next/link";
import { CategoryGroup } from "@/components/CategoryGroup";

export default function CategoriesPage() {
  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D&rsquo;Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>&rsaquo;</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>All categories</span>
      </div>
      <section
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "clamp(20px,3vh,36px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(32px,5vh,56px)",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>All categories</h1>
          <p style={{ margin: 0, maxWidth: "44em", fontSize: 17, lineHeight: 1.6, color: "#3A4A44" }}>Every category in D&rsquo;Emporium and D&rsquo;Provision.</p>
        </div>
        <CategoryGroup store="emporium" />
        <CategoryGroup store="provision" />
      </section>
    </main>
  );
}
