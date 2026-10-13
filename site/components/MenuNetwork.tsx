/**
 * Background for the full-screen mobile menu: Adire-style horizontal bands
 * drawn as a network (diamond nodes joined by traces) with a few faint
 * "packets" travelling along them. Pure SVG: SMIL motion, no JavaScript, and
 * it only exists while the menu is open. Packets are hidden for visitors who
 * prefer reduced motion (see .dm-pkt in globals.css).
 */

const W = 400;
const H = 900;
const STEP = 40;
const BANDS = [28, 214, 408, 612, 800]; // top y of each band
const BAND_H = 64;

function bandPoints(top: number, seed: number) {
  const pts: [number, number][] = [];
  for (let x = -STEP; x <= W + STEP; x += STEP) {
    const k = Math.round(x / STEP) + seed;
    // A repeating textile rhythm: high, low, low, high, mid, ...
    const lane = [0.22, 0.78, 0.78, 0.22, 0.5][((k % 5) + 5) % 5];
    pts.push([x, top + BAND_H * lane]);
  }
  return pts;
}

const toPath = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");

export default function MenuNetwork() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {BANDS.map((top, b) => {
        const pts = bandPoints(top, b * 2);
        const d = toPath(pts);
        const rev = toPath([...pts].reverse());
        const dur = 9 + (b % 3) * 2.5;
        return (
          <g key={top}>
            {/* band edges, like the Adire strip's rules */}
            <line x1={0} x2={W} y1={top} y2={top} stroke="#F5F1E8" strokeOpacity={0.1} strokeWidth={1} />
            <line x1={0} x2={W} y1={top + BAND_H} y2={top + BAND_H} stroke="#F5F1E8" strokeOpacity={0.1} strokeWidth={1} />
            {/* the network trace */}
            <path d={d} fill="none" stroke="#F5F1E8" strokeOpacity={0.13} strokeWidth={1.2} strokeLinejoin="round" />
            {/* vertical spurs to the band edges */}
            {pts.map(([x, y], i) =>
              i % 2 === 0 ? <line key={`s${i}`} x1={x} x2={x} y1={y} y2={y < top + BAND_H / 2 ? top : top + BAND_H} stroke="#F5F1E8" strokeOpacity={0.07} strokeWidth={1} /> : null,
            )}
            {/* diamond nodes */}
            {pts.map(([x, y], i) => (
              <rect
                key={`n${i}`}
                x={x - 3}
                y={y - 3}
                width={6}
                height={6}
                transform={`rotate(45 ${x} ${y})`}
                fill={i % 5 === 0 ? "#D4A637" : "#06382E"}
                fillOpacity={i % 5 === 0 ? 0.4 : 1}
                stroke="#F5F1E8"
                strokeOpacity={0.22}
                strokeWidth={1}
              />
            ))}
            {/* packets */}
            {[0, 1].map((p) => (
              <circle key={p} r={2.4} fill="#D4A637" fillOpacity={0.6} className="dm-pkt">
                <animateMotion path={(b + p) % 2 ? rev : d} dur={`${dur + p * 3}s`} begin={`${-(b * 1.7 + p * 4.3)}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
