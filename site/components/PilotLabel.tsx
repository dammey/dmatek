import Link from "next/link";
import { pilotNote } from "@/lib/content";

type PilotLabelProps = {
  items: string[];
  topic: string;
  /** "cream" (default) for panels on a cream background; "dark" for panels inside a dark/open accordion body. */
  tone?: "cream" | "dark";
  /** Tighter, fixed-radius variant used inside the Solutions entry-point cards. */
  compact?: boolean;
};

/** The one reusable "AVAILABLE AS A PILOT" panel — tag, items, standard sentence, and a pre-filled contact link. */
export default function PilotLabel({ items, topic, tone = "cream", compact = false }: PilotLabelProps) {
  if (items.length === 0) return null;

  const dark = tone === "dark";
  const href = `/contact?topic=${encodeURIComponent(topic)}&pilot=${encodeURIComponent(items.join(", "))}`;

  return (
    <div
      className={compact ? "rounded-[26px] p-5" : "rounded-[clamp(26px,3.4vw,44px)] p-[clamp(26px,3vw,40px)]"}
      style={{ border: `1px dashed ${dark ? "rgba(212,166,55,0.5)" : "rgba(6,56,46,0.35)"}` }}
    >
      <span
        className="inline-flex items-center gap-2 rounded-[4px] px-3.5 py-2 text-[11px] font-bold tracking-[0.16em]"
        style={{
          color: dark ? "#D4A637" : "#06382E",
          border: `1px dashed ${dark ? "rgba(212,166,55,0.6)" : "rgba(6,56,46,0.45)"}`,
        }}
      >
        AVAILABLE AS A PILOT
      </span>
      <div className="my-3.5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-[4px] px-4 py-2.5 text-[14px] font-semibold"
            style={{
              color: dark ? "rgba(245,241,232,0.86)" : "#06382E",
              border: `1px solid ${dark ? "rgba(245,241,232,0.2)" : "rgba(6,56,46,0.18)"}`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <p
        className="mb-3.5 text-[13.5px] leading-[1.6]"
        style={{ color: dark ? "rgba(245,241,232,0.7)" : "#3A4A44" }}
      >
        {pilotNote}
      </p>
      <Link
        href={href}
        className="text-[14px] font-bold"
        style={{
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
