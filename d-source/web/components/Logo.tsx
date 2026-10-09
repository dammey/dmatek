/** D’Source lockup: cart mark with "DS" (gold S) and the wordmark. The
 * header uses size "sm" (46px mark, follows the text colour); the footer
 * uses "lg" (80px mark in the brand forest). */
export default function Logo({ size = "sm", fg, sub }: { size?: "sm" | "lg"; fg?: string; sub?: string }) {
  const lg = size === "lg";
  const ink = lg ? "#0B4B3D" : "currentColor";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: lg ? 16 : 9, color: fg ?? "var(--d)" }}>
      <svg viewBox="0 0 64 56" width={lg ? 80 : 46} height={lg ? 80 : 46} fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M2 5h8l5 25h40" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="17" y="28" fontSize="29" fontWeight="800" fontFamily="Manrope,Arial,sans-serif" fill={ink} letterSpacing="-1">
          D
        </text>
        <text x="35" y="28" fontSize="29" fontWeight="800" fontFamily="Manrope,Arial,sans-serif" fill="#D4A637">
          S
        </text>
        <circle cx="24" cy="46" r="4" fill={ink} />
        <circle cx="46" cy="46" r="4" fill={ink} />
      </svg>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
        <span style={{ fontWeight: 800, fontSize: lg ? 38 : 22, letterSpacing: ".02em", lineHeight: 1 }}>D’SOURCE</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: lg ? 12 : 8, fontWeight: 600, letterSpacing: ".2em", color: sub ?? "var(--m)", lineHeight: 1.2 }}>COMMERCE BY D’MATEK</span>
      </span>
    </span>
  );
}
