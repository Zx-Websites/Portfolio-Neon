"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import type { Project } from "@/data/projects";

const titleChild = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 220, damping: 24 }
  }
};

export default function ProjectShell({
  project,
  accent = "cyan",
  glyph,
  children
}: {
  project: Project;
  accent?: "cyan" | "pink" | "lime" | "purple" | "amber" | "rose";
  glyph?: ReactNode;
  children: ReactNode;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const accentColor = {
    cyan: "#00f0ff",
    pink: "#ff2bd6",
    lime: "#b6ff00",
    purple: "#9d00ff",
    amber: "#ffae3d",
    rose: "#ff5e8a"
  }[accent];

  const accentClass = {
    cyan: "text-neon-cyan",
    pink: "text-neon-pink",
    lime: "text-neon-lime",
    purple: "text-neon-purple",
    amber: "text-neon-amber",
    rose: "text-neon-rose"
  }[accent];

  return (
    <main className="relative pb-32">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6 pt-16"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 grid-bg animate-grid-move"
        />

        {/* radial glow that pulses with the accent color */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${accentColor}22 0%, transparent 60%)`
          }}
        />

        {/* glyph drifts behind the title */}
        {glyph && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 0.18, scale: 1, rotate: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              className="w-[min(80vw,740px)]"
            >
              {glyph}
            </motion.div>
          </motion.div>
        )}

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          className="relative z-10 max-w-3xl text-center"
        >
          <motion.div
            variants={titleChild}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 backdrop-blur transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              back to index
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              {project.year}
            </span>
          </motion.div>

          <motion.p
            variants={titleChild}
            className={`mb-3 font-mono text-xs uppercase tracking-[0.4em] ${accentClass}`}
          >
            // {project.tags.join(" · ")}
          </motion.p>

          <motion.h1
            variants={titleChild}
            className="text-5xl sm:text-7xl font-bold leading-tight text-white neon-text"
          >
            {project.title}
          </motion.h1>

          <motion.p
            variants={titleChild}
            className="mx-auto mt-5 max-w-xl text-lg text-white/70"
          >
            {project.tagline}
          </motion.p>

          {/* PLAY NOW — sticky, glowing, the boss of this page */}
          {project.itchUrl && (
            <motion.div variants={titleChild} className="mt-10 flex justify-center">
              <PlayNowButton href={project.itchUrl} accent={accentColor} />
            </motion.div>
          )}

          <motion.p
            variants={titleChild}
            className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            scroll for the breakdown ↓
          </motion.p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-4xl px-6">{children}</div>

      {/* Footer back-link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-24 max-w-4xl px-6"
      >
        <div className="rounded-2xl border border-white/10 bg-panel/40 p-6 text-center neon-border">
          <p className="mb-4 text-sm text-white/60">
            That's the whole tour. Want another one?
          </p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-neon-pink/60 bg-neon-pink/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.3em] text-neon-pink transition-colors hover:bg-neon-pink/20"
          >
            ← all projects
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

function PlayNowButton({ href, accent }: { href: string; accent: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-neon-pink/60 px-8 py-4 font-mono text-sm uppercase tracking-[0.3em] text-white"
      style={{
        background: `linear-gradient(135deg, ${accent}33, #ff2bd633)`,
        boxShadow: `0 0 20px ${accent}66, 0 0 40px #ff2bd644`
      }}
    >
      {/* shimmer sweep */}
      <motion.span
        aria-hidden
        animate={{ x: ["-110%", "110%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/3"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)"
        }}
      />
      <motion.span
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 inline-block h-2 w-2 rounded-full"
        style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
      />
      <span className="relative z-10">play now</span>
      <span className="relative z-10 transition-transform group-hover:translate-x-1">↗</span>
    </motion.a>
  );
}
