import type { CSSProperties, ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  /** Text colour; defaults to forest (light sections). Dark sections pass gold. */
  color?: string;
  /** Home's numbered moments carry a data-node anchor for the signature line. */
  node?: string;
  className?: string;
  style?: CSSProperties;
};

/** v3.4 eyebrow: a gold top-rule label, no pill ground. */
export default function Eyebrow({ children, color = "#06382E", node, className = "", style }: EyebrowProps) {
  return (
    <p
      data-node={node}
      className={`inline-block text-[11.5px] font-bold tracking-[clamp(0.08em,0.6vw,0.2em)] text-balance ${className}`}
      style={{ color, borderTop: "2px solid #D4A637", padding: "10px 0 0", margin: "0 0 22px", maxWidth: "100%", ...style }}
    >
      {children}
    </p>
  );
}
