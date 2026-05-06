"use client";

import { Block, Callout, CodeBlock, Formula, Pipeline, StatGrid, TagRow } from "@/components/projects/Block";
import { CellularGridDiagram } from "@/components/projects/Diagram";
import { motion } from "framer-motion";

export const fallingSandGlyph = (
  <svg viewBox="0 0 400 240" className="h-full w-full">
    <defs>
      <linearGradient id="fs-glow" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#b6ff00" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0b0d14" stopOpacity="0" />
      </linearGradient>
    </defs>
    {Array.from({ length: 16 }).map((_, x) =>
      Array.from({ length: 9 }).map((_, y) => {
        const id = (x * 7 + y * 11) % 9;
        const colors = ["#dac478", "#3882d2", "#707078", "#704c28", "#ffc85a", "#505056", "#dce6f0", "#8c8c98", "#fff0a0"];
        const c = colors[id];
        const opacity = (x + y) % 4 === 0 ? 0.65 : 0.25;
        return <rect key={`${x}-${y}`} x={x * 25} y={y * 26} width={22} height={22} fill={c} opacity={opacity} />;
      })
    )}
    <rect x={0} y={0} width={400} height={240} fill="url(#fs-glow)" />
  </svg>
);

export default function FallingSandContent() {
  return (
    <>
      <Block kicker="what it is" title="A pixel sandbox where every grain has a soul" accent="lime">
        <p>
          Falling Sand is a Noita / Sandspiel-style 2D pixel physics sandbox. Drop sand,
          it falls. Pour water, it fills the bottom. Light wood on fire and watch
          smoke rise out of the top. Throw a spark at iron and electricity arcs across
          the wire. Ten elements, one grid, every cell talking to its neighbours
          sixty times per second.
        </p>
        <p>
          A 256×256 grid means <strong>65,536 individual cells</strong> being asked
          &quot;what should you do this frame?&quot; on every tick. The whole simulation
          is rules — no graphics tricks, no physics engine. Just little stacks of
          cells deciding whether to swap places with the cell below them.
        </p>
        <TagRow items={["Unity 6", "Burst Jobs", "Cellular Automata", "WebGL"]} />
      </Block>

      <Block kicker="the rules" title="Each element is just six bytes and a behaviour" accent="lime">
        <p>
          Every cell is an <code className="font-mono text-neon-cyan">Element</code>{" "}
          struct: an id (1 byte), a life timer (1 byte), and a colour (4 bytes). Six
          bytes per cell, 96 KB for the whole world. Elements differ only in what
          rule the solver runs when it finds them.
        </p>
        <CodeBlock>{`struct Element {
  byte id;       // Air, Sand, Water, Stone, Wood,
                 // Fire, Smoke, Steam, Iron, Spark
  byte life;     // ticks remaining, or "energized" timer
  Color32 color; // jittered at paint time so piles aren't flat
}`}</CodeBlock>
        <p>
          Sand wants to fall. Water wants to fall <em>and</em> spread sideways. Fire
          wants to rise and decay into smoke. Spark wants to leap to its neighbours.
          The rules are tiny — most are 20 lines — but compose into chemistry.
        </p>
        <CellularGridDiagram />
      </Block>

      <Block kicker="the solver" title="Three passes, one for each personality" accent="lime">
        <p>
          A naive solver loops the grid once and breaks immediately — sand updated
          first crashes through water that hasn&apos;t moved yet, fire updated last
          collides with smoke that already rose. The fix is a three-pass solver
          where each pass walks the grid in the direction the element wants to go.
        </p>
        <Pipeline
          steps={[
            { label: "Pass 1 — bottom-up", sub: "Sand & Water (anything that falls)" },
            { label: "Pass 2 — top-down", sub: "Fire, Smoke, Steam (anything that rises)" },
            { label: "Pass 3 — any order", sub: "Electricity propagation, guarded by a 'processed' byte buffer" }
          ]}
        />
        <p>
          Each pass also alternates left-to-right vs right-to-left every tick, so sand
          piles don&apos;t consistently lean to one side. A subtle thing — without it
          everything drifts west.
        </p>
        <Formula
          expr={`for sand at (x, y):
  if below is air or water → swap
  else if below-left or below-right is air → swap (random pick)
  else stay`}
          caption="that's the entire sand rule"
        />
      </Block>

      <Block kicker="chemistry" title="When two elements meet, the rule fires" accent="lime">
        <p>
          The interesting moments are at boundaries. Fire next to water doesn&apos;t
          make &quot;fire+water&quot; — it produces steam, and the fire dies. Fire next to
          wood ignites it. Sparks on iron energize it for 8 ticks; energized iron
          arcs into adjacent water, which conducts and energizes its neighbours too.
        </p>
        <StatGrid
          items={[
            { label: "Fire + Water", value: "→ Steam", sub: "fire dies" },
            { label: "Fire + Wood", value: "→ Fire", sub: "5% per tick" },
            { label: "Fire decay", value: "→ Smoke", sub: "85% / 15% air" },
            { label: "Steam decay", value: "→ Water", sub: "after 180 ticks" },
            { label: "Spark + Iron", value: "→ Energized", sub: "8 ticks, conducts" },
            { label: "Energized + Air", value: "→ Spark arc", sub: "18% chance per neighbor" }
          ]}
        />
        <Callout tone="default">
          The whole element table is &lt; 400 lines of code. The depth comes from the
          interactions, not the count. Add wood, get burning forests. Add iron, get
          circuit puzzles. Add water, get steam engines.
        </Callout>
      </Block>

      <Block kicker="why one thread" title="The race condition you can't outrun" accent="lime">
        <p>
          Cellular automata <em>look</em> embarrassingly parallel — every cell&apos;s
          rule reads its neighbours, why not parallelize per cell? Because the rule
          isn&apos;t &quot;read&quot; — it&apos;s <strong>swap</strong>. Two threads both deciding to
          move sand into the same cell below them produces tearing, lost cells,
          duplicated cells. There&apos;s no lock-free fix that doesn&apos;t reintroduce
          a global ordering.
        </p>
        <p>
          So the solver is single-threaded. But it&apos;s a <strong>Burst-compiled</strong>{" "}
          single-threaded job — Unity&apos;s LLVM-based compiler emits SIMD-aware native
          code, and the inner loop is tight. 256² cells × 3 passes × 60 fps lands
          in about 1.4 ms on a desktop browser.
        </p>
        <Callout tone="win">
          Right answer: not &quot;parallelize harder.&quot; Right answer: &quot;optimize
          single-thread until parallel doesn&apos;t matter.&quot;
        </Callout>
      </Block>

      <Block kicker="rendering" title="One texture upload, no mesh, no fancy shaders" accent="lime">
        <p>
          The grid renders as a Texture2D the same size as the simulation. The colorize
          job walks all 65k cells, picks a colour (with dynamic interpolation for
          fire/smoke/steam/spark whose <code className="font-mono">life</code> drives
          their hue), and writes RGBA32 to a pixel buffer. One{" "}
          <code className="font-mono text-neon-cyan">SetPixelData</code> call per
          frame, one <code className="font-mono">Apply(false)</code>, done.
        </p>
        <Pipeline
          steps={[
            { label: "SolverJob", sub: "3-pass cellular update on NativeArray<Element>" },
            { label: "ColorizeJob", sub: "Element[] → Color32[] (dynamic colors for life-decaying elements)" },
            { label: "Texture2D.SetPixelData + Apply", sub: "single GPU upload, no mesh, no shader gymnastics" }
          ]}
        />
      </Block>

      <Block kicker="the journey" title="The cellular automata I almost gave up on" accent="pink">
        <p>
          Three weeks. Most of it was solving problems that weren&apos;t about cellular
          automata at all.
        </p>
        <Callout tone="struggle">
          <strong>The first solver was wrong in a way I couldn&apos;t see.</strong> Sand
          looked fine. Water looked fine. But pour them together and water beads
          would mysteriously vanish. Took two days to realise: when sand and water
          both wanted to swap into the same cell on the same tick, one would
          overwrite the other. The fix was the three-pass design. You can&apos;t skip
          to the &quot;clever&quot; solver until the obvious one has bitten you twice.
        </Callout>
        <Callout tone="struggle">
          <strong>Mouse painting was off-by-half.</strong> Click somewhere on the canvas,
          paint appears at the corner. Same WebGL bug as the galaxy:{" "}
          <code className="font-mono">RaycastHit.textureCoord</code> doesn&apos;t populate
          for <code className="font-mono">Collider.Raycast</code>, only for{" "}
          <code className="font-mono">Physics.Raycast</code>. And even with the right
          raycast, you have to remember the quad is centred at origin so you{" "}
          <code className="font-mono">+0.5</code> manually to get a 0..1 UV.
        </Callout>
        <Callout tone="struggle">
          <strong>Electricity broke everything.</strong> Spark + iron + water turned out
          to be a propagation cascade that could update the same cell multiple times in
          one tick — energizing, decaying, and re-energizing in a single solver pass.
          Spent a Saturday tracing it. Fix: a parallel{" "}
          <code className="font-mono">processed[]</code> byte buffer cleared every
          frame, set when a cell is touched by Pass 3. Once a cell is marked, it&apos;s
          off-limits for the rest of this tick.
        </Callout>
        <p>
          The discipline that saved this project was writing the rules one element at a
          time, with sand alone in the world for two days before water even existed.
          Sand had to feel correct. Water had to feel correct. Then their interaction
          had to feel correct. Skip a step and you don&apos;t know which rule is wrong.
        </p>
      </Block>

      <Closing accent="lime" />
    </>
  );
}

function Closing({ accent }: { accent: "cyan" | "pink" | "lime" | "purple" }) {
  const color = { cyan: "#00f0ff", pink: "#ff2bd6", lime: "#b6ff00", purple: "#9d00ff" }[accent];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-24 text-center"
    >
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mb-4 h-px w-32"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        }}
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
        end of breakdown
      </p>
    </motion.div>
  );
}
