"use client";

import { Block, Callout, CodeBlock, Formula, Pipeline, StatGrid, TagRow } from "@/components/projects/Block";
import { InkwellCycleDiagram, ProjectionDiagram } from "@/components/projects/Diagram";
import { motion } from "framer-motion";

export const inkwellGlyph = (
  <svg viewBox="0 0 400 240" className="h-full w-full">
    <defs>
      <radialGradient id="ig-orange" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="40%" stopColor="#ff7a3d" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ig-green" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="40%" stopColor="#65e88a" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#65e88a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ig-blue" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
        <stop offset="40%" stopColor="#5b9aff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#5b9aff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={130} cy={120} rx={75} ry={55} fill="url(#ig-orange)" />
    <ellipse cx={205} cy={110} rx={55} ry={50} fill="url(#ig-green)" />
    <ellipse cx={290} cy={120} rx={70} ry={55} fill="url(#ig-blue)" />
    {/* curling tendrils */}
    <path
      d="M130,90 Q150,40 110,20"
      stroke="#ff7a3d"
      strokeOpacity={0.4}
      strokeWidth={1.4}
      fill="none"
    />
    <path
      d="M205,75 Q220,30 195,10"
      stroke="#65e88a"
      strokeOpacity={0.4}
      strokeWidth={1.4}
      fill="none"
    />
    <path
      d="M290,90 Q310,45 270,15"
      stroke="#5b9aff"
      strokeOpacity={0.4}
      strokeWidth={1.4}
      fill="none"
    />
  </svg>
);

export default function InkwellContent() {
  return (
    <>
      <Block kicker="what it is" title="Real ink, real water, in real time" accent="amber">
        <p>
          Inkwell is a fluid painter. Drag your mouse across the canvas and coloured
          dye gets injected into a real-time fluid simulation — not a particle
          system, not a sprite trail, but an honest-to-god solver for the equations
          of incompressible flow. Three plumes of orange, green and blue swirl into
          each other on a black canvas, glowing through a bloom pass, doing exactly
          what ink does in water.
        </p>
        <p>
          Right-click to paint walls — the fluid flows around them. Turn on thermal
          mode and warm dye rises like smoke. Turn on reactive mode and red+green
          mix into yellow. Five presets shift the entire feel of the fluid (Marble,
          Smoke, Galaxy, Reactive, Calm) by tuning a handful of physical knobs.
        </p>
        <TagRow items={["Unity 6", "URP", "HLSL Shaders", "WebGL", "GPU Fluid Sim", "Stable Fluids"]} />
      </Block>

      <Block kicker="the math" title="Navier–Stokes, divergence-free" accent="amber">
        <p>
          Fluids are described by the Navier–Stokes equations. The version Inkwell
          solves is the <strong>incompressible</strong> form — fluid volume is
          conserved, mass cannot appear or disappear. Two terms, one constraint:
        </p>
        <Formula
          expr={`∂v/∂t  +  (v·∇)v   =   −∇p     ← momentum: force = pressure gradient
∇·v  =  0                          ← incompressibility: no sources, no sinks`}
          caption="velocity v(x, t) and pressure p(x, t) — the only unknowns"
        />
        <p>
          Solving these directly is hard. But Jos Stam&apos;s 2003 paper{" "}
          <em>Stable Fluids</em> showed an elegant operator-split that&apos;s
          unconditionally stable: do the steps separately. Push the fluid around
          ignoring incompressibility, then <strong>project</strong> the result back
          onto the divergence-free subspace. Repeat 60 times a second.
        </p>
      </Block>

      <Block kicker="the pipeline" title="One frame is sixty fragment passes" accent="amber">
        <p>
          Every Update tick is a careful ballet of <code className="font-mono text-neon-cyan">Graphics.Blit</code> calls.
          The output of each pass becomes the input of the next, written into the
          opposite half of a ping-pong RenderTexture. Nothing leaves the GPU.
        </p>
        <Pipeline
          steps={[
            { label: "AddForce", sub: "splat mouse Δuv into velocity, brushColor into dye, 1.0 into mask" },
            { label: "Buoyancy (optional)", sub: "warm dye contributes positive Y velocity — thermal mode" },
            { label: "Advect velocity", sub: "semi-Lagrangian backtrace: each cell looks back along its own velocity" },
            { label: "Divergence", sub: "1 pass: ∇·v computed and written into a scalar RT" },
            { label: "Pressure (Jacobi × 30)", sub: "iteratively solve ∇²p = ∇·v for the pressure field" },
            { label: "Subtract gradient", sub: "v ← v − ∇p — now the velocity is incompressible" },
            { label: "ApplyMask velocity", sub: "zero out velocity inside the obstacle mask" },
            { label: "Advect dye", sub: "same advect shader, but moving the dye field by the cleaned velocity" },
            { label: "React (optional)", sub: "R+G→Y, R+B→M, G+B→C — three-channel dye chemistry" },
            { label: "Display", sub: "bind live dye RT to material — URP camera applies bloom" }
          ]}
        />
        <InkwellCycleDiagram />
      </Block>

      <Block kicker="the heart" title="Pressure projection — the magic step" accent="amber">
        <p>
          The pipeline&apos;s most subtle pass is <em>projection</em>. After advection
          velocity is no longer divergence-free — fluid is &quot;leaking&quot; in or out of
          cells. Left alone, the simulation visibly bulges and balloons. The fix is
          a chunk of vector calculus called the <strong>Helmholtz–Hodge decomposition</strong>:
          any vector field can be split into a divergence-free part plus a gradient
          of some scalar. Find that scalar, subtract its gradient, you&apos;re back
          on the divergence-free manifold.
        </p>
        <Formula
          expr={`v  =  v_clean  +  ∇p                    Helmholtz–Hodge
∇·v = ∇²p                              taking divergence of both sides
solve ∇²p = ∇·v   (Poisson equation, Jacobi iterations)
v_clean = v − ∇p                        the desired incompressible field`}
          caption="three passes per frame solve a partial differential equation. Welcome to GPU computing without compute shaders."
        />
        <ProjectionDiagram />
        <p>
          The Poisson solve uses 30 Jacobi iterations — each iteration is a full
          fragment-shader Blit averaging a cell&apos;s 4 neighbours. Drop below 20
          and you can see the fluid swelling like a slow balloon. Bump above 40 and
          your frame budget melts. Thirty is the sweet spot for 60fps WebGL on
          integrated GPUs.
        </p>
      </Block>

      <Block kicker="ping-pong" title="Two textures pretending to be one" accent="amber">
        <p>
          A fragment shader can&apos;t write to the texture it&apos;s reading from.
          So every field that mutates over time gets <strong>two</strong> render
          textures: read from A, write to B, swap A ↔ B for the next pass. Inkwell
          ping-pongs four fields per frame.
        </p>
        <StatGrid
          items={[
            { label: "Velocity RT", value: "RGHalf", sub: "2 components — vx, vy" },
            { label: "Pressure RT", value: "RHalf", sub: "scalar — solved by Jacobi" },
            { label: "Divergence RT", value: "RHalf", sub: "scalar — input to pressure solve" },
            { label: "Dye RT", value: "ARGBHalf", sub: "RGBA — the visible canvas" },
            { label: "Mask RT", value: "RHalf", sub: "0 = clear, 1 = wall" },
            { label: "Grid", value: "1024 × 576", sub: "auto-fit to camera aspect" }
          ]}
        />
        <Callout tone="default">
          Why <em>Half</em>-float and not full float? Because <code className="font-mono">RGFloat</code>{" "}
          isn&apos;t universally supported on WebGL2.{" "}
          <code className="font-mono">RGHalf</code> is. The simulation is sensitive
          to precision in the pressure solve, but 16-bit half is enough for visually
          stable fluid at this grid size.
        </Callout>
      </Block>

      <Block kicker="the look" title="Five presets, one shader stack" accent="amber">
        <p>
          The equations are the same in every preset — only the knobs change.
          Tweak viscosity, dissipation, force scale and bloom, and the same solver
          produces wildly different fluids.
        </p>
        <StatGrid
          items={[
            { label: "Marble", value: "high diffuse", sub: "ink in glycerin · slow swirls" },
            { label: "Smoke", value: "buoyancy on", sub: "warm rises · fast fade" },
            { label: "Galaxy", value: "low viscosity", sub: "max bloom · trails forever" },
            { label: "Reactive", value: "RGB chem", sub: "R+G→Y · R+B→M · G+B→C" },
            { label: "Calm", value: "high viscosity", sub: "tranquil · minimal force" },
            { label: "Bloom", value: "URP Volume", sub: "post-process intensity 0.6" }
          ]}
        />
      </Block>

      <Block kicker="audio + walls" title="Sound moves the fluid, walls stop it" accent="amber">
        <p>
          The same audio reactor pattern from Kaleidoscope ports cleanly here — mic
          or browser-tab capture, FFT bands, configurable routes. Bass swells the
          force. Mids spread the dye. Treble adds turbulence. The plumes dance.
        </p>
        <p>
          Obstacles are a separate persistent RT: right-click drag splats{" "}
          <code className="font-mono text-neon-cyan">1.0</code> into the mask, and
          two ApplyMask passes per frame zero velocity and dye inside it. Fluid
          flows around walls. Toggle them off and the painting resumes uninterrupted.
        </p>
      </Block>

      <Block kicker="the journey" title="Building a 2003 paper for 2026 browsers" accent="pink">
        <p>
          Stam&apos;s paper is 23 years old and it&apos;s still <em>the</em> way
          to do real-time fluids. But every implementation choice the paper made was
          for desktop OpenGL with full-float pixel shaders. Inkwell had to land all
          of it on WebGL2 in a browser, and that meant tripping over five subtle
          things in sequence.
        </p>
        <Callout tone="struggle">
          <strong>WebGL has no compute shaders.</strong> Every modern GPU fluid sim
          starts with a single compute kernel doing the whole solve. Not an option
          here. Inkwell does the entire pipeline as <em>fragment</em> shaders driven
          by <code className="font-mono">Graphics.Blit</code> — about 60 passes per
          frame at 60fps. Architectural pain that turned out to be the right call:
          fragment shaders run on every WebGL2 device that exists.
        </Callout>
        <Callout tone="struggle">
          <strong>RGFloat textures aren&apos;t universal.</strong> First build,
          black screen. The velocity field RT was failing to allocate on the test
          machine. Switch to <code className="font-mono">RGHalf</code> — universally
          supported, half the memory, marginally less precision. The pressure solve
          can take it; the visual difference is invisible.
        </Callout>
        <Callout tone="struggle">
          <strong>Pressure projection blew up.</strong> Early build with 10 Jacobi
          iterations: fluid looked alive for a second, then a slow horrifying
          balloon as compressibility error compounded. Bumping to 20 reduced the
          bulge but left visible artifacts during fast drags. 30 made it stable
          everywhere I could break it. The number is in the paper&apos;s recommended
          range — but you don&apos;t learn what it means until you watch it fail.
        </Callout>
        <Callout tone="struggle">
          <strong>Mouse picking was off-by-half — again.</strong> Same WebGL bug as
          every other project: <code className="font-mono">RaycastHit.textureCoord</code>{" "}
          doesn&apos;t populate consistently. Fix is the same: ray-plane intersection
          in the renderer&apos;s local space, do the UV math myself. Adding{" "}
          <code className="font-mono">+ 0.5</code> because the quad is centered at
          origin. I wrote this code three times before it stopped surprising me.
        </Callout>
        <Callout tone="struggle">
          <strong>Bloom + HDR dye RT fought each other.</strong> URP&apos;s bloom
          samples the camera output at multiple resolutions; with{" "}
          <code className="font-mono">ARGBHalf</code> dye and aggressive force
          scale, individual bright pixels would overflow into NaN regions and
          poison the bloom downsample. Fix: clamp dye colour at injection time so
          the field can&apos;t go above ~3.0, then let bloom do its thing on values
          it can handle.
        </Callout>
        <p>
          What saved it was the discipline of building it in <strong>nine
          numbered phases</strong>. Phase 1 was velocity field + advect-only,
          rendered as raw RG colours so I could see the field. Each phase had a
          single new feature and a verification screenshot before the next phase
          started. By the time I got to bloom and audio routing, the fluid solver
          was rock solid — so when something looked weird, I knew exactly where to
          look. Skipping phases and bundling features always costs more time than
          the discipline does.
        </p>
      </Block>

      <Closing accent="amber" />
    </>
  );
}

function Closing({ accent }: { accent: "cyan" | "pink" | "lime" | "purple" | "amber" }) {
  const color = {
    cyan: "#00f0ff",
    pink: "#ff2bd6",
    lime: "#b6ff00",
    purple: "#9d00ff",
    amber: "#ffae3d"
  }[accent];
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
