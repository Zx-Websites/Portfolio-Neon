"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import { THUMBS } from "@/components/projects/Thumbnails";

export default function ProjectCard({ project }: { project: Project }) {
  const Thumb = THUMBS[project.id];
  const cardRef = useRef<HTMLElement>(null);
  // Only mount the animated thumbnail when the card is near the viewport.
  // Using once:false so the thumb pauses (unmounts) when scrolled past again.
  const inView = useInView(cardRef, { margin: "200px 0px" });

  return (
    <motion.article
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 24 } }
      }}
      whileHover={{ y: -6, rotate: -0.3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-panel/60 p-5 neon-border"
    >
      {/* shimmer that sweeps on hover — animation runs only on hover (whileHover) so
          inactive cards don't burn frames. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 opacity-0 group-hover:opacity-100"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.18), transparent)"
        }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "350%" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />

      {project.featured && (
        <motion.span
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 280 }}
          className="absolute right-3 top-3 z-10 rounded-full border border-neon-pink/60 bg-neon-pink/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neon-pink"
        >
          Featured
        </motion.span>
      )}

      <Link
        href={`/projects/${project.id}`}
        className="block focus:outline-none"
        aria-label={`Open ${project.title} project page`}
      >
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-black/40 transition-transform group-hover:scale-[1.02]">
          {Thumb ? (
            <div className="relative h-full w-full">
              {/* Mount thumb only when near viewport — saves CPU when scrolled away. */}
              {inView ? (
                <Thumb />
              ) : (
                <div className="grid-bg h-full w-full opacity-40" />
              )}
              {/* subtle vignette so the title stays readable on contrasty thumbs */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 60%, rgba(5,6,10,0.55) 100%)"
                }}
              />
            </div>
          ) : project.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover}
              alt={project.title}
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
          ) : (
            <div className="grid-bg animate-grid-move h-full w-full" />
          )}
        </div>

        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-neon-cyan">
            {project.title}
          </h3>
          <span className="font-mono text-xs text-white/40">{project.year}</span>
        </div>

        <p className="mb-2 text-sm text-neon-cyan/90">{project.tagline}</p>
        <p className="mb-4 text-sm leading-relaxed text-white/60">{project.description}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white/60"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-1.5 text-xs font-mono text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:tracking-wider"
        >
          breakdown
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
        {project.itchUrl && (
          <motion.a
            href={project.itchUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-md border border-neon-pink/60 bg-neon-pink/10 px-3 py-1.5 text-xs font-mono text-neon-pink transition-colors hover:bg-neon-pink/20"
          >
            play ↗
          </motion.a>
        )}
        {project.liveUrl && (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-1.5 text-xs font-mono text-neon-cyan transition-colors hover:bg-neon-cyan/20"
          >
            live →
          </motion.a>
        )}
        {project.repoUrl && (
          <motion.a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/80 transition-colors hover:bg-white/10"
          >
            code →
          </motion.a>
        )}
      </div>
    </motion.article>
  );
}
