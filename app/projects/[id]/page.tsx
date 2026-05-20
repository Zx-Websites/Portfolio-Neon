import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectShell from "@/components/projects/ProjectShell";
import ParticleGalaxyContent, { particleGalaxyGlyph } from "@/components/projects/content/ParticleGalaxyContent";
import FallingSandContent, { fallingSandGlyph } from "@/components/projects/content/FallingSandContent";
import OceanTankContent, { oceanTankGlyph } from "@/components/projects/content/OceanTankContent";
import KaleidoscopeContent, { kaleidoscopeGlyph } from "@/components/projects/content/KaleidoscopeContent";
import InkwellContent, { inkwellGlyph } from "@/components/projects/content/InkwellContent";
import SanctumContent, { sanctumGlyph } from "@/components/projects/content/SanctumContent";
import ProbeContent, { probeGlyph } from "@/components/projects/content/ProbeContent";
import type { Metadata } from "next";

type Accent = "cyan" | "pink" | "lime" | "purple" | "amber" | "rose" | "blue";

const REGISTRY: Record<
  string,
  { accent: Accent; glyph: React.ReactNode; Content: React.ComponentType }
> = {
  "particle-galaxy": {
    accent: "purple",
    glyph: particleGalaxyGlyph,
    Content: ParticleGalaxyContent
  },
  "physics-sandbox": {
    accent: "lime",
    glyph: fallingSandGlyph,
    Content: FallingSandContent
  },
  "ocean-tank": {
    accent: "cyan",
    glyph: oceanTankGlyph,
    Content: OceanTankContent
  },
  "kaleidoscope": {
    accent: "pink",
    glyph: kaleidoscopeGlyph,
    Content: KaleidoscopeContent
  },
  "inkwell": {
    accent: "amber",
    glyph: inkwellGlyph,
    Content: InkwellContent
  },
  "sanctum": {
    accent: "rose",
    glyph: sanctumGlyph,
    Content: SanctumContent
  },
  "probe": {
    accent: "blue",
    glyph: probeGlyph,
    Content: ProbeContent
  }
};

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const project = projects.find((p) => p.id === params.id);
  if (!project) return { title: "Project — Not found" };
  return {
    title: `${project.title} — Portfolio`,
    description: project.description
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);
  const entry = REGISTRY[params.id];
  if (!project || !entry) notFound();

  const { accent, glyph, Content } = entry;

  return (
    <ProjectShell project={project} accent={accent} glyph={glyph}>
      <Content />
    </ProjectShell>
  );
}
