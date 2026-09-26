import Link from "next/link";

export const pilotNote =
  "Available as a pilot. We’re rolling this out with a small number of early customers. If it fits what you need, talk to us about joining the pilot.";

type PilotLabelProps = {
  items: string[];
  /** Fully-built link to the enquiry flow with the pilot items pre-filled (each app owns its own query-param contract). */
  href: string;
  /** "cream" (default) for panels on a cream background; "dark" for panels inside a dark/open accordion body. */
  tone?: "cream" | "dark";
  /** Tighter, fixed-radius variant used inside accordion cards. */
  compact?: boolean;
};

/** The one reusable "AVAILABLE AS A PILOT" panel — tag, items, standard sentence, and a pre-filled link. Shared across D'Matek and D'Source. */
export default function PilotLabel({ items, href, tone = "cream", compact = false }: PilotLabelProps) {
  if (items.length === 0) return null;

  const dark = tone === "dark";

  return (
    <div
      style={{
        border: `1px dashed ${dark ? "rgba(212,166,55,0.5)" : "rgba(6,56,46,0.35)"}`,
        borderRadius: compact ? 26 : "clamp(26px,3.4vw,44px)",
        padding: compact ? 20 : "clamp(26px,3vw,40px)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 4,
          padding: "8px 14px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: dark ? "#D4A637" : "#06382E",
          border: `1px dashed ${dark ? "rgba(212,166,55,0.6)" : "rgba(6,56,46,0.45)"}`,
        }}
      >
        AVAILABLE AS A PILOT
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "14px 0" }}>
        {items.map((item) => (
          <span
            key={item}
            style={{
              borderRadius: 4,
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
              color: dark ? "rgba(245,241,232,0.86)" : "#06382E",
              border: `1px solid ${dark ? "rgba(245,241,232,0.2)" : "rgba(6,56,46,0.18)"}`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.6, color: dark ? "rgba(245,241,232,0.7)" : "#3A4A44" }}>
        {pilotNote}
      </p>
      <Link
        href={href}
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: dark ? "#D4A637" : "#06382E",
          borderBottom: `1px solid ${dark ? "rgba(212,166,55,0.5)" : "rgba(6,56,46,0.4)"}`,
          paddingBottom: 3,
        }}
      >
        Talk to us about joining the pilot &rarr;
      </Link>
    </div>
  );
}
