"use client";

import { Block, Callout, CodeBlock, Formula, Pipeline, StatGrid, TagRow } from "@/components/projects/Block";
import { KaleidoscopeDiagram } from "@/components/projects/Diagram";
import { motion } from "framer-motion";

export const kaleidoscopeGlyph = (
  <svg viewBox="0 0 400 240" className="h-full w-full">
    <defs>
      <radialGradient id="kg-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <g transform="translate(200, 120)">
      <circle r={60} fill="url(#kg-core)" />
      {/* 12-fold ribbon mandala */}
      {Array.from({ length: 12 }).map((_, segIdx) => {
        const angle = (segIdx * 360) / 12;
        return (
          <g key={segIdx} transform={`rotate(${angle})`}>
            {[0, 1, 2].map((rb) => {
              const colors = ["#00f0ff", "#ff2bd6", "#9d00ff"];
              const points: string[] = [];
              for (let i = 0; i <= 22; i++) {
                const t = i / 22;
                const r = 8 + t * 100;
                const theta = Math.sin(t * Math.PI * (1.7 + rb * 0.6) + rb * 0.6) * 0.05;
                points.push(`${i === 0 ? "M" : "L"}${(r * Math.cos(theta)).toFixed(1)},${(r * Math.sin(theta)).toFixed(1)}`);
              }
              return (
                <g key={rb}>
                  <path d={points.join(" ")} stroke={colors[rb]} strokeWidth={1} fill="none" opacity={0.7} />
                  <g transform="scale(1, -1)">
                    <path d={points.join(" ")} stroke={colors[rb]} strokeWidth={1} fill="none" opacity={0.7} />
                  </g>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  </svg>
);

export default function KaleidoscopeContent() {
  return (
    <>
      <Block kicker="what it is" title="A neon mandala that listens to your music" accent="pink">
        <p>
          Kaleidoscope is a real-time symmetry visualiser. One full-screen quad runs an
          HLSL shader that turns mathematics into a living mandala — twelve mirrored
          ribbons of neon light orbiting a glowing core, drifting through hue space,
          breathing on the beat.
        </p>
        <p>
          Plug in audio — your browser tab, a Spotify window, your microphone — and
          the visuals start <em>responding</em>. Bass swells the ribbons. Mids spread
          the colour. Treble shimmers across the surface. Beats snap the hue and
          pulse the vignette. Every shader parameter is a potential audio target, and
          you choose which band drives what.
        </p>
        <TagRow items={["Unity 6", "URP", "HLSL Shader", "WebGL", "Audio Reactive", "FFT"]} />
      </Block>

      <Block kicker="the core trick" title="Polar fold — one wedge, twelve mirrors" accent="pink">
        <p>
          A kaleidoscope&apos;s magic isn&apos;t the art — it&apos;s the symmetry. The shader
          spends most of its work drawing exactly <strong>one slice</strong> of art,
          then folds the screen into N rotated mirrored copies of that slice. You
          design 1/24th of the picture and get the other 23/24ths for free.
        </p>
        <Formula
          expr={`uv      = screenUV − 0.5
r       = length(uv)
angle   = atan2(uv.y, uv.x) + rotation + time·speed
segAngle = 2π / segments
folded  = |((angle mod segAngle) − segAngle/2)|     ← fold + mirror`}
          caption="every pixel finds its position inside one wedge"
        />
        <p>
          That <code className="font-mono text-neon-cyan">folded</code> angle plus the
          radius gives a new pair of polar coordinates that map back to a square
          patch. The procedural neon is drawn in <em>that</em> patch — so when you
          rotate around the screen, you see the same patch over and over, mirrored at
          each segment boundary. Twelve segments by default. Crank it to 32 and your
          eyes can&apos;t track the lines anymore.
        </p>
        <KaleidoscopeDiagram />
      </Block>

      <Block kicker="the picture" title="Four procedural layers, no textures required" accent="pink">
        <p>
          Inside the wedge, the shader draws four kinds of light, all stacked on a
          near-black background. Each is cheap; together they look expensive.
        </p>
        <Pipeline
          steps={[
            { label: "Ribbons", sub: "N sinusoidal curves with value-noise flow distortion, each on its own y-baseline" },
            { label: "Pulse rings", sub: "expanding circles from origin with life-cycle fade — off by default, looks like a heartbeat" },
            { label: "Spokes", sub: "pow(0.5 + 0.5·cos(angle·count), 16) — sharp radial rays, masked near r=0" },
            { label: "Plasma shimmer", sub: "three-axis sin overlay sharpened with pow(...,4) so it shows on peaks, never as a wash" }
          ]}
        />
        <p>
          The trick that makes neon look like neon — instead of a fuzzy soft blob — is
          a custom glow function with an intentionally <em>tiny</em> halo:
        </p>
        <CodeBlock>{`float lineGlow(float dist, float coreWidth, float haloWidth) {
  float core = exp(-dist² / (coreWidth² + ε));
  float halo = exp(-dist² / (haloWidth² + ε));
  return core * 2.2 + halo * 0.05;   // halo is 0.05, not 0.5
}`}</CodeBlock>
        <Callout tone="default">
          A larger halo would smear the dark spaces between ribbons into a purple
          wash. The 0.05 multiplier is what keeps stacked lines crisp and the
          background pitch black — so each ribbon reads as its own object.
        </Callout>
      </Block>

      <Block kicker="color" title="Hue drift, palette spread, and a final grade pass" accent="pink">
        <p>
          Colour comes from a pair of base hues — primary and secondary — that drift
          around the colour wheel over time. Each ribbon picks a hue interpolated
          between them, scaled by a <code className="font-mono text-neon-cyan">colorSpread</code> knob.
          A small Burst-safe HSV→RGB function gives you saturated neon without
          touching a texture or a colour ramp.
        </p>
        <Formula
          expr={`drift  = time · hueShiftSpeed · 0.1
hue_i  = primaryHue + drift + colorSpread · (i / N) · (secondaryHue − primaryHue + 1)
ribbon_i.color = HSV→RGB(hue_i, 0.92, 1.0)`}
          caption="defaults: primary 0.55 (cyan) · secondary 0.85 (magenta)"
        />
        <p>
          After the procedural draw, a four-step grading pass — contrast, brightness,
          saturation, vignette — followed by a soft tone-map (<code className="font-mono">color / (1 + 0.18·color)</code>)
          keeps highlights from blowing out flat. The final image stays vivid even at
          full audio modulation.
        </p>
      </Block>

      <Block kicker="the music" title="Three bands, twenty routes, one routing matrix" accent="pink">
        <p>
          The audio reactor is the soul of the project. It captures audio from the
          browser tab or microphone (via a custom <code className="font-mono text-neon-cyan">.jslib</code> bridge),
          runs a 1024-bin FFT, and folds the spectrum into three smoothed bands:
          bass, mid, treble. Each band drives a curated set of shader parameters,
          and <em>you choose</em> which.
        </p>
        <StatGrid
          items={[
            { label: "FFT bins", value: "1024", sub: "WebGL AnalyserNode" },
            { label: "Sample rate", value: "48 kHz", sub: "browser default" },
            { label: "Smoothing", value: "0.55", sub: "exponential, per band" },
            { label: "Bass routes", value: "6", sub: "→ bri / amp / freq / ring / swirl / rot" },
            { label: "Mid routes", value: "7", sub: "→ spread / glow / amp / freq / sat / swirl / rot" },
            { label: "Treble routes", value: "7", sub: "→ shim / noise / amp / freq / spoke / swirl / rot" }
          ]}
        />
        <p>
          Each route is a toggle plus a strength slider. The defaults pick three
          tasteful pairings — bass→ribbonFreq, mid→colorSpread, treble→ribbonAmp —
          but you can route any band to any parameter, layer them, or turn them all
          off. The routing matrix is the entire user interface.
        </p>
      </Block>

      <Block kicker="the beat" title="Bass-band beat detection with refractory period" accent="pink">
        <p>
          A separate beat detector watches the bass band over a 1-second history,
          flags a beat when the current sample exceeds the rolling average × sensitivity,
          enforces a minimum gap (so single drum hits don&apos;t register twice), and
          emits a decaying <code className="font-mono text-neon-cyan">BeatPulse</code> value the rest of the
          shader can read.
        </p>
        <Pipeline
          steps={[
            { label: "Push current bass into 64-frame rolling buffer", sub: "1 second @ 60fps" },
            { label: "Compute mean of buffer", sub: "the noise floor" },
            { label: "Beat if bass > mean × sensitivity AND no recent beat", sub: "refractory window prevents double-fire" },
            { label: "BeatPulse = 1.0, decays at beatDecayPerSec", sub: "smooth ramp-down so visuals don't flicker" }
          ]}
        />
        <p>
          On a beat, seven separate routes can fire — brightness flash, hue snap,
          vignette pulse, ribbon amp/freq kick, swirl kick, rotation kick. The hue
          snap is monotonic (it accumulates rather than oscillating) so each beat
          actually shifts the palette forward instead of bouncing it back.
        </p>
      </Block>

      <Block kicker="the architecture" title="Base values + audio modulation, never fighting" accent="pink">
        <p>
          The trickiest design choice was getting UI and audio to coexist without
          one stomping on the other. The naive version: audio writes directly to
          shader uniforms. Disable the route, and your visual is stuck wherever the
          last audio frame left it.
        </p>
        <p>
          The fix is a two-layer model. The controller keeps a{" "}
          <code className="font-mono text-neon-cyan">_baseValues</code> dict — every UI slider
          writes both to the dict <em>and</em> to the material. The audio reactor
          reads the base value, layers its modulation on top, writes to the
          material. When you turn an audio route off, the next frame the reactor
          restores the base — and the visual returns to whatever the slider says,
          cleanly.
        </p>
        <CodeBlock>{`// every UI change writes both:
_baseValues[id] = newValue;
material.SetFloat(id, newValue);

// every audio frame reads base, layers modulation, writes:
float base = _baseValues[id];
float modulated = base + bandValue * route.strength;
material.SetFloat(id, modulated);

// when a route flips off, restore base on next frame.`}</CodeBlock>
      </Block>

      <Block kicker="the journey" title="Five problems that almost killed it" accent="pink">
        <p>
          The shader was the easy part. The hard part was getting audio out of a
          web browser running inside an iframe on itch.io.
        </p>
        <Callout tone="struggle">
          <strong>Tab capture is blocked inside iframes.</strong> Browsers will let
          you screen-capture a tab from a top-level page, but if your game is in an
          iframe (which itch.io games are), the API silently refuses. Solution: detect
          the block, expose an &quot;Open in new tab&quot; button that pops the build
          out of the iframe so the user can grant permission on a real top-level
          context. The button only appears when the API actually fails — invisible
          otherwise.
        </Callout>
        <Callout tone="struggle">
          <strong>The polar singularity at r=0.</strong> Convergent ribbons all meet
          at the centre. Without a mask, the kaleidoscope&apos;s pivot becomes a
          blown-out white pinch. Fix: multiply the entire procedural color by
          <code className="font-mono"> smoothstep(0.0, 0.07, r)</code> — gently fades
          the inner 7% of the radius back to black so the center stays a clean dark
          eye instead of a star.
        </Callout>
        <Callout tone="struggle">
          <strong>Texture upload through a 4-byte channel.</strong> Unity&apos;s WebGL
          interop is famously stringly-typed — <code className="font-mono">SendMessage(go, method, str)</code>{" "}
          and that&apos;s it. So big PNG bytes can&apos;t go through directly. The
          solution is a <code className="font-mono">.jslib</code> bridge that allocates
          a heap pointer in the WebAssembly module, writes the file bytes there,
          and sends Unity the pointer + length as a comma-separated string.{" "}
          <code className="font-mono">Marshal.Copy</code> on the C# side pulls the
          bytes out, then a callback frees the heap allocation.
        </Callout>
        <Callout tone="struggle">
          <strong>Audio routes were stomping the UI.</strong> Drag a slider while
          the audio reactor was running, and as soon as you released the slider, the
          reactor would write whatever the last band value was — ignoring your new
          base. The fix was the base + modulation architecture above: it took a full
          rewrite of the controller to land cleanly, but once the dict layer
          existed, every other route became trivial to add.
        </Callout>
        <Callout tone="struggle">
          <strong>Stacked ribbons looked like soup.</strong> Early versions used a
          generous halo on the line glow function, and four ribbons with halos = a
          purple wash. Cut the halo multiplier to 0.05, kept only the tight 2.2×
          core, and the picture suddenly read as discrete neon tubes instead of
          gradient noise. Sometimes the fix is one number.
        </Callout>
        <p>
          Most of these were one-line fixes that took days to find. That&apos;s the
          part that doesn&apos;t show up in the final code — but it&apos;s the part that
          made the project ship instead of die in a side branch.
        </p>
      </Block>

      <Closing accent="pink" />
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
