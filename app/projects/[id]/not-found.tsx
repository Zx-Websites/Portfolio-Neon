import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="rounded-2xl border border-white/10 bg-panel/40 p-8 text-center neon-border">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-neon-pink">
          // 404 · stack underflow
        </p>
        <h1 className="mb-3 text-3xl font-bold text-white neon-text">no project here</h1>
        <p className="mb-6 text-sm text-white/60">
          This project id isn&apos;t in the catalogue. Maybe a typo, maybe a stub I haven&apos;t
          finished writing yet.
        </p>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/60 bg-neon-cyan/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan hover:bg-neon-cyan/20"
        >
          ← all projects
        </Link>
      </div>
    </main>
  );
}
