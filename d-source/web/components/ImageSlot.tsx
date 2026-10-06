import Image from "next/image";

/** The design's <image-slot>: the real photo when there is one, otherwise
 * the placeholder caption (soft icon + label) until the photo exists.
 * Fills its positioned parent. */
export default function ImageSlot({
  src,
  alt,
  placeholder,
  sizes = "(max-width: 600px) 100vw, 400px",
  priority = false,
}: {
  src?: string | null;
  alt?: string;
  placeholder: string;
  sizes?: string;
  priority?: boolean;
}) {
  // Only real paths/URLs render; anything else (an unset ref) shows the placeholder.
  // External URLs (e.g. CMS-entered) skip the optimiser, which only allows known hosts.
  if (src && (src.startsWith("/") || /^https?:\/\//.test(src)))
    return <Image src={src} alt={alt ?? placeholder} fill sizes={sizes} priority={priority} unoptimized={!src.startsWith("/")} style={{ objectFit: "cover" }} />;
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        textAlign: "center",
        padding: 12,
        background: "rgba(127,127,127,.08)",
        font: "500 13px/1.3 system-ui,-apple-system,sans-serif",
        letterSpacing: ".01em",
        pointerEvents: "none",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.45 }}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span style={{ maxWidth: "90%", opacity: 0.75 }}>{placeholder}</span>
    </span>
  );
}
