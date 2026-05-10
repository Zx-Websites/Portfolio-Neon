"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export function Block({
  kicker,
  title,
  children,
  accent = "cyan"
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
  accent?: "cyan" | "pink" | "lime" | "purple" | "amber" | "rose";
}) {
  const accentClass = {
    cyan: "text-neon-cyan",
    pink: "text-neon-pink",
    lime: "text-neon-lime",
    purple: "text-neon-purple",
    amber: "text-neon-amber",
    rose: "text-neon-rose"
  }[accent];

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="mt-24 first:mt-16"
    >
      {kicker && (
        <motion.p
          variants={fade}
          className={`mb-2 font-mono text-[10px] uppercase tracking-[0.4em] ${accentClass}`}
        >
          // {kicker}
        </motion.p>
      )}
      <motion.h2 variants={fade} className="mb-5 text-3xl font-bold text-white">
        {title}
      </motion.h2>
      <motion.div variants={fade} className="space-y-4 text-[15px] leading-relaxed text-white/75">
        {children}
      </motion.div>
    </motion.section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function K({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[12px] text-neon-cyan">
      {children}
    </span>
  );
}

export function Callout({
  children,
  tone = "default"
}: {
  children: ReactNode;
  tone?: "default" | "struggle" | "win";
}) {
  const styles = {
    default: "border-white/10 bg-white/5 text-white/75",
    struggle: "border-neon-pink/40 bg-neon-pink/5 text-white/80",
    win: "border-neon-lime/40 bg-neon-lime/5 text-white/80"
  }[tone];
  const icon = { default: "›", struggle: "✦", win: "✓" }[tone];
  const iconColor = {
    default: "text-white/40",
    struggle: "text-neon-pink",
    win: "text-neon-lime"
  }[tone];
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`my-6 flex gap-3 rounded-xl border px-5 py-4 ${styles}`}
    >
      <span className={`mt-0.5 font-mono text-lg leading-none ${iconColor}`}>{icon}</span>
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
    </motion.div>
  );
}

export function StatGrid({
  items
}: {
  items: { label: string; value: string; sub?: string }[];
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {items.map((s) => (
        <motion.div
          key={s.label}
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.96 },
            show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 240, damping: 24 } }
          }}
          whileHover={{ y: -3, borderColor: "rgba(0,240,255,0.5)" }}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {s.label}
          </div>
          <div className="mt-1 text-xl font-semibold text-white neon-text">{s.value}</div>
          {s.sub && <div className="mt-0.5 text-xs text-white/50">{s.sub}</div>}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Pipeline({
  steps
}: {
  steps: { label: string; sub?: string }[];
}) {
  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      className="my-6 space-y-3"
    >
      {steps.map((step, i) => (
        <motion.li
          key={i}
          variants={{
            hidden: { opacity: 0, x: -24 },
            show: {
              opacity: 1,
              x: 0,
              transition: { type: "spring", stiffness: 240, damping: 24 }
            }
          }}
          className="group flex gap-4 rounded-xl border border-white/10 bg-panel/40 p-4 transition-colors hover:border-neon-cyan/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 font-mono text-sm text-neon-cyan">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="font-medium text-white">{step.label}</div>
            {step.sub && (
              <div className="mt-1 font-mono text-xs text-white/50">{step.sub}</div>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <motion.pre
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-5 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-neon-cyan/90"
    >
      <code>{children}</code>
    </motion.pre>
  );
}

export function Formula({
  expr,
  caption
}: {
  expr: string;
  caption?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="my-6 rounded-xl border border-neon-purple/30 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-cyan/10 p-6 text-center"
      style={{
        boxShadow:
          "0 0 24px rgba(157,0,255,0.15), inset 0 0 24px rgba(0,240,255,0.06)"
      }}
    >
      <code className="block whitespace-pre-wrap font-mono text-[15px] leading-relaxed text-white">
        {expr}
      </code>
      {caption && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          {caption}
        </p>
      )}
    </motion.div>
  );
}

export function TagRow({ items }: { items: string[] }) {
  return (
    <div className="my-4 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
