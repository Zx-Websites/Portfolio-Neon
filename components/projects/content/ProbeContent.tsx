"use client";

import { Block, Callout, CodeBlock, Formula, Pipeline, StatGrid, TagRow } from "@/components/projects/Block";
import { motion } from "framer-motion";

export const probeGlyph = (
  <svg viewBox="0 0 400 240" className="h-full w-full">
    <defs>
      <radialGradient id="pg-c" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pg-p" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="40%" stopColor="#ff2d9c" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ff2d9c" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pg-v" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="40%" stopColor="#a78bfa" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pg-g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="40%" stopColor="#65eaa8" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#65eaa8" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* four neon blobs in the LyricPulse palette */}
    <ellipse cx={70} cy={60} rx={90} ry={80} fill="url(#pg-c)" />
    <ellipse cx={330} cy={70} rx={85} ry={75} fill="url(#pg-p)" />
    <ellipse cx={80} cy={190} rx={80} ry={70} fill="url(#pg-v)" />
    <ellipse cx={320} cy={180} rx={85} ry={70} fill="url(#pg-g)" />

    {/* central lyric strip: dim words flanking a glowing magic word */}
    <g transform="translate(78, 108)">
      <rect x={0} y={6} width={22} height={6} rx={2} fill="#fff" opacity={0.4} />
      <rect x={30} y={6} width={36} height={6} rx={2} fill="#fff" opacity={0.4} />
      <rect
        x={74}
        y={2}
        width={62}
        height={14}
        rx={3}
        fill="#5b9aff"
        style={{ filter: "drop-shadow(0 0 8px #5b9aff)" }}
      />
      <rect x={146} y={6} width={30} height={6} rx={2} fill="#fff" opacity={0.4} />
      <rect x={184} y={6} width={26} height={6} rx={2} fill="#fff" opacity={0.4} />
      <rect x={218} y={6} width={26} height={6} rx={2} fill="#fff" opacity={0.4} />
    </g>

    {/* 4-dot spectrum visualiser */}
    <g transform="translate(200, 178)">
      <circle cx={-40} cy={0} r={6} fill="#00f0ff" style={{ filter: "drop-shadow(0 0 5px #00f0ff)" }} />
      <circle cx={-14} cy={0} r={10} fill="#ff2bd6" style={{ filter: "drop-shadow(0 0 6px #ff2bd6)" }} />
      <circle cx={14} cy={0} r={7} fill="#c780ff" style={{ filter: "drop-shadow(0 0 5px #c780ff)" }} />
      <circle cx={40} cy={0} r={5} fill="#65eaa8" style={{ filter: "drop-shadow(0 0 4px #65eaa8)" }} />
    </g>
  </svg>
);

export default function ProbeContent() {
  return (
    <>
      <Block kicker="what it is" title="A music player that knows every word" accent="blue">
        <p>
          Probe is a portrait-mode music app that displays its lyrics{" "}
          <strong>word-perfectly synchronised</strong> to the audio. Not line-at-a-time
          like classic LRC files — every single word lights up the moment it is sung,
          and a chosen <em>magic word</em> on each line gets a neon-tube glow and a
          per-letter wiggle when the singer reaches it.
        </p>
        <p>
          The whole UI is built on Unity 6 UI Toolkit. A single player container
          morphs between a compact mini bar and a full-screen Apple-Music-style view
          via USS translate (never animating height). The background is four neon
          blobs that scale to the bass, drift on the mid, hue-shift on the treble,
          and dash on snares. When no vocal is being sung, the lyric stage hands
          focus to a 4-dot equalizer that holds the silence.
        </p>
        <TagRow items={["Unity 6", "UI Toolkit", "WebGL", "WhisperX", "Spectrum FFT", "C#"]} />
      </Block>

      <Block kicker="the pipeline" title="From MP3 to glowing letters" accent="blue">
        <p>
          The hard part of word-aligned lyrics isn&apos;t the rendering — it&apos;s
          getting <em>authoritative timestamps</em> for every word in the song.
          Probe doesn&apos;t fuzzy-match. It doesn&apos;t do DSP onset detection
          on the audio. Every line and every word ships with exact start/end
          times, baked once offline.
        </p>
        <Pipeline
          steps={[
            { label: "Source audio + lyrics text", sub: "any .mp3 / .ogg + a plain .lrc or .txt of the lyrics" },
            { label: "Tools/align.py — WhisperX forced alignment", sub: "Wav2Vec2 phoneme model lines up text against audio · word-level timestamps" },
            { label: "Tools/merge_lrc.py + extract_theme.py", sub: "cleans line breaks · pulls a dominant + accent colour from the cover art" },
            { label: "aligned.json in StreamingAssets", sub: "one JSON per song with lines[], words[], theme{} — committed to the repo" },
            { label: "AlignedLyricEngine reads the JSON", sub: "binary-searches the active line every frame · emits OnLineChanged / OnWordChanged" },
            { label: "AppleUIController paints the UI", sub: "5-slot lyric carousel · magic-word picker · spectrum-reactive backdrop" }
          ]}
        />
      </Block>

      <Block kicker="the data" title="What an aligned line actually looks like" accent="blue">
        <p>
          The runtime data schema mirrors WhisperX&apos;s output one-for-one. A line
          is a chunk of text with bookend timestamps; inside it is a list of words,
          each with its own start/end. That&apos;s the whole format. Everything the
          UI does — magic-word selection, per-letter wiggle, sung/unsung styling — is
          derived from this one structure plus the audio source&apos;s current time.
        </p>
        <CodeBlock>{`{
  "audio_file": "track.mp3",
  "duration": 184.21,
  "language": "en",
  "model": "WhisperX large-v3 · wav2vec2 align",
  "theme": { "dominant": "#1a0c2e", "accent": "#5b9aff", ... },
  "lines": [
    {
      "text": "we'll never know how far we go",
      "start": 14.220, "end": 18.115,
      "words": [
        { "word": "we'll",  "start": 14.220, "end": 14.480 },
        { "word": "never",  "start": 14.480, "end": 14.910 },
        { "word": "know",   "start": 14.910, "end": 15.330 },
        { "word": "how",    "start": 15.330, "end": 15.620 },
        { "word": "far",    "start": 15.620, "end": 16.040 },
        { "word": "we",     "start": 16.040, "end": 16.290 },
        { "word": "go",     "start": 16.290, "end": 18.115 }
      ]
    }
  ]
}`}</CodeBlock>
        <Callout tone="default">
          Buffer latency matters. Unity&apos;s DSP buffer holds ~20–50ms of audio
          ahead of where <code className="font-mono text-neon-blue">AudioSource.time</code>{" "}
          reports, and WhisperX consistently lands its word boundaries a few tens of
          milliseconds before the perceptual onset. The engine compensates with a
          single <code className="font-mono text-neon-blue">EffectiveTime = source.time − bufLatency − renderDelaySec</code>{" "}
          (0.05s default) so the highlight lands on the syllable, not before it.
        </Callout>
      </Block>

      <Block kicker="the morph" title="One container, two layouts, zero height animation" accent="blue">
        <p>
          The player is a single persistent VisualElement. It contains{" "}
          <em>both</em> the mini bar and the full screen as sibling subtrees, stacked,
          and the morph between them is done by translating + scaling them via USS,
          never by animating height or display. Unity 6 UI Toolkit performance
          guidance is explicit about this: never animate layout-affecting properties
          if you can move them on the GPU instead.
        </p>
        <Formula
          expr={`player.AddToClassList("full")     // → full-layout slides up, mini fades
player.AddToClassList("mini")     // → mini bar slides down, full fades

usageHints |= UsageHints.DynamicTransform   // composite on GPU, skip repaint
pickingMode = invisibleLayout ? Ignore : Position   // don't steal clicks`}
          caption="USS owns the visuals · C# only flips classes & picking · transitions are CSS"
        />
        <Callout tone="struggle">
          <strong>Invisible layouts still ate clicks.</strong> UI Toolkit doesn&apos;t
          drop pointer-events on opacity-0 elements — both the full layout and mini
          layout anchor to the top of the player container, so the (invisible) full
          layout&apos;s back/queue buttons sat on top of the mini bar&apos;s buttons
          and intercepted every click. Fix:{" "}
          <code className="font-mono text-neon-blue">SetLayoutPicking()</code> flips{" "}
          <code className="font-mono text-neon-blue">pickingMode</code> on both
          subtrees whenever the morph state changes.
        </Callout>
      </Block>

      <Block kicker="the magic word" title="One word per line gets to glow" accent="blue">
        <p>
          Every line in Probe has exactly one <strong>magic word</strong> — an
          expressive, ≥ 4-letter, non-stopword token that gets pulled out of the line
          and rendered as a row of per-letter <code className="font-mono text-neon-blue">Label</code>s
          inside a flex container. It keeps a neon-tube tint and a wide-blur halo
          for the whole line, and when the singer reaches it, the letters wiggle in
          sequence — a 55ms stagger, a 300ms hold, a CSS-driven transition, then it
          latches off forever for that line.
        </p>
        <p>
          The pick is deterministic: a per-line hash chooses the magic word from the
          eligible pool, and a separate per-line hash chooses one of four neon tones
          for it. The same song always picks the same magic word in the same colour
          — repeat plays feel intentional, not random.
        </p>
        <StatGrid
          items={[
            { label: "Stopword filter", value: "≥ 4 letters", sub: "no \"the\", \"with\", \"your\", \"have\"… ~120 entries" },
            { label: "Magic tones", value: "4 neon hues", sub: "sodium orange · cyan · violet · magenta — cycled by line hash" },
            { label: "Halo", value: "26 px blur", sub: "TextShadow with 0.85 alpha · stays on the whole line" },
            { label: "Wiggle stagger", value: "55 ms", sub: "per letter · 300 ms hold · USS transition does the easing" },
            { label: "Latch", value: "once per line", sub: "skipping back and forward never re-fires the wiggle" },
            { label: "Fallback", value: "no magic word", sub: "if every token is a stopword, line renders flat — no boring word forced" }
          ]}
        />
      </Block>

      <Block kicker="the spectrum" title="Four bands drive everything that breathes" accent="blue">
        <p>
          The backdrop&apos;s motion is not pre-baked. Every frame, Probe samples
          the playing audio source and splits it into four perceptual bands: bass,
          vocal, mid, and treble. Each band runs through smoothed averaging
          (<code className="font-mono text-neon-blue">Mathf.SmoothDamp</code> with
          per-band time constants) and feeds the four neon blobs that fill the
          background — bass punches the scale, treble shifts the hue, mid drives the
          continuous drift, and a snare-like mid onset fires a dash impulse on all
          four blobs at once.
        </p>
        <Formula
          expr={`# desktop (FFT available)
audioSource.GetSpectrumData(spectrum, 0, BlackmanHarris)
bass   = sum(spectrum[ 0.. 4])    # ~0–690 Hz
vocal  = sum(spectrum[ 4..12])    # ~690 Hz–2 kHz
mid    = sum(spectrum[12..36])    # ~2–6 kHz
treble = sum(spectrum[40..200])   # ~7–34 kHz

# normalise against a slowly-decaying running max so quiet songs still pop
band   = band / max(0.01, bandMax * 0.998)

# mid onset → dash impulse on every blob
if (mid - midSlow) > 0.10 and mid > 0.25:
    foreach blob: dashVel += randomDir * (mid - midSlow) * 220`}
          caption="four perceptual bands · per-frame · 60 FPS locked"
        />
        <Callout tone="struggle">
          <strong>WebGL doesn&apos;t support GetSpectrumData.</strong> The
          straightforward FFT path returns silence in the browser. Probe falls back
          to a two-stage IIR filter bank on raw PCM samples (a slow low-pass for
          bass, a faster one for mid-low, residuals for mid &amp; high) — the band
          values aren&apos;t bin-accurate but they correlate well enough with
          perceptual energy that the visuals stay reactive everywhere. The
          desktop and browser branches are split by{" "}
          <code className="font-mono text-neon-blue">#if !UNITY_WEBGL</code>.
        </Callout>
      </Block>

      <Block kicker="waiting dots" title="When there's nothing to sing" accent="blue">
        <p>
          Most lyric apps just leave the active line blank during intros, interludes,
          and outros. Probe hands the stage to a four-dot equalizer instead — bass,
          vocal, mid, treble each get a circle, each circle is scaled by its
          band&apos;s smoothed value, and the whole row sits exactly where the
          active lyric was a second ago. When the next sung line arrives, the dots
          slide out, the line slides in. The dead-air between vocals becomes part
          of the show.
        </p>
        <p>
          The detector is just a couple of thresholds: before the first line, after
          the last line, or any gap longer than 2.5s mid-song where the next vocal
          is at least 0.8s away — show the dots. Otherwise the lyric stage owns the
          screen.
        </p>
      </Block>

      <Block kicker="the library" title="A queue, a grid, and a song manifest" accent="blue">
        <p>
          Songs live in{" "}
          <code className="font-mono text-neon-blue">StreamingAssets/Library/&lt;slug&gt;/</code>{" "}
          — one folder per track holding the audio, its cover art, and the aligned
          JSON. A top-level <code className="font-mono text-neon-blue">index.json</code>{" "}
          enumerates them. On launch the controller pulls the manifest via{" "}
          <code className="font-mono text-neon-blue">UnityWebRequest</code> (because
          WebGL can&apos;t read{" "}
          <code className="font-mono text-neon-blue">Application.dataPath</code>),
          builds the library grid, kicks off thumbnail loads in parallel, and
          mirrors the list into the queue panel.
        </p>
        <p>
          Tap a tile and the player drops into full mode immediately — no mini-bar
          pre-state. The mini bar only appears when you actively tap back. Matches
          the &quot;Now Playing&quot; flow every iOS user already has muscle memory
          for.
        </p>
      </Block>

      <Block kicker="the journey" title="What it took to make a word land on a syllable" accent="blue">
        <p>
          Probe was built around a single bet: that forced alignment would be
          accurate enough that no DSP, no DP, no fuzzy heuristics would be needed
          at runtime. The bet paid off — but only after a stack of smaller bets
          had been adjusted underneath it.
        </p>

        <Callout tone="struggle">
          <strong>WhisperX is fast but biased.</strong> Word boundaries consistently
          landed 30–60 ms before the perceptual onset. Adding a per-song
          calibration constant would have been a nightmare for the dataset.
          Instead, a single global{" "}
          <code className="font-mono text-neon-blue">renderDelaySec = 0.05f</code>{" "}
          gets subtracted from the effective time on every read. Tuned by eye, by
          ear, on six different songs — the highlight now sits on the consonant
          where it should.
        </Callout>

        <Callout tone="struggle">
          <strong>The active line wrapped, the carousel collapsed.</strong> The
          five lyric slots are positioned by translate, with a constant 320 px
          spacing between them. When a long line wrapped to two or three rows,
          the active slot grew tall enough that the prev/next slots visually
          overlapped it. Fix: a{" "}
          <code className="font-mono text-neon-blue">GeometryChangedEvent</code>{" "}
          callback on the active slot recomputes spacing as{" "}
          <code className="font-mono text-neon-blue">max(320, h/2 + 220)</code>,
          re-applies translate inline on every slot, and a 4-px dead-band
          prevents a tiny re-flow from kicking another layout pass.
        </Callout>

        <Callout tone="struggle">
          <strong>Magic word wiggle re-fired on rewind.</strong> Drag the scrubber
          back across a line you&apos;ve already heard and every letter wiggled
          again — once per scrub. Felt like a bug, looked like a stutter. Fix: a
          <code className="font-mono text-neon-blue"> magicWiggled</code> latch
          on the slot state, set to true the first time the magic word is reached
          and never reset until the slot rebuilds for a new line.
        </Callout>

        <Callout tone="struggle">
          <strong>Material Icons font wouldn&apos;t resolve via USS.</strong>{" "}
          <code className="font-mono text-neon-blue">-unity-font: resource(...)</code>{" "}
          returned the default font silently — every icon button rendered as the
          PUA glyph fallback (a tofu box). Fix: load the font in C# with{" "}
          <code className="font-mono text-neon-blue">Resources.Load&lt;Font&gt;</code>
          {" "}and apply it to every{" "}
          <code className="font-mono text-neon-blue">.mat-icon</code> element via{" "}
          <code className="font-mono text-neon-blue">style.unityFontDefinition</code>{" "}
          at init. Belt-and-braces, but USS font resolution has been flaky in 6.x
          and this is the path that works.
        </Callout>

        <Callout tone="struggle">
          <strong>WebGL had no spectrum data, full stop.</strong>{" "}
          <code className="font-mono text-neon-blue">GetSpectrumData</code> returns
          a zeroed array under Unity&apos;s WebGL audio backend. The backdrop went
          dead in the browser build. Building a from-scratch FFT in C# was too
          expensive for 60 FPS. The compromise: a two-stage IIR filter bank on a
          1024-sample PCM window pulled fresh each frame. Not bin-accurate, but
          the four band envelopes track perceptual energy well enough that the
          blobs still breathe — and crucially, the same C# code runs on every
          platform.
        </Callout>

        <p>
          None of those fights were about the alignment itself. They were all the
          small adjacent things between &quot;the timestamps are correct&quot; and
          &quot;the letter is glowing on the right beat.&quot; The math was offline.
          The mood was the work.
        </p>
      </Block>

      <Closing accent="blue" />
    </>
  );
}

function Closing({ accent }: { accent: "cyan" | "pink" | "lime" | "purple" | "amber" | "rose" | "blue" }) {
  const color = {
    cyan: "#00f0ff",
    pink: "#ff2bd6",
    lime: "#b6ff00",
    purple: "#9d00ff",
    amber: "#ffae3d",
    rose: "#ff5e8a",
    blue: "#5b9aff"
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
