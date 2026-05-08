"use client";

import { motion } from "framer-motion";

const drawTransition = (delay = 0) => ({
  duration: 1.6,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  delay
});

/* ---------- generic frame ---------- */

export function DiagramFrame({
  title,
  caption,
  children,
  height = 320
}: {
  title?: string;
  caption?: string;
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-panel/40 backdrop-blur"
    >
      {title && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            {title}
          </span>
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-pink/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-neon-lime/70" />
          </span>
        </div>
      )}
      <div className="relative" style={{ height }}>
        {children}
      </div>
      {caption && (
        <figcaption className="border-t border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

/* ---------- Particle Galaxy: live orbital simulation ---------- */

export function GalaxyDiagram() {
  // Pre-computed deterministic particles so SSR + client match
  const particles = Array.from({ length: 60 }).map((_, i) => {
    const a = (i * 137.508 * Math.PI) / 180;
    const r = 30 + ((i * 7) % 90);
    return { i, a, r, hue: (i * 11) % 360 };
  });

  return (
    <DiagramFrame title="orbital sim · gravity well + spin" caption="centre is the gravity attractor">
      <svg viewBox="-180 -120 360 240" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="gw" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="40%" stopColor="#ff2bd6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* gravity well center */}
        <motion.circle
          cx={0}
          cy={0}
          r={28}
          fill="url(#gw)"
          animate={{ r: [22, 30, 22], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx={0} cy={0} r={3} fill="#fff" />

        {/* orbit guide rings */}
        {[40, 70, 100].map((r) => (
          <motion.circle
            key={r}
            cx={0}
            cy={0}
            r={r}
            fill="none"
            stroke="#00f0ff"
            strokeWidth={0.4}
            strokeDasharray="2 4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.35 }}
            viewport={{ once: true }}
            transition={drawTransition(0.2)}
          />
        ))}

        {/* particles orbiting */}
        {particles.map((p) => {
          const period = 6 + (p.r / 12);
          return (
            <motion.g
              key={p.i}
              animate={{ rotate: 360 }}
              transition={{ duration: period, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "0px 0px" }}
            >
              <motion.circle
                cx={p.r * Math.cos(p.a)}
                cy={p.r * Math.sin(p.a) * 0.6}
                r={1.4}
                fill={`hsl(${p.hue}, 95%, 65%)`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.9 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + p.i * 0.01 }}
                style={{ filter: "drop-shadow(0 0 3px currentColor)" }}
              />
            </motion.g>
          );
        })}

        {/* arrows showing forces */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Arrow from={[80, -50]} to={[20, -10]} color="#ff2bd6" label="gravity 1/r²" />
          <Arrow from={[-90, 40]} to={[-30, 20]} color="#00f0ff" label="spin ⊥" />
        </motion.g>
      </svg>
    </DiagramFrame>
  );
}

function Arrow({
  from,
  to,
  color,
  label
}: {
  from: [number, number];
  to: [number, number];
  color: string;
  label?: string;
}) {
  const id = `arr-${from[0]}-${to[0]}`;
  return (
    <g>
      <defs>
        <marker
          id={id}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L5,3 z" fill={color} />
        </marker>
      </defs>
      <motion.line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke={color}
        strokeWidth={1}
        markerEnd={`url(#${id})`}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={drawTransition(0.6)}
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
      {label && (
        <text
          x={from[0]}
          y={from[1] - 6}
          fill={color}
          fontSize="8"
          fontFamily="ui-monospace, monospace"
          opacity={0.85}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ---------- Falling Sand: cellular automata grid ---------- */

export function CellularGridDiagram() {
  // 9x9 grid showing sand falling, water spreading, fire rising
  const W = 11;
  const H = 8;
  const cellW = 28;
  const cellH = 28;
  const totalW = W * cellW;
  const totalH = H * cellH;

  type Cell = { type: "sand" | "water" | "stone" | "fire" | "wood" | "smoke" | "air"; flash?: boolean };
  const grid: Cell[][] = Array.from({ length: H }, () =>
    Array.from({ length: W }, () => ({ type: "air" as Cell["type"] }))
  );
  // floor of stone
  for (let x = 0; x < W; x++) grid[0][x] = { type: "stone" };
  // wood pillar
  grid[1][2] = { type: "wood" };
  grid[2][2] = { type: "wood" };
  // water pool
  for (let x = 5; x < 9; x++) grid[1][x] = { type: "water" };
  // sand pile
  grid[2][6] = { type: "sand" };
  grid[3][6] = { type: "sand" };
  grid[4][6] = { type: "sand" };
  // fire on wood
  grid[3][2] = { type: "fire", flash: true };
  // smoke above
  grid[5][2] = { type: "smoke" };
  grid[6][2] = { type: "smoke" };

  const colors: Record<Cell["type"], string> = {
    air: "transparent",
    sand: "#dac478",
    water: "#3882d2",
    stone: "#707078",
    wood: "#704c28",
    fire: "#ffc85a",
    smoke: "#505056",
    air2: "transparent"
  } as Record<Cell["type"], string>;

  return (
    <DiagramFrame title="cellular automata · 256² grid" height={totalH + 40} caption="each cell = 6 bytes · solver runs bottom-up then top-down">
      <svg
        viewBox={`-10 -10 ${totalW + 20} ${totalH + 20}`}
        className="absolute inset-0 h-full w-full"
      >
        {/* gridlines */}
        {Array.from({ length: W + 1 }).map((_, x) => (
          <line
            key={`vx${x}`}
            x1={x * cellW}
            y1={0}
            x2={x * cellW}
            y2={totalH}
            stroke="#00f0ff"
            strokeOpacity={0.1}
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: H + 1 }).map((_, y) => (
          <line
            key={`hy${y}`}
            x1={0}
            y1={y * cellH}
            x2={totalW}
            y2={y * cellH}
            stroke="#00f0ff"
            strokeOpacity={0.1}
            strokeWidth={0.5}
          />
        ))}

        {/* cells (flip y so y=0 is bottom) */}
        {grid.map((row, y) =>
          row.map((cell, x) => {
            if (cell.type === "air") return null;
            const py = totalH - (y + 1) * cellH;
            const fillColor = colors[cell.type];
            return (
              <motion.rect
                key={`${x}-${y}`}
                x={x * cellW + 1}
                y={py + 1}
                width={cellW - 2}
                height={cellH - 2}
                rx={2}
                fill={fillColor}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + (x + y) * 0.04,
                  type: "spring",
                  stiffness: 260,
                  damping: 22
                }}
                animate={
                  cell.flash
                    ? {
                        opacity: [0.7, 1, 0.7],
                        fill: ["#ffa040", "#ffe680", "#ffa040"]
                      }
                    : undefined
                }
                style={{
                  filter: cell.flash
                    ? "drop-shadow(0 0 6px #ffaa40)"
                    : cell.type === "water"
                    ? "drop-shadow(0 0 4px #3882d2aa)"
                    : undefined
                }}
              />
            );
          })
        )}

        {/* falling-sand arrows */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <FallingArrow x={6 * cellW + cellW / 2} top={totalH - 5 * cellH} bottom={totalH - 4 * cellH} color="#dac478" />
        </motion.g>

        {/* rising fire arrow */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
        >
          <RisingArrow x={2 * cellW + cellW / 2} top={totalH - 7 * cellH} bottom={totalH - 4 * cellH} color="#ffc85a" />
        </motion.g>
      </svg>
    </DiagramFrame>
  );
}

function FallingArrow({ x, top, bottom, color }: { x: number; top: number; bottom: number; color: string }) {
  return (
    <motion.g
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={color} strokeWidth={1.5} strokeDasharray="3 3" />
      <path d={`M${x - 4},${bottom - 4} L${x},${bottom} L${x + 4},${bottom - 4}`} fill={color} />
    </motion.g>
  );
}

function RisingArrow({ x, top, bottom, color }: { x: number; top: number; bottom: number; color: string }) {
  return (
    <motion.g
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={color} strokeWidth={1.5} strokeDasharray="3 3" />
      <path d={`M${x - 4},${top + 4} L${x},${top} L${x + 4},${top + 4}`} fill={color} />
    </motion.g>
  );
}

/* ---------- Ocean Tank: ripple wave propagation ---------- */

export function RippleDiagram() {
  // Animated wave on a height grid
  const W = 240;
  const H = 160;

  return (
    <DiagramFrame title="GPU water sim · ping-pong texture" caption="each pixel stores [height, velocity] · neighbours pull each other">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="water-g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="ripple-g">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#00f0ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* glass tank outline */}
        <rect x={6} y={6} width={W - 12} height={H - 12} fill="none" stroke="#fff" strokeOpacity={0.15} strokeWidth={0.6} rx={4} />

        {/* sand floor */}
        <rect x={6} y={H - 22} width={W - 12} height={16} fill="#3a2a18" opacity={0.6} />

        {/* water surface — sine wave that animates */}
        <WaterSurface w={W} h={H} />

        {/* expanding ripples */}
        {[0, 1.2, 2.4].map((delay, i) => (
          <motion.circle
            key={i}
            cx={W / 2}
            cy={56}
            r={4}
            fill="url(#ripple-g)"
            animate={{ r: [4, 70, 4], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 3.2, repeat: Infinity, delay, ease: "easeOut" }}
          />
        ))}

        {/* drop point */}
        <motion.circle
          cx={W / 2}
          cy={56}
          r={2.4}
          fill="#fff"
          animate={{ opacity: [1, 0.4, 1], r: [2, 3, 2] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* neighbour-pull arrows (centre cell + 4 neighbours) */}
        <g transform={`translate(40, ${H - 80})`}>
          <NeighborStencil />
        </g>
      </svg>
    </DiagramFrame>
  );
}

function WaterSurface({ w, h }: { w: number; h: number }) {
  const baseline = 70;
  const samples = 50;
  const points = Array.from({ length: samples + 1 }).map((_, i) => (i * w) / samples);

  return (
    <motion.g>
      {[0, 1, 2].map((layer) => (
        <motion.path
          key={layer}
          fill={layer === 0 ? "url(#water-g)" : "none"}
          stroke={layer === 0 ? "none" : "#00f0ff"}
          strokeOpacity={layer === 0 ? 0 : 0.4 / layer}
          strokeWidth={0.6}
          animate={{
            d: [
              pathD(points, baseline, h, 0, layer),
              pathD(points, baseline, h, Math.PI, layer),
              pathD(points, baseline, h, 2 * Math.PI, layer)
            ]
          }}
          transition={{
            duration: 5 + layer,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </motion.g>
  );
}

function pathD(xs: number[], baseline: number, h: number, phase: number, layer: number) {
  const amp = 4 - layer;
  const freq = 0.08 + layer * 0.04;
  const path = xs
    .map((x, i) => {
      const y = baseline + Math.sin(x * freq + phase + layer) * amp;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  if (layer === 0) {
    return `${path} L${xs[xs.length - 1]},${h} L0,${h} Z`;
  }
  return path;
}

/* ---------- Inkwell: Stable Fluids per-frame cycle ---------- */

export function InkwellCycleDiagram() {
  const cx = 180;
  const cy = 110;
  const radius = 76;

  const stages = [
    { label: "ADD FORCE", sub: "splat dye + velocity", color: "#ffae3d", angle: -90 },
    { label: "ADVECT", sub: "carry along velocity", color: "#65e88a", angle: -22 },
    { label: "PROJECT", sub: "make ∇·v = 0", color: "#5b9aff", angle: 46 },
    { label: "DISPLAY", sub: "blit dye → screen", color: "#ff7a3d", angle: 114 },
    { label: "REPEAT", sub: "60× per second", color: "#ff2bd6", angle: 178 }
  ];

  return (
    <DiagramFrame
      title="per-frame pipeline · 60 fragment passes"
      caption="Jos Stam's Stable Fluids — every frame runs the entire cycle"
      height={280}
    >
      <svg viewBox="0 0 360 220" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="ink-cycle-bg" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#100820" />
            <stop offset="100%" stopColor="#02010a" />
          </radialGradient>
          <radialGradient id="ink-cycle-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="50%" stopColor="#ffae3d" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={360} height={220} fill="url(#ink-cycle-bg)" />

        {/* outer dotted ring */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#ffae3d"
          strokeOpacity={0.18}
          strokeWidth={0.6}
          strokeDasharray="2 4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* moving pulse that traces the ring */}
        <motion.circle
          cx={cx}
          cy={cy - radius}
          r={4}
          fill="#fff"
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            filter: "drop-shadow(0 0 6px #ffae3d) drop-shadow(0 0 14px #ff7a3d)"
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Stage labels around the ring */}
        {stages.map((s, i) => {
          const a = (s.angle * Math.PI) / 180;
          const x = cx + radius * Math.cos(a);
          const y = cy + radius * Math.sin(a);
          // label offset further out
          const lx = cx + (radius + 24) * Math.cos(a);
          const ly = cy + (radius + 24) * Math.sin(a);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 240, damping: 22 }}
            >
              <circle cx={x} cy={y} r={5} fill={s.color} style={{ filter: `drop-shadow(0 0 4px ${s.color})` }} />
              <circle cx={x} cy={y} r={2} fill="#fff" />
              <text
                x={lx}
                y={ly - 2}
                textAnchor="middle"
                fill={s.color}
                fontSize="9"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
                style={{ filter: `drop-shadow(0 0 3px ${s.color}88)` }}
              >
                {s.label}
              </text>
              <text
                x={lx}
                y={ly + 8}
                textAnchor="middle"
                fill="#ffffffaa"
                fontSize="7"
                fontFamily="ui-monospace, monospace"
              >
                {s.sub}
              </text>
            </motion.g>
          );
        })}

        {/* center: pulsing dye blob */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={20}
          fill="url(#ink-cycle-core)"
          animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fill="#fff"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          fontWeight="600"
        >
          dye RT
        </text>
      </svg>
    </DiagramFrame>
  );
}

/* ---------- Inkwell: pressure projection (Helmholtz–Hodge) ---------- */

export function ProjectionDiagram() {
  // Three panels: divergent velocity → divergence-free velocity, with the projection step in between.
  const panelW = 100;
  const panelH = 100;
  const arrows = (mode: "raw" | "clean") => {
    const out: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let yi = 0; yi < 5; yi++) {
      for (let xi = 0; xi < 5; xi++) {
        const x = (xi + 0.5) * (panelW / 5);
        const y = (yi + 0.5) * (panelH / 5);
        // raw: divergent (radiating outward from a point) — fluid that's gaining mass
        // clean: incompressible (curl-only — pure rotation)
        const dx = x - panelW / 2;
        const dy = y - panelH / 2;
        const r = Math.sqrt(dx * dx + dy * dy) + 1e-3;
        let vx: number, vy: number;
        if (mode === "raw") {
          // outward + slight rotation
          vx = (dx / r) * 6 + (-dy / r) * 2;
          vy = (dy / r) * 6 + (dx / r) * 2;
        } else {
          // pure rotation
          vx = -dy / r * 5;
          vy = dx / r * 5;
        }
        out.push({ x, y, vx, vy });
      }
    }
    return out;
  };

  return (
    <DiagramFrame
      title="pressure projection · ∇·v = 0"
      caption="raw velocity field has divergence (sources/sinks) · projection makes it incompressible"
      height={200}
    >
      <svg viewBox="0 0 360 140" className="absolute inset-0 h-full w-full">
        <defs>
          <marker id="ink-arr-warn" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
            <path d="M0,0 L0,4 L3,2 z" fill="#ff7a3d" />
          </marker>
          <marker id="ink-arr-good" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
            <path d="M0,0 L0,4 L3,2 z" fill="#65e88a" />
          </marker>
        </defs>

        {/* LEFT panel — divergent */}
        <g transform="translate(20, 20)">
          <rect width={panelW} height={panelH} fill="#08020a" stroke="#ff7a3d" strokeOpacity={0.35} strokeWidth={0.6} rx={3} />
          <text x={panelW / 2} y={-4} textAnchor="middle" fill="#ff7a3d" fontSize="8" fontFamily="ui-monospace, monospace">DIVERGENT</text>
          {arrows("raw").map((a, i) => (
            <motion.line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={a.x + a.vx}
              y2={a.y + a.vy}
              stroke="#ff7a3d"
              strokeWidth={0.7}
              markerEnd="url(#ink-arr-warn)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.85 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.015, duration: 0.4 }}
            />
          ))}
        </g>

        {/* arrow + label */}
        <g transform="translate(140, 70)">
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0 }}
          >
            <line x1={0} y1={0} x2={36} y2={0} stroke="#9d00ff" strokeWidth={1.2} />
            <path d="M36,0 L30,-4 L30,4 Z" fill="#9d00ff" />
            <text x={18} y={-6} textAnchor="middle" fill="#9d00ff" fontSize="7" fontFamily="ui-monospace, monospace">
              project
            </text>
            <text x={18} y={12} textAnchor="middle" fill="#fff" fontSize="6" opacity={0.5} fontFamily="ui-monospace, monospace">
              30 Jacobi
            </text>
          </motion.g>
        </g>

        {/* RIGHT panel — divergence-free */}
        <g transform="translate(190, 20)">
          <rect width={panelW} height={panelH} fill="#08020a" stroke="#65e88a" strokeOpacity={0.45} strokeWidth={0.6} rx={3} />
          <text x={panelW / 2} y={-4} textAnchor="middle" fill="#65e88a" fontSize="8" fontFamily="ui-monospace, monospace">∇·v = 0</text>
          {arrows("clean").map((a, i) => (
            <motion.line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={a.x + a.vx}
              y2={a.y + a.vy}
              stroke="#65e88a"
              strokeWidth={0.7}
              markerEnd="url(#ink-arr-good)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.9 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 + i * 0.015, duration: 0.4 }}
            />
          ))}
        </g>
      </svg>
    </DiagramFrame>
  );
}

/* ---------- Kaleidoscope: polar fold + symmetry ---------- */

export function KaleidoscopeDiagram() {
  // Left: a single wedge with one ribbon. Right: same wedge replicated 12x with mirror.
  const SEGMENTS = 12;

  const ribbonD = (function () {
    const parts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const r = 8 + t * 56;
      const theta = Math.sin(t * Math.PI * 1.7) * 0.06;
      parts.push(`${i === 0 ? "M" : "L"}${(r * Math.cos(theta)).toFixed(1)},${(r * Math.sin(theta)).toFixed(1)}`);
    }
    return parts.join(" ");
  })();

  return (
    <DiagramFrame
      title="polar fold · the kaleidoscope trick"
      caption="one wedge of art, mirrored & repeated N times around the center"
      height={300}
    >
      <svg viewBox="0 0 360 200" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="kd-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0235" />
            <stop offset="100%" stopColor="#05020a" />
          </radialGradient>
          <radialGradient id="kd-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#ff2bd6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={360} height={200} fill="url(#kd-bg)" />

        {/* LEFT panel — single wedge */}
        <g transform="translate(80, 100)">
          <text
            x={0}
            y={-78}
            textAnchor="middle"
            fill="#00f0ff"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            opacity={0.7}
          >
            ONE WEDGE
          </text>

          {/* wedge boundary */}
          <motion.path
            d={`M0,0 L${64 * Math.cos(-Math.PI / 12)},${64 * Math.sin(-Math.PI / 12)} A64,64 0 0,1 ${64 * Math.cos(Math.PI / 12)},${64 * Math.sin(Math.PI / 12)} Z`}
            fill="#ff2bd6"
            fillOpacity={0.08}
            stroke="#ff2bd6"
            strokeOpacity={0.4}
            strokeWidth={0.5}
            strokeDasharray="2 3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />

          {/* ribbon inside wedge */}
          <motion.path
            d={ribbonD}
            stroke="#00f0ff"
            strokeWidth={1.6}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.95 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.4 }}
            style={{ filter: "drop-shadow(0 0 3px #00f0ff)" }}
          />

          <circle r={2} fill="#fff" />
        </g>

        {/* arrow */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <line x1={155} y1={100} x2={195} y2={100} stroke="#9d00ff" strokeWidth={1.2} />
          <path d="M195,100 L188,96 L188,104 Z" fill="#9d00ff" />
          <text
            x={175}
            y={92}
            textAnchor="middle"
            fill="#9d00ff"
            fontSize="8"
            fontFamily="ui-monospace, monospace"
          >
            fold ×12
          </text>
        </motion.g>

        {/* RIGHT panel — full mandala */}
        <g transform="translate(280, 100)">
          <text
            x={0}
            y={-78}
            textAnchor="middle"
            fill="#00f0ff"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            opacity={0.7}
          >
            12 SEGMENTS
          </text>

          {/* outer guide circle */}
          <circle r={64} fill="none" stroke="#fff" strokeOpacity={0.08} strokeWidth={0.4} />

          {/* SEGMENTS rotated copies of the ribbon — both sides (mirror) */}
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const angle = (i * 360) / SEGMENTS;
            return (
              <motion.g
                key={i}
                transform={`rotate(${angle})`}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 0.9, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4 + i * 0.04, duration: 0.5 }}
              >
                <path
                  d={ribbonD}
                  stroke="#00f0ff"
                  strokeWidth={1.2}
                  fill="none"
                  style={{ filter: "drop-shadow(0 0 2px #00f0ff)" }}
                />
                <g transform="scale(1, -1)">
                  <path
                    d={ribbonD}
                    stroke="#ff2bd6"
                    strokeWidth={1.2}
                    fill="none"
                    style={{ filter: "drop-shadow(0 0 2px #ff2bd6)" }}
                  />
                </g>
              </motion.g>
            );
          })}

          {/* radial guide lines for the wedge boundaries */}
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const a = (i * 2 * Math.PI) / SEGMENTS;
            return (
              <line
                key={`g${i}`}
                x1={0}
                y1={0}
                x2={64 * Math.cos(a)}
                y2={64 * Math.sin(a)}
                stroke="#fff"
                strokeOpacity={0.06}
                strokeWidth={0.3}
              />
            );
          })}

          <motion.circle
            r={9}
            fill="url(#kd-core)"
            animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle r={1.6} fill="#fff" />
        </g>
      </svg>
    </DiagramFrame>
  );
}

function NeighborStencil() {
  const s = 14;
  const cells: { dx: number; dy: number; label: string; color: string }[] = [
    { dx: 0, dy: 0, label: "h", color: "#fff" },
    { dx: 1, dy: 0, label: "→", color: "#00f0ff" },
    { dx: -1, dy: 0, label: "←", color: "#00f0ff" },
    { dx: 0, dy: -1, label: "↑", color: "#00f0ff" },
    { dx: 0, dy: 1, label: "↓", color: "#00f0ff" }
  ];
  return (
    <g>
      {cells.map((c) => (
        <motion.g
          key={c.label}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <rect
            x={c.dx * s + 30 - s / 2}
            y={c.dy * s + 30 - s / 2}
            width={s}
            height={s}
            fill={c.dx === 0 && c.dy === 0 ? "#ff2bd633" : "#0b0d14"}
            stroke={c.color}
            strokeOpacity={0.5}
            strokeWidth={0.6}
            rx={1.5}
          />
          <text
            x={c.dx * s + 30}
            y={c.dy * s + 33}
            textAnchor="middle"
            fill={c.color}
            fontSize="7"
            fontFamily="ui-monospace, monospace"
          >
            {c.label}
          </text>
        </motion.g>
      ))}
    </g>
  );
}
