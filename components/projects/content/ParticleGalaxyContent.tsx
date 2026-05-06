"use client";

import { Block, Callout, CodeBlock, Formula, Pipeline, StatGrid, TagRow } from "@/components/projects/Block";
import { GalaxyDiagram } from "@/components/projects/Diagram";
import { motion } from "framer-motion";

export const particleGalaxyGlyph = (
  <svg viewBox="-180 -120 360 240" className="h-full w-full">
    <defs>
      <radialGradient id="g-glyph" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={0} cy={0} r={50} fill="url(#g-glyph)" />
    {[40, 70, 100, 140].map((r, i) => (
      <ellipse
        key={r}
        cx={0}
        cy={0}
        rx={r}
        ry={r * 0.55}
        fill="none"
        stroke="#ff2bd6"
        strokeOpacity={0.5 - i * 0.08}
        strokeWidth={1}
      />
    ))}
    {Array.from({ length: 80 }).map((_, i) => {
      const a = (i * 47.5 * Math.PI) / 180;
      const r = 30 + ((i * 13) % 130);
      return (
        <circle
          key={i}
          cx={r * Math.cos(a)}
          cy={r * Math.sin(a) * 0.55}
          r={1.4}
          fill={`hsl(${(i * 13) % 360}, 90%, 70%)`}
          opacity={0.7}
        />
      );
    })}
  </svg>
);

export default function ParticleGalaxyContent() {
  return (
    <>
      <Block kicker="what it is" title="A swarm of 5,000 stars on the dance floor" accent="purple">
        <p>
          Particle Galaxy is a 2D N-body-lite simulation. Five thousand particles orbit a
          central gravity well, smearing glowing trails across the screen as they go.
          Drag the mouse to pull them in or push them away. Pipe in audio and the
          whole thing turns into a music visualiser — bass drives gravity, mids drive
          spin, treble drives the trail decay.
        </p>
        <p>
          No win condition. No fail state. It&apos;s a pretty machine that responds to
          your fingers and your music. That was the entire goal.
        </p>
        <TagRow items={["Unity 6", "Burst Jobs", "C#", "WebGL", "Audio reactive"]} />
      </Block>

      <Block kicker="the math" title="Newtonian gravity, smoothed" accent="purple">
        <p>
          Every frame each particle pulls toward the center with a force proportional to
          inverse-square distance — the same law that makes planets orbit stars. The
          twist: when two bodies sit on top of each other, naive 1/r² explodes to
          infinity and the simulation detonates. We add a soft-radius constant so
          forces stay bounded near the core.
        </p>
        <Formula
          expr={`F(r)  =  centerForce / (r²  +  ε²)
ε² = 0.012   ← the trick that keeps the core from blowing up`}
          caption="softened Newtonian attraction"
        />
        <p>
          On top of that there&apos;s a tangential <em>spin</em> term — a perpendicular
          push that makes orbits drift instead of just falling straight in. Plus
          velocity damping per frame so energy bleeds off and the swarm settles into
          something graceful instead of escaping to infinity.
        </p>
        <Formula
          expr={`v ← v · (1 − damping)
v ← v + spin · perp(p) · falloff(|p|)
p ← p + v · dt`}
          caption="per-particle integration · 5,000× per frame, on Burst-compiled jobs"
        />
        <GalaxyDiagram />
      </Block>

      <Block kicker="the pipeline" title="Two jobs, one texture, sixty frames a second" accent="purple">
        <p>
          The whole simulation lives in two Burst-compiled <code className="font-mono text-neon-cyan">IJob</code>s
          and one <code className="font-mono text-neon-cyan">Texture2D</code>. There&apos;s no
          renderer trick, no particle system, no instancing — every star is a few
          pixels we paint into a buffer and upload to the GPU once per frame.
        </p>
        <Pipeline
          steps={[
            { label: "Read mouse → world coords", sub: "Physics.Raycast → InverseTransformPoint" },
            { label: "SimJob: integrate motion", sub: "gravity + spin + mouse + damping → Verlet step" },
            { label: "ColorizeJob: fade & splat", sub: "multiply pixel buffer by 0.892, then draw 5-pixel Gaussians" },
            { label: "SetPixelData + Apply", sub: "single texture upload to the URP/Unlit material" }
          ]}
        />
        <Callout tone="win">
          The whole render loop allocates <strong>zero</strong> bytes after <code className="font-mono">Start()</code>.
          That&apos;s why it can hold 60fps with 5k particles in a WebGL build.
        </Callout>
      </Block>

      <Block kicker="the trails" title="Per-channel fade is the secret weapon" accent="purple">
        <p>
          Trails come from a per-frame multiplicative fade of every pixel in the buffer.
          Multiply by <code className="font-mono text-neon-cyan">0.892</code> and after
          ~30 frames a star&apos;s glow has faded to nothing — long enough to read the
          motion, short enough not to clog the screen.
        </p>
        <p>
          The clever bit is fading red, green, and blue at <em>different rates</em>. Bias
          fade towards red and you get a fire-trail effect. Bias toward blue and it
          looks like electric arcs. Same code, completely different vibe.
        </p>
        <CodeBlock>{`// ColorizeJob — Pass 1
for each pixel:
  c.r *= fadeR    // 0.95 → fire trails (warm lingers)
  c.g *= fadeG
  c.b *= fadeB    // 0.95 → electric trails (cool lingers)`}</CodeBlock>
      </Block>

      <Block kicker="audio reactivity" title="The speakers steer the simulation" accent="purple">
        <p>
          Capture a browser tab&apos;s audio, run a 64-band FFT, fold those bands into
          three numbers — bass, mid, treble — and route each one to a sim parameter
          via a dropdown matrix. The user picks which band drives which thing. The
          band drivers can&apos;t collide (UI enforces uniqueness), so you always get a
          clean three-way split.
        </p>
        <StatGrid
          items={[
            { label: "Default Bass →", value: "Spin", sub: "in music mode" },
            { label: "Default Mid →", value: "Gravity", sub: "0.6 strength" },
            { label: "Default Treble →", value: "Trail Fade", sub: "0.4 strength" },
            { label: "Beat detection", value: "RMS + transient", sub: "spectral flux" },
            { label: "Pulse on beat", value: "1.6 outward", sub: "+ 12 snap-back" },
            { label: "FFT bands", value: "64", sub: "64-bin spectrum bar overlay" }
          ]}
        />
        <p>
          On a detected beat, every particle gets a one-shot outward radial kick —
          the swarm explodes — and at the same time the center gravity briefly spikes
          12× so they all snap back to the middle. Visually it reads as a heartbeat.
        </p>
      </Block>

      <Block kicker="the journey" title="What it took to make this work" accent="pink">
        <p>
          Easy to imagine. Not easy to ship. Three things almost broke it.
        </p>
        <Callout tone="struggle">
          <strong>WebGL stripped my shader.</strong> Build worked in editor, white quad
          in browser. The unlit shader wasn&apos;t referenced by any scene asset, so the
          IL2CPP build pipeline stripped it and <code className="font-mono">Shader.Find</code>{" "}
          returned <code className="font-mono">null</code>. Fix: ditch{" "}
          <code className="font-mono">new Material(Shader.Find(...))</code> and assign
          a <code className="font-mono">.mat</code> asset to the renderer in the scene. The asset
          reference forces the shader to ship.
        </Callout>
        <Callout tone="struggle">
          <strong>IJobParallelFor fought me.</strong> The natural shape is &quot;each
          particle is independent, parallelize per-particle.&quot; But Burst&apos;s safety
          system disagrees the moment two particles touch the same pixel in the
          colorize pass. Fix: drop down to plain <code className="font-mono">IJob</code>{" "}
          and live with single-threaded sim. Burst still vectorizes the inner loop —
          5,000 particles fit in 0.4ms.
        </Callout>
        <Callout tone="struggle">
          <strong>RaycastHit.textureCoord lies in WebGL.</strong> Worked everywhere
          except where it matters. Mouse interactions painted at (0,0) in the corner.
          Fix: ignore <code className="font-mono">textureCoord</code>, take the world hit
          point, run it through <code className="font-mono">InverseTransformPoint</code> to
          get UV manually. Boring work, but it&apos;s the only way it&apos;s reliable.
        </Callout>
        <p>
          Each of those took a full afternoon. None of them showed up in any tutorial.
          The code in the repo is short — about 800 lines — but every line had to
          earn its place.
        </p>
      </Block>

      <Closing accent="purple" />
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
