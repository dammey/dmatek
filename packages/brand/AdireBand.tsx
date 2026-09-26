const TILE_URL =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%2306382E%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23F5F1E8%22%20stroke-opacity%3D%22.5%22%20stroke-width%3D%221.3%22%3E%3Cpath%20d%3D%22M32%200V64M0%2032H64%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2210%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%225%22%2F%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%2210%22%2F%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%225%22%2F%3E%3Cpath%20d%3D%22M36%204l24%2024M36%2014l14%2014M46%204l14%2014M4%2036l24%2024M4%2046l14%2014M14%2036l14%2014%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23D4A637%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%221.8%22%2F%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%221.8%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%220%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%2264%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%2264%22%20r%3D%222.4%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

type AdireBandProps =
  | { variant: "strip" }
  | { variant: "footer" }
  | { variant: "specialists-with-cable"; cablePath: string };

/**
 * The repeating Adire-inspired tile band used as a textile section transition
 * across the whole D'Matek family (D'Matek, D'Foundry, D'Source). Requires
 * the `dmFlow` keyframe (see ./keyframes.css) to be loaded by the consuming app.
 */
export default function AdireBand(props: AdireBandProps) {
  if (props.variant === "footer") {
    return (
      <div
        aria-hidden="true"
        data-adire
        style={{
          height: 22,
          backgroundColor: "#06382E",
          backgroundImage: `url(${TILE_URL})`,
          backgroundSize: "auto 22px",
          backgroundPosition: "0 0",
          borderBottom: "2px solid #D4A637",
        }}
      />
    );
  }

  if (props.variant === "strip") {
    return (
      <div
        aria-hidden="true"
        data-adire
        style={{
          height: "clamp(30px,3.2vw,44px)",
          backgroundColor: "#06382E",
          backgroundImage: `url(${TILE_URL})`,
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          borderTop: "2px solid #D4A637",
          borderBottom: "2px solid #D4A637",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      data-adire
      style={{
        position: "relative",
        height: "clamp(40px,4vw,56px)",
        backgroundColor: "#06382E",
        backgroundImage: `url(${TILE_URL})`,
        backgroundSize: "auto 100%",
        backgroundRepeat: "repeat-x",
        borderTop: "2px solid #D4A637",
        borderBottom: "2px solid #D4A637",
        overflow: "hidden",
      }}
    >
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d={props.cablePath} fill="none" stroke="#06382E" strokeWidth={7} vectorEffect="non-scaling-stroke" />
        <path d={props.cablePath} fill="none" stroke="#D4A637" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <path
          d={props.cablePath}
          pathLength={2400}
          fill="none"
          stroke="#F5F1E8"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray="110 2290"
          strokeDashoffset={2400}
          vectorEffect="non-scaling-stroke"
          style={{ animation: "dmFlow 7s linear infinite" }}
        />
      </svg>
    </div>
  );
}
