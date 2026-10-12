/**
 * The thin D'Matek bar above D'Source and D'Foundry (handoff v3.6): back to
 * the main site, plus its business pages. Section links hide below 700px.
 */
const SECTIONS: [string, string][] = [
  ["Cloud", "/cloud"],
  ["Infrastructure", "/infrastructure"],
  ["IléMesh", "/ilemesh"],
  ["Assurance", "/assurance"],
];

const CSS = `.dm-bar a{white-space:nowrap;text-decoration:none}.dm-bar a:hover{color:#D4A637!important}@media(max-width:700px){.dm-bar-links{display:none!important}}`;

export default function DmatekBar({ dmatekUrl }: { dmatekUrl: string }) {
  const base = dmatekUrl.replace(/\/$/, "");
  return (
    <div
      className="dm-bar"
      style={{
        position: "relative",
        zIndex: 60,
        display: "flex",
        flexWrap: "wrap",
        gap: "6px 24px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px clamp(14px,3vw,32px)",
        background: "#06382E",
        color: "#F5F1E8",
        fontFamily: "var(--font-manrope),'Manrope',system-ui,sans-serif",
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
    >
      <style>{CSS}</style>
      <a href={base} data-track="back_to_dmatek" style={{ color: "#F5F1E8" }}>
        &larr; D&rsquo;MATEK TECHNOLOGY LIMITED
      </a>
      <span className="dm-bar-links" style={{ display: "flex", gap: 18, fontWeight: 600, letterSpacing: "0.04em" }}>
        {SECTIONS.map(([label, path]) => (
          <a key={path} href={`${base}${path}`} style={{ color: "#D9D3C4" }}>
            {label}
          </a>
        ))}
      </span>
    </div>
  );
}
