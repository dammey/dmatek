type CableDividerProps = {
  /** viewBox is always "0 0 1440 H" for this width; H is viewBoxHeight. */
  viewBoxHeight: number;
  /** Closed fill shape (ends back at the box edges) in the next section's colour. */
  fillPath: string;
  /** The same edge, open, used for the stroke + travelling-light layers. */
  edgePath: string;
  fill: string;
  heightClamp: string;
  flowDuration: string;
  flowDelay: string;
  className?: string;
};

/** A section transition drawn as a right-angled cable route instead of a wave. */
export default function CableDivider({
  viewBoxHeight,
  fillPath,
  edgePath,
  fill,
  heightClamp,
  flowDuration,
  flowDelay,
  className = "",
}: CableDividerProps) {
  return (
    <svg
      viewBox={`0 0 1440 ${viewBoxHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full ${className}`}
      style={{ height: heightClamp, display: "block" }}
    >
      <path d={fillPath} fill={fill} />
      <path d={edgePath} fill="none" stroke="#D4A637" strokeWidth={2} strokeOpacity={0.55} vectorEffect="non-scaling-stroke" />
      <path
        d={edgePath}
        pathLength={2400}
        fill="none"
        stroke="#D4A637"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray="120 2280"
        strokeDashoffset={2400}
        vectorEffect="non-scaling-stroke"
        style={{ animation: `dmFlow ${flowDuration} linear ${flowDelay} infinite` }}
      />
    </svg>
  );
}
