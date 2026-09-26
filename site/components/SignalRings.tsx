import type { CSSProperties } from "react";

type SignalRingsProps = {
  /** "green" for light/cream sections, "gold" for dark sections. */
  tone?: "green" | "gold";
  className?: string;
  style?: CSSProperties;
};

const RING_DELAYS = [0, 2, 4, 6];

/** Decorative ring emitter used in every page hero (and dark sections, tone-flipped). */
export default function SignalRings({ tone = "green", className = "", style }: SignalRingsProps) {
  const ring = tone === "gold" ? "#D4A637" : "#28705A";
  const inset = tone === "gold" ? "rgba(212,166,55,0.18)" : "rgba(40,112,90,0.14)";

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-square ${className}`} style={style}>
      {RING_DELAYS.map((delay) => (
        <div
          key={delay}
          className="absolute inset-0 rounded-full opacity-0"
          style={{ border: `1.5px solid ${ring}`, animation: `dm-ring 8s cubic-bezier(.2,.6,.3,1) ${delay}s infinite` }}
        />
      ))}
      <div className="absolute inset-[16%] rounded-full" style={{ border: `1px solid ${inset}` }} />
      <div className="absolute inset-[33%] rounded-full" style={{ border: `1px solid ${inset}` }} />
      <div className="absolute rounded-full bg-gold" style={{ inset: "calc(50% - 4px)" }} />
    </div>
  );
}
