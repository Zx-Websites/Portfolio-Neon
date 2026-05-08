"use client";

import { motion } from "framer-motion";

const VW = 320;
const VH = 180;

/* -------- Particle Galaxy -------- */

export function ParticleGalaxyThumb() {
  // Particles split into 3 radius bands. Each band rotates as ONE motion.g
  // (3 animations total instead of 50+). Different periods give the parallax feel.
  const PARTICLES = 50;
  const all = Array.from({ length: PARTICLES }).map((_, i) => {
    const a = (i * 137.508 * Math.PI) / 180;
    const r = 18 + ((i * 7) % 78);
    return {
      i,
      a,
      r,
      hue: (i * 13) % 360,
      size: 0.9 + (i % 3) * 0.4
    };
  });

  // Bucket by radius
  const inner = all.filter((p) => p.r < 38);
  const mid = all.filter((p) => p.r >= 38 && p.r < 70);
  const outer = all.filter((p) => p.r >= 70);

  const renderBand = (ps: typeof all) =>
    ps.map((p) => (
      <circle
        key={p.i}
        cx={p.r * Math.cos(p.a)}
        cy={p.r * Math.sin(p.a) * 0.62}
        r={p.size}
        fill={`hsl(${p.hue}, 90%, 70%)`}
        opacity={0.9}
        style={{ filter: "drop-shadow(0 0 2px currentColor)" }}
      />
    ));

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

      {/* dust stars — static */}
      {Array.from({ length: 30 }).map((_, i) => {
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

        {/* 3 banded rotations — fast inner, medium mid, slow outer */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        >
          {renderBand(inner)}
        </motion.g>
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        >
          {renderBand(mid)}
        </motion.g>
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        >
          {renderBand(outer)}
        </motion.g>
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
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill="url(#k-bg)" />

      {/* slow rotation of the whole mandala (single transform on the parent group
          — keeps the GPU work to one composited layer) */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <g transform={`translate(${cx} ${cy})`}>
          {/* SEGMENTS slices, each containing the same wedge content (mirrored half + half).
              Glow is via path-level drop-shadow only (composited cheaply); SVG feGaussianBlur
              filter removed because it slaughters Chrome FPS when applied to many paths. */}
          {Array.from({ length: SEGMENTS }).map((_, segIdx) => {
            const baseAngle = (segIdx * 360) / SEGMENTS;
            return (
              <g key={segIdx} transform={`rotate(${baseAngle})`}>
                {ribbons.map((rb, i) => (
                  <g key={i}>
                    <path
                      d={ribbonPath(rb.amp, rb.freq, rb.phase, false)}
                      stroke={rb.color}
                      strokeWidth={1.4}
                      fill="none"
                      strokeOpacity={0.85}
                      style={{ filter: `drop-shadow(0 0 2px ${rb.color})` }}
                    />
                    <path
                      d={ribbonPath(rb.amp, rb.freq, rb.phase, true)}
                      stroke={rb.color}
                      strokeWidth={1.4}
                      fill="none"
                      strokeOpacity={0.85}
                      style={{ filter: `drop-shadow(0 0 2px ${rb.color})` }}
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

/* -------- Inkwell -------- */

export function InkwellThumb() {
  // Three swirling dye plumes on a black canvas — captures the visual identity.
  // The "swirl" is animated via path morph + slow group rotation.
  const plumes = [
    { color: "#ff7a3d", cx: 90,  cy: 100, scale: 1.0,  delay: 0 },
    { color: "#65e88a", cx: 165, cy: 95,  scale: 0.95, delay: 0.6 },
    { color: "#5b9aff", cx: 235, cy: 100, scale: 1.05, delay: 1.2 }
  ];

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full">
      <defs>
        <radialGradient id="ink-bg" cx="50%" cy="55%" r="65%">
          <stop offset="0%" stopColor="#0a0410" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>

        {/* one bloom-like radial per plume color, used as fill */}
        {plumes.map((p, i) => (
          <radialGradient key={i} id={`ink-plume-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="35%" stopColor={p.color} stopOpacity="0.85" />
            <stop offset="75%" stopColor={p.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={p.color} stopOpacity="0" />
          </radialGradient>
        ))}

      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill="url(#ink-bg)" />

      {/* Plumes — soft glow comes from the radial gradient + drop-shadow rather
          than a SVG blur filter (filter forces per-frame re-raster — too expensive). */}
      {plumes.map((p, i) => (
        <g key={i} style={{ filter: `drop-shadow(0 0 6px ${p.color}aa)` }}>
          {/* Pulsing blob */}
          <motion.ellipse
            cx={p.cx}
            cy={p.cy}
            rx={32 * p.scale}
            ry={26 * p.scale}
            fill={`url(#ink-plume-${i})`}
            animate={{
              rx: [32 * p.scale, 36 * p.scale, 32 * p.scale],
              ry: [26 * p.scale, 22 * p.scale, 26 * p.scale]
            }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />

          {/* Curling tendril above the blob */}
          <motion.path
            stroke={p.color}
            strokeOpacity={0.55}
            strokeWidth={1.3}
            fill="none"
            strokeLinecap="round"
            d={`M${p.cx},${p.cy - 8} Q${p.cx + 14},${p.cy - 30} ${p.cx - 6},${p.cy - 50} Q${p.cx - 18},${p.cy - 65} ${p.cx + 8},${p.cy - 78}`}
            animate={{
              d: [
                `M${p.cx},${p.cy - 8} Q${p.cx + 14},${p.cy - 30} ${p.cx - 6},${p.cy - 50} Q${p.cx - 18},${p.cy - 65} ${p.cx + 8},${p.cy - 78}`,
                `M${p.cx},${p.cy - 8} Q${p.cx - 12},${p.cy - 30} ${p.cx + 8},${p.cy - 50} Q${p.cx + 18},${p.cy - 65} ${p.cx - 6},${p.cy - 78}`,
                `M${p.cx},${p.cy - 8} Q${p.cx + 14},${p.cy - 30} ${p.cx - 6},${p.cy - 50} Q${p.cx - 18},${p.cy - 65} ${p.cx + 8},${p.cy - 78}`
              ]
            }}
            transition={{ duration: 6 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        </g>
      ))}

      {/* A few drifting dots like dye microparticles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 20 + (i * 27) % (VW - 40);
        const y = 20 + (i * 13) % (VH - 40);
        const colors = ["#ff7a3d", "#65e88a", "#5b9aff", "#ffe680"];
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={1}
            fill={colors[i % colors.length]}
            opacity={0.6}
            animate={{
              cx: [x, x + (i % 2 === 0 ? 12 : -12), x],
              cy: [y, y - 8, y],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: (i * 0.3) % 3 }}
          />
        );
      })}
    </svg>
  );
}

/* -------- Map -------- */

export const THUMBS: Record<string, React.ComponentType> = {
  "particle-galaxy": ParticleGalaxyThumb,
  "physics-sandbox": PhysicsSandboxThumb,
  "ocean-tank": OceanTankThumb,
  "kaleidoscope": KaleidoscopeThumb,
  "inkwell": InkwellThumb
};
