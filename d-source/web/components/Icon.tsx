/** D'Source icon set (design v11.1): 24px viewBox, 1.6 stroke, round caps,
 * gold dot on the seal. Inherits currentColor. */
export type IconName = "seal" | "inspect" | "returns" | "truck" | "warranty" | "banknote" | "source" | "wrench" | "clock";

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

const PATHS: Record<IconName, React.ReactNode> = {
  seal: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" />
      <path d="M8.2 12.2l2.7 2.7 5-5.4" />
      <circle cx="19.5" cy="4.5" r="1.9" fill="#D4A637" stroke="none" />
    </>
  ),
  inspect: (
    <>
      <path d="M3 7.6L9 4.8l6 2.8v6.4l-6 2.8-6-2.8z" />
      <path d="M3 7.6l6 2.8 6-2.8M9 10.4v6.4" />
      <circle cx="17" cy="16.6" r="3.4" />
      <path d="M19.6 19.2l2.2 2.2" />
    </>
  ),
  returns: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.7-6.2" />
      <path d="M20.5 3.5v4.6h-4.6" />
      <text x="12" y="15.3" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="currentColor" stroke="none" fontFamily="Manrope,sans-serif">
        7
      </text>
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v9.5h-11z" />
      <path d="M13.5 9.5h4l3 3v3.5h-7" />
      <circle cx="7" cy="17.8" r="1.9" />
      <circle cx="16.8" cy="17.8" r="1.9" />
    </>
  ),
  warranty: (
    <>
      <circle cx="12" cy="9.5" r="6.2" />
      <path d="M8.6 14.9L7 21.5l5-2.6 5 2.6-1.6-6.6" />
      <path d="M9.3 9.6l1.9 1.9 3.5-3.7" />
    </>
  ),
  banknote: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.2" />
      <circle cx="12" cy="12" r="2.8" />
      <path d="M6 9.4h.01M18 14.6h.01" />
    </>
  ),
  source: (
    <>
      <circle cx="10.5" cy="10.5" r="6.6" />
      <path d="M15.5 15.5l6 6" />
      <path d="M10.5 7.8v5.4M7.8 10.5h5.4" />
    </>
  ),
  wrench: <path d="M14.6 3.4a5.2 5.2 0 0 0-4.8 7L3.4 16.8a2.1 2.1 0 0 0 3 3l6.4-6.4a5.2 5.2 0 0 0 7-4.8l-3.2 3.1-2.9-.7-.8-2.9z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
};

/** Icon + label inline row, as used across the design. */
export function IconLabel({ name, size = 20, children, style }: { name: IconName; size?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center", ...style }}>
      <Icon name={name} size={size} />
      {children}
    </span>
  );
}
