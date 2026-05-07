"use client";

import { motion } from "framer-motion";

const VW = 320;
const VH = 180;

/* -------- Particle Galaxy -------- */

export function ParticleGalaxyThumb() {
  // Deterministic particle layout so SSR + client render match.
  const particles = Array.from({ length: 70 }).map((_, i) => {
    const a = (i * 137.508 * Math.PI) / 180;
    const r = 18 + ((i * 7) % 78);
    return {
      i,
      a,
      r,
      hue: (i * 13) % 360,
      // outer particles take longer to orbit (Kepler-ish)
      period: 6 + r / 14,
      size: 0.9 + (i % 3) * 0.4
    };
  });

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full">
      <defs>
        <radialGradient id="pg-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a0235" />
          <stop offset="60%" stopColor="#0a0118" />
          <stop offset="100%" stopColor="#05060a" />
        </radialGradient>
        <radialGradient id="pg-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="35%" stopColor="#ff8ad6" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#9d00ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill="url(#pg-bg)" />

      {/* dust stars */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 37) % VW;
        const y = (i * 53) % VH;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={(i % 3) * 0.4 + 0.3}
            fill="#fff"
            opacity={0.25 + ((i * 7) % 30) / 100}
          />
        );
      })}

      {/* gravity well */}
      <g transform={`translate(${VW / 2} ${VH / 2})`}>
        <motion.circle
          r={42}
          fill="url(#pg-core)"
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle r={2.4} fill="#fff" />

        {/* orbiting particles — each on its own slow rotation */}
        {particles.map((p) => (
          <motion.g
            key={p.i}
            animate={{ rotate: 360 }}
            transition={{ duration: p.period, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          >
            <circle
              cx={p.r * Math.cos(p.a)}
              cy={p.r * Math.sin(p.a) * 0.62}
              r={p.size}
              fill={`hsl(${p.hue}, 90%, 70%)`}
              opacity={0.9}
              style={{ filter: "drop-shadow(0 0 2px currentColor)" }}
            />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}

/* -------- Physics Sandbox (falling sand) -------- */

export function PhysicsSandboxThumb() {
  // 20×11 grid of cells representing a snapshot of the sandbox
  const W = 20;
  const H = 11;
  const cell = VW / W;

  type T = "air" | "sand" | "water" | "stone" | "wood" | "fire" | "smoke";
  const grid: T[][] = Array.from({ length: H }, () => Array.from({ length: W }, () => "air" as T));

  // floor of stone
  for (let x = 0; x < W; x++) grid[0][x] = "stone";
  // wood pillar burning on the left
  grid[1][3] = "wood";
  grid[2][3] = "wood";
  grid[3][3] = "wood";
  grid[4][3] = "fire";
  grid[5][3] = "smoke";
  grid[6][3] = "smoke";
  grid[7][3] = "smoke";
  // sand pyramid in middle
  for (let dx = -2; dx <= 2; dx++) grid[1][10 + dx] = "sand";
  for (let dx = -1; dx <= 1; dx++) grid[2][10 + dx] = "sand";
  grid[3][10] = "sand";
  // water pool right side
  for (let x = 14; x < 19; x++) grid[1][x] = "water";
  for (let x = 15; x < 18; x++) grid[2][x] = "water";
  // a few falling sand grains in mid-air
  grid[7][9] = "sand";
  grid[5][11] = "sand";
  grid[4][16] = "sand";

  const colorOf = (t: T): string =>
    ({
      air: "transparent",
      sand: "#dcc066",
      water: "#3a82d2",
      stone: "#666670",
      wood: "#6b4422",
      fire: "#ffb14a",
      smoke: "#3a3a42"
    }[t]);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full">
      <defs>
        <linearGradient id="ps-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#08070d" />
          <stop offset="100%" stopColor="#0d0a18" />
        </linearGradient>
        <radialGradient id="ps-fire-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9a3a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff9a3a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill="url(#ps-bg)" />

      {/* faint pixel grid */}
      {Array.from({ length: W + 1 }).map((_, x) => (
        <line
          key={`v${x}`}
          x1={x * cell}
          y1={0}
          x2={x * cell}
          y2={VH}
          stroke="#00f0ff"
          strokeOpacity={0.06}
          strokeWidth={0.4}
        />
      ))}
      {Array.from({ length: H + 1 }).map((_, y) => (
        <line
          key={`h${y}`}
          x1={0}
          y1={y * (VH / H)}
          x2={VW}
          y2={y * (VH / H)}
          stroke="#00f0ff"
          strokeOpacity={0.06}
          strokeWidth={0.4}
        />
      ))}

      {/* cells (y=0 is bottom) */}
      {grid.map((row, y) =>
        row.map((t, x) => {
          if (t === "air") return null;
          const px = x * cell;
          const py = VH - (y + 1) * (VH / H);
          const fill = colorOf(t);
          // tiny per-cell jitter so piles don't look flat
          const jitter = ((x * 13 + y * 7) % 11) / 100 - 0.05;
          const opacity = t === "smoke" ? 0.55 : 0.92 + jitter;

          if (t === "fire") {
            return (
              <motion.rect
                key={`${x}-${y}`}
                x={px}
                y={py}
                width={cell}
                height={VH / H}
                fill={fill}
                animate={{ fill: ["#ffb14a", "#ffd970", "#ff7f32", "#ffb14a"] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: "drop-shadow(0 0 4px #ff9a3a)" }}
              />
            );
          }

          return (
            <rect
              key={`${x}-${y}`}
              x={px}
              y={py}
              width={cell}
              height={VH / H}
              fill={fill}
              opacity={opacity}
            />
          );
        })
      )}

      {/* warm halo around the fire pillar */}
      <motion.circle
        cx={3 * cell + cell / 2}
        cy={VH - 4 * (VH / H) - (VH / H) / 2}
        r={26}
        fill="url(#ps-fire-glow)"
        animate={{ opacity: [0.5, 0.85, 0.5], r: [22, 30, 22] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* -------- Ocean Tank -------- */

export function OceanTankThumb() {
  const baseline = 64; // surface y
  const samples = 48;
  const xs = Array.from({ length: samples + 1 }).map((_, i) => (i * VW) / samples);

  const wavePath = (phase: number) =>
    xs
      .map((x, i) => {
        const y = baseline + Math.sin(x * 0.06 + phase) * 3 + Math.sin(x * 0.14 + phase * 1.3) * 1.5;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const fillPath = (phase: number) =>
    `${wavePath(phase)} L${VW},${VH} L0,${VH} Z`;

  // kelp strand positions — deterministic
  const kelps = [42, 80, 120, 168, 210, 248, 286].map((x, i) => ({
    x,
    height: 70 + (i * 7) % 40,
    sway: 4 + (i % 3) * 2,
    phase: i * 0.7
  }));

  // bubbles
  const bubbles = Array.from({ length: 7 }).map((_, i) => ({
    x: 30 + (i * 41) % (VW - 60),
    delay: (i * 0.6) % 4,
    duration: 5 + (i % 3),
    size: 1.2 + (i % 3) * 0.4
  }));

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full">
      <defs>
        <linearGradient id="ot-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1a0240" />
          <stop offset="60%" stopColor="#3a0a60" />
          <stop offset="100%" stopColor="#5a1080" />
        </linearGradient>
        <linearGradient id="ot-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a2a6a" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="ot-sand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6b5a30" />
          <stop offset="100%" stopColor="#1a1408" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x={0} y={0} width={VW} height={baseline + 2} fill="url(#ot-sky)" />
      {/* sun glow */}
      <circle cx={VW * 0.78} cy={28} r={18} fill="#ffb37a" opacity={0.35} />
      <circle cx={VW * 0.78} cy={28} r={8} fill="#ffe6c4" opacity={0.7} />

      {/* water body — animated wave path */}
      <motion.path
        animate={{ d: [fillPath(0), fillPath(Math.PI), fillPath(2 * Math.PI)] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        fill="url(#ot-water)"
      />

      {/* surface highlight line */}
      <motion.path
        animate={{ d: [wavePath(0), wavePath(Math.PI), wavePath(2 * Math.PI)] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        stroke="#9be8ff"
        strokeOpacity={0.55}
        strokeWidth={0.8}
        fill="none"
      />

      {/* kelp strands */}
      {kelps.map((k, i) => (
        <motion.path
          key={i}
          d={`M${k.x},${VH - 6} Q${k.x + k.sway},${VH - 6 - k.height / 2} ${k.x},${VH - 6 - k.height}`}
          stroke="#5fcf90"
          strokeOpacity={0.7}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              `M${k.x},${VH - 6} Q${k.x + k.sway},${VH - 6 - k.height / 2} ${k.x},${VH - 6 - k.height}`,
              `M${k.x},${VH - 6} Q${k.x - k.sway},${VH - 6 - k.height / 2} ${k.x + 2},${VH - 6 - k.height}`,
              `M${k.x},${VH - 6} Q${k.x + k.sway},${VH - 6 - k.height / 2} ${k.x},${VH - 6 - k.height}`
            ]
          }}
          transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: k.phase }}
        />
      ))}

      {/* rocks on the floor */}
      <ellipse cx={60} cy={VH - 8} rx={22} ry={6} fill="#3a2820" opacity={0.85} />
      <ellipse cx={155} cy={VH - 6} rx={32} ry={5} fill="#3a2820" opacity={0.85} />
      <ellipse cx={245} cy={VH - 8} rx={26} ry={6} fill="#3a2820" opacity={0.85} />

      {/* sand floor */}
      <rect x={0} y={VH - 10} width={VW} height={10} fill="url(#ot-sand)" />

      {/* rising bubbles */}
      {bubbles.map((b, i) => (
        <motion.circle
          key={i}
          cx={b.x}
          r={b.size}
          fill="#fff"
          fillOpacity={0.4}
          stroke="#fff"
          strokeOpacity={0.7}
          strokeWidth={0.4}
          animate={{ cy: [VH - 10, baseline + 8], opacity: [0, 0.85, 0] }}
          transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: "easeOut" }}
        />
      ))}

      {/* glass tank outline */}
      <rect
        x={3}
        y={3}
        width={VW - 6}
        height={VH - 6}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.18}
        strokeWidth={1}
        rx={3}
      />
    </svg>
  );
}

/* -------- Kaleidoscope -------- */

export function KaleidoscopeThumb() {
  // 12-segment kaleidoscope, drawn as 12 rotated copies of a single neon wedge.
  // The wedge content is deterministic so SSR + client agree.
  const SEGMENTS = 12;
  const cx = VW / 2;
  const cy = VH / 2;

  // ribbons inside one wedge (will be mirrored & repeated by SEGMENTS)
  const ribbons = [
    { color: "#00f0ff", phase: 0, amp: 22, freq: 1.7 },
    { color: "#ff2bd6", phase: 0.6, amp: 16, freq: 2.3 },
    { color: "#9d00ff", phase: 1.2, amp: 12, freq: 2.9 },
    { color: "#ffe680", phase: 1.8, amp: 8, freq: 3.5 }
  ];

  // sample the ribbon as a polyline
  const samples = 30;
  const wedgeAngle = (2 * Math.PI) / SEGMENTS; // half-angle = wedgeAngle/2

  function ribbonPath(amp: number, freq: number, phase: number, mirror: boolean) {
    // ribbon lives along radial axis (theta=0 baseline), oscillates in theta direction
    const points: string[] = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const r = 8 + t * 75; // from inner radius to outer
      const theta = Math.sin(t * Math.PI * freq + phase) * (amp / 1000); // small angle wiggle
      const sign = mirror ? -1 : 1;
      const x = r * Math.cos(sign * theta);
      const y = r * Math.sin(sign * theta);
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(" ");
  }

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full">
      <defs>
        <radialGradient id="k-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a0235" />
          <stop offset="60%" stopColor="#08020e" />
          <stop offset="100%" stopColor="#020108" />
        </radialGradient>
        <radialGradient id="k-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="50%" stopColor="#ff2bd6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
        </radialGradient>
        <filter id="k-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill="url(#k-bg)" />

      {/* slow rotation of the whole mandala */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <g transform={`translate(${cx} ${cy})`}>
          {/* SEGMENTS slices, each containing the same wedge content (mirrored half + half) */}
          {Array.from({ length: SEGMENTS }).map((_, segIdx) => {
            const baseAngle = (segIdx * 360) / SEGMENTS;
            return (
              <g key={segIdx} transform={`rotate(${baseAngle})`}>
                {ribbons.map((rb, i) => (
                  <g key={i} filter="url(#k-blur)">
                    <path
                      d={ribbonPath(rb.amp, rb.freq, rb.phase, false)}
                      stroke={rb.color}
                      strokeWidth={1.4}
                      fill="none"
                      strokeOpacity={0.85}
                      style={{ filter: `drop-shadow(0 0 3px ${rb.color})` }}
                    />
                    <path
                      d={ribbonPath(rb.amp, rb.freq, rb.phase, true)}
                      stroke={rb.color}
                      strokeWidth={1.4}
                      fill="none"
                      strokeOpacity={0.85}
                      style={{ filter: `drop-shadow(0 0 3px ${rb.color})` }}
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {/* center glow + pulse rings */}
          <motion.circle
            r={20}
            fill="url(#k-core)"
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle r={2.5} fill="#fff" />
        </g>
      </motion.g>

      {/* counter-rotating shimmer ring for extra depth */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={70}
          fill="none"
          stroke="#00f0ff"
          strokeOpacity={0.18}
          strokeWidth={0.6}
          strokeDasharray="2 6"
        />
      </motion.g>
    </svg>
  );
}

/* -------- Map -------- */

export const THUMBS: Record<string, React.ComponentType> = {
  "particle-galaxy": ParticleGalaxyThumb,
  "physics-sandbox": PhysicsSandboxThumb,
  "ocean-tank": OceanTankThumb,
  "kaleidoscope": KaleidoscopeThumb
};
