"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 24 } }
      }}
      whileHover={{ y: -6, rotate: -0.3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-panel/60 p-5 neon-border"
    >
      {project.featured && (
        <motion.span
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 280 }}
          className="absolute right-3 top-3 rounded-full border border-neon-pink/60 bg-neon-pink/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neon-pink"
        >
          Featured
        </motion.span>
      )}

      <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg grid-bg animate-grid-move bg-black/40">
        {project.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt={project.title}
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>

      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
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

      <div className="flex flex-wrap gap-2">
        {project.itchUrl && (
          <motion.a
            href={project.itchUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md border border-neon-pink/60 bg-neon-pink/10 px-3 py-1.5 text-xs font-mono text-neon-pink transition-colors hover:bg-neon-pink/20"
          >
            itch.io →
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
