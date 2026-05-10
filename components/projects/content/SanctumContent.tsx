"use client";

import { Block, Callout, CodeBlock, Formula, Pipeline, StatGrid, TagRow } from "@/components/projects/Block";
import { SanctumLightDiagram } from "@/components/projects/Diagram";
import { motion } from "framer-motion";

export const sanctumGlyph = (
  <svg viewBox="0 0 400 240" className="h-full w-full">
    <defs>
      <linearGradient id="sg-beam" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#ff5e8a" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ff5e8a" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="sg-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={200} cy={90} rx={120} ry={70} fill="url(#sg-halo)" />
    {/* Pointed arch + window grid */}
    <path d="M140,40 L200,8 L260,40 Z" fill="#231a26" />
    {(() => {
      const cells: React.ReactNode[] = [];
      const palette = ["#ff5e8a", "#5b9aff", "#65e88a", "#ffc857", "#c477ff", "#ff3b3b", "#5fe0e8", "#f5efdc", "#ff8a3d"];
      let i = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push(
            <rect
              key={`p${i}`}
              x={140 + c * 40 + 1}
              y={40 + r * 32 + 1}
              width={38}
              height={30}
              rx={2}
              fill={palette[i++]}
            />
          );
        }
      }
      return cells;
    })()}
    {/* lead lines */}
    {[1, 2].map((c) => (
      <line key={`v${c}`} x1={140 + c * 40} y1={40} x2={140 + c * 40} y2={136} stroke="#1a1620" strokeWidth={2.5} />
    ))}
    {[1, 2].map((r) => (
      <line key={`h${r}`} x1={140} y1={40 + r * 32} x2={260} y2={40 + r * 32} stroke="#1a1620" strokeWidth={2.5} />
    ))}
    {/* god-rays */}
    <path d="M150,140 L170,140 L130,230 L100,230 Z" fill="url(#sg-beam)" />
    <path d="M195,140 L205,140 L210,230 L190,230 Z" fill="url(#sg-beam)" opacity={0.7} />
    <path d="M240,140 L260,140 L300,230 L270,230 Z" fill="url(#sg-beam)" opacity={0.85} />
  </svg>
);

export default function SanctumContent() {
  return (
    <>
      <Block kicker="what it is" title="A small temple, lit by colored light" accent="rose">
        <p>
          Sanctum is a sacred space rendered in real time. A stone chamber. A
          stained-glass window of nine coloured panels. The sun outside. Click a
          colour and the panels retint; click a metal and the lead frames change
          alloy. Light beams through the glass as <em>volumetric god-rays</em> that
          cut diagonally across the chamber, lands as <em>coloured pools</em> on a
          polished stone floor, and the entire scene gets <em>mirrored</em> back at
          you from below. The floor is a planar reflection rig. The light is a
          procedural frustum cone. The dust drifting through the beams is 3D noise.
        </p>
        <p>
          The pitch is literal: <strong>elements</strong> (glass tints + frame
          metals), <strong>light</strong> (volumetric beams + colour projection),
          <strong>reflection</strong> (mirrored floor + Fresnel-weighted glass).
          Three classic graphics topics on display, doing one beautiful thing.
        </p>
        <TagRow items={["Unity 6", "URP", "Custom HLSL", "Planar Reflection", "Procedural Shaders", "WebGL"]} />
      </Block>

      <Block kicker="the scene" title="A chamber where light is the actor" accent="rose">
        <p>
          The chamber is small on purpose — about 5×3×4 metres. Tight enough that
          every beam from every panel is visible at once. Wooden pews flank a
          central aisle. A stepped stone altar sits at the end. A pointed-arch
          stone band rises above the window. Outside, a procedural sky with FBM
          clouds and a horizon of cypress trees.
        </p>
        <Pipeline
          steps={[
            { label: "Stone walls + floor + ceiling", sub: "primitives with Voronoi-cells stone shader (mortar lines + per-cell color variance)" },
            { label: "Stained glass — 3×3 grid", sub: "9 panels, each its own MeshRenderer + tint via MaterialPropertyBlock" },
            { label: "Lead frames", sub: "36 cube strips with metal materials (Lead, Brass, Silver, Copper)" },
            { label: "God-rays — 9 frustum meshes", sub: "one cone per panel, additive shader, 3D-noise dust" },
            { label: "Floor splashes", sub: "9 quads positioned each frame by ray-plane intersection" },
            { label: "Planar reflection rig", sub: "secondary mirrored camera renders scene-minus-floor into RT" },
            { label: "Garden + sky outside", sub: "GardenSky FBM clouds + GardenGround Worley grass + 5 cypress trees" },
            { label: "Candles + chandelier + dust", sub: "4 sconces + 8-candle chandelier ring · CandleFlicker noise · ParticleSystem motes" }
          ]}
        />
      </Block>

      <Block kicker="the light path" title="From sun to splash, to mirror, in one frame" accent="rose">
        <p>
          The most interesting part of Sanctum is what happens to a single ray of
          sunlight. It enters the scene angled through the window, passes through
          a stained-glass panel that tints it, travels through a volume of dusty
          air on its way down, lands on the floor as a coloured pool, and is then
          reflected back upward into the camera. Every step is a separate piece of
          shader code.
        </p>
        <SanctumLightDiagram />
        <p>
          Each panel has three shader-stage influences on the final pixel: it
          tints the directional light at <em>shading</em> time (via stained-glass
          translucency), it tints the <em>volumetric beam</em> via the god-ray
          shader, and it tints the <em>floor splash quad</em> at the beam&apos;s
          ground-intersection point. Three places, three shaders, one consistent
          colour.
        </p>
      </Block>

      <Block kicker="god-rays" title="No compute shaders, so beams are geometry" accent="rose">
        <p>
          On a desktop you&apos;d ray-march god-rays in a fragment shader, sampling
          shadow maps along the view ray to find where light gets occluded. WebGL
          can&apos;t do that — no compute shaders, no easy access to depth, and
          ray-marching kills the budget anyway. Sanctum solves it with old-school
          geometry: each god-ray is a <strong>frustum-shaped mesh</strong> built
          procedurally at runtime, projecting from the panel quad toward where the
          sun would land it on the back wall.
        </p>
        <Formula
          expr={`for each panel:
  cornerWorld[4] = panel.corners
  groundHit[4]   = ray-plane(cornerWorld[i], sunDir, floorPlane)
  build mesh with 8 verts (4 panel + 4 ground)  ← that's the frustum
  shader: color = panelTint × (1 - distFade) × dustNoise × _SunIntensity`}
          caption="9 panels × 8 verts = 72 verts of god-ray geometry. Compute-shader free."
        />
        <p>
          The shader is additive (<code className="font-mono text-neon-cyan">Blend One One</code>),
          ZWrite Off, and ZTest LEqual so beams correctly hide behind walls. The
          dust inside the beam comes from a 3D noise function (Worley) sampled per
          fragment — the same beams flicker subtly as the camera moves, like real
          motes catching light.
        </p>
      </Block>

      <Block kicker="planar reflection" title="A second camera, an oblique cut, half-res" accent="rose">
        <p>
          The polished stone floor is a mirror. Real-time mirrors are expensive — the
          cheapest convincing technique is <strong>planar reflection</strong>: every
          frame, mirror the main camera across the floor plane, give it an oblique
          projection clip plane (so it doesn&apos;t render anything below the
          floor), render the scene into a render texture, and sample that texture
          on the floor material weighted by Fresnel.
        </p>
        <Formula
          expr={`mirroredCam.position    = reflect(mainCam.position, floorPlane)
mirroredCam.rotation    = reflect(mainCam.rotation, floorPlane.normal)
mirroredCam.projection  = MainCam.CalculateObliqueMatrix(floorPlane)
mirroredCam.targetTex   = ReflectionRT          ← rendered at 0.4× viewport
floor._ReflTex          = ReflectionRT
floorPixel              = lerp(stoneColor, ReflectionRT.sample(uv), Fresnel × _ReflStrength)`}
          caption="duplicate render is the cost. Half-res RT + Reflectable layer mask = manageable."
        />
        <p>
          The camera renders into the RT at 40% viewport scale — invisible at this
          surface roughness but cuts the duplicate-render cost by 84%. Only objects
          on the <code className="font-mono text-neon-cyan">Reflectable</code> layer
          render through the mirror — chamber + window + god-rays + ceiling, but
          not the floor itself (which would create infinite recursion).
        </p>
      </Block>

      <Block kicker="procedural surfaces" title="Every visible material is shader code" accent="rose">
        <p>
          There&apos;s not a single texture file in Sanctum. Every wall, every brick,
          every cloud, every blade of grass is generated in shader.
        </p>
        <StatGrid
          items={[
            { label: "Stone shader", value: "Voronoi cells", sub: "+ dark mortar lines + per-cell color variance" },
            { label: "Garden grass", value: "Worley clumps", sub: "+ scattered flowers + wind UV warp + horizon haze" },
            { label: "Sky", value: "FBM clouds", sub: "gradient zenith→horizon + sun disc + drifting cumulus" },
            { label: "Cypress trees", value: "5 stacked cylinders", sub: "tapering, dark cypress-green, all instanced" },
            { label: "Floor splash", value: "tinted quad", sub: "follows ray-plane each frame, additive blend" },
            { label: "Stained glass", value: "Lit + emissive", sub: "translucent base + _TintColor bleed via MPB" }
          ]}
        />
        <Callout tone="default">
          MaterialPropertyBlocks are the secret weapon for the panel grid — 9
          panels share <em>one</em> material asset but each renders with its own
          <code className="font-mono text-neon-cyan"> _BaseColor</code>,
          <code className="font-mono text-neon-cyan"> _TintColor</code>, and
          <code className="font-mono text-neon-cyan"> _EmissionColor</code>.
          Frame metals work the same way: 36 strip Renderers all share one shader,
          tinted per-strip via MPB. Without this you&apos;d need 9×4 distinct
          materials and the draw-call count would explode.
        </Callout>
      </Block>

      <Block kicker="candles + dust" title="The ambient details that sell the room" accent="rose">
        <p>
          The window is the show, but the chamber feels alive because of the small
          things. Four wall sconces flank the side walls, an 8-candle brass
          chandelier hangs above the altar — every flame has its own{" "}
          <code className="font-mono text-neon-cyan">CandleFlicker</code>{" "}
          component running two-rate Perlin noise plus an occasional random kick,
          driving emissive intensity and the attached point light&apos;s range.
          No two flames repeat; the cycle never loops.
        </p>
        <p>
          A particle system (350 motes max, world-simulated, slow drift across the
          chamber bounds) catches the god-rays — additive URP particle material so
          dust appears bright when it crosses a beam and invisible when it
          doesn&apos;t. Same trick the beam shader uses, just in 3D.
        </p>
      </Block>

      <Block kicker="the polish" title="Post-processing is where mood lives" accent="rose">
        <p>
          The raw render of Sanctum looks fine. The shipped render looks <em>holy</em>.
          Difference is a stack of URP Volume overrides:
        </p>
        <StatGrid
          items={[
            { label: "Bloom", value: "thr 0.55", sub: "intensity 1.4 — emissive panels & flames glow" },
            { label: "ACES tonemap", value: "filmic", sub: "tames overbright god-rays" },
            { label: "Vignette", value: "35%", sub: "draws the eye to the altar" },
            { label: "Color grade", value: "+18 sat", sub: "+8 contrast · slight warm filter" },
            { label: "Chromatic aberration", value: "0.18", sub: "barely there · adds painterliness" },
            { label: "Film grain", value: "0.20", sub: "softens the flat shaders, looks photographed" }
          ]}
        />
      </Block>

      <Block kicker="the journey" title="What it took to get the light right" accent="pink">
        <p>
          Sanctum was built in <strong>nine numbered phases plus two polish passes</strong>{" "}
          — chamber, glass, god-rays, floor splashes, planar reflection, metal
          frames, UI, bloom, playmode test, then liturgical layout and final bug
          hunt. Every phase had a screenshot before the next phase started. The
          discipline made the bugs findable when they appeared.
        </p>
        <Callout tone="struggle">
          <strong>WebGL has no compute shaders.</strong> Every modern god-ray
          implementation uses ray-marched volumetric fog. Not available here.
          Sanctum builds god-rays as <em>frustum geometry</em> — 8 verts per
          panel, 72 verts total. The cone is a real mesh in the scene; the shader
          fades it via 3D noise + distance. Ugly architecturally, performant
          everywhere.
        </Callout>
        <Callout tone="struggle">
          <strong>Reflection plane was off by 0.05 metres.</strong> Floor cube top
          is at y=0.05 but the planar mirror was reflecting around y=0. The
          reflection looked &quot;almost right&quot; in a way that&apos;s harder to
          debug than &quot;completely wrong&quot; — splashes appeared to float
          slightly above the floor. Fix: pipe a single{" "}
          <code className="font-mono">floorY</code> through the reflection rig
          and the splash quad placement.
        </Callout>
        <Callout tone="struggle">
          <strong>Frame metal had no visible effect.</strong> Click Brass, the
          inspector said the metal changed, but the chamber looked identical. Two
          bugs stacked: the panel script never held a list of its frame Renderers,
          and even if it had, the influence on the panel tint was a measly 30%.
          Fixed both: panels now hold{" "}
          <code className="font-mono text-neon-cyan">List&lt;Renderer&gt; frameStrips</code>,
          ApplyTint pumps each strip&apos;s MPB, and frame influence on glass color
          got bumped to 50–80% so the swap is unmissable.
        </Callout>
        <Callout tone="struggle">
          <strong>UI affordance was invisible.</strong> Original design: pick a
          color, then click a panel-grid tile to apply. Anyone who didn&apos;t
          read the help just clicked the colour and saw nothing happen. Fix: a
          colour-swatch click now applies to <em>all panels</em> immediately.
          Per-panel painting still works through the panel-grid tile, but the
          first thing every user does — &quot;does this even work?&quot; — gets
          rewarded immediately.
        </Callout>
        <Callout tone="struggle">
          <strong>WebGL performance budget.</strong> A small chamber, but 9
          additive frustum cones + planar reflection + 12 point lights + chandelier
          + candles + dust particles + post-processing was hitting 35 fps. The fix
          was a full audit:
          <code className="font-mono"> isStatic=true</code> on every non-moving
          brick, GPU instancing on every repeated material, only the sun casts
          shadows (medium res, single cascade, 12m max distance), all 12 point
          lights shadowless, depth + opaque copy textures disabled, dust particle
          cap halved, reflection RT to 40% viewport, Brotli + IL2CPP + threadsless
          WebGL build settings. Back to 60 fps everywhere.
        </Callout>
        <p>
          Not a single one of those fights was about &quot;the light pipeline.&quot;
          They were all the small adjacent things that turn a rendering demo into a
          space someone wants to stand inside. The math was the easy part; the
          mood was the work.
        </p>
      </Block>

      <Closing accent="rose" />
    </>
  );
}

function Closing({ accent }: { accent: "cyan" | "pink" | "lime" | "purple" | "amber" | "rose" }) {
  const color = {
    cyan: "#00f0ff",
    pink: "#ff2bd6",
    lime: "#b6ff00",
    purple: "#9d00ff",
    amber: "#ffae3d",
    rose: "#ff5e8a"
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
