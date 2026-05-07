"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import Section from "@/components/Section";
import { projects } from "@/data/projects";

const heroChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 24 } }
};

export default function Page() {
  return (
    <main className="relative">
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 grid-bg animate-grid-move"
        />
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
          className="relative z-10 max-w-3xl text-center"
        >
          <motion.p
            variants={heroChild}
            className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan"
          >
            // game developer · creative coder
          </motion.p>
          <motion.h1
            variants={heroChild}
            className="text-6xl sm:text-8xl font-bold tracking-tight leading-[1.05] text-white neon-text"
          >
            Jayant <span className="text-neon-pink">Bodse</span>
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="mx-auto mt-6 max-w-xl text-base text-white/60"
          >
            Solo dev shipping experimental games and tools. Most of my work lives on itch.io.
          </motion.p>
          <motion.div variants={heroChild} className="mt-8 flex justify-center gap-3">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-neon-cyan/60 bg-neon-cyan/10 px-5 py-2 text-sm font-mono text-neon-cyan transition-colors hover:bg-neon-cyan/20"
            >
              view projects
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-mono text-white/80 transition-colors hover:bg-white/10"
            >
              get in touch
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      <Section id="about" className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="mb-6 text-3xl font-bold text-white">
          <span className="text-neon-pink">#</span> about
        </h2>
        <div className="rounded-2xl bg-panel/60 p-6 neon-border">
          <p className="text-white/70 leading-relaxed">
            Hi, I'm a developer who loves shipping small, self-contained experiences. I work across
            Unity, Godot, and the web. When I'm not coding I'm probably playing with shaders or
            making chiptunes. This site is a living index of what I've made — featured work below,
            with itch.io links where applicable.
          </p>
        </div>
      </Section>

      <Section id="projects" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-neon-pink">#</span> projects
          </h2>
          <span className="font-mono text-xs text-white/40">
            {projects.length} entries · edit data/projects.ts
          </span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p, i) => (
            <ProjectCard key={`${p.id}-${i}`} project={p} />
          ))}
        </motion.div>
      </Section>

      <Section id="contact" className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="mb-6 text-3xl font-bold text-white">
          <span className="text-neon-pink">#</span> contact
        </h2>
        <div className="rounded-2xl bg-panel/60 p-6 neon-border">
          <p className="mb-4 text-white/70">
            Reach out via email or socials — I read everything.
          </p>
          <div className="flex flex-wrap gap-2">
            <motion.a
              href="mailto:j.bodse98@gmail.com"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-1.5 text-xs font-mono text-neon-cyan hover:bg-neon-cyan/20"
            >
              j.bodse98@gmail.com →
            </motion.a>
            <motion.a
              href="https://www.instagram.com/zx_origin_?igsh=MXJiamt5amhqMHVjZA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md border border-neon-pink/60 bg-neon-pink/10 px-3 py-1.5 text-xs font-mono text-neon-pink hover:bg-neon-pink/20"
            >
              instagram →
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/jayant-bodse-21ab621a6/"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md border border-neon-purple/60 bg-neon-purple/10 px-3 py-1.5 text-xs font-mono text-neon-purple hover:bg-neon-purple/20"
            >
              linkedin →
            </motion.a>
          </div>
        </div>
        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
          Handmade by ZxDelt
        </p>
      </Section>
    </main>
  );
}
