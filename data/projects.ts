export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  cover?: string;
  itchUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  year: number;
  featured?: boolean;
};

/**
 * Add or update projects here. Each entry renders a card on the page.
 * To add a new project: copy a block, change the fields, save — hot reload picks it up.
 */
export const projects: Project[] = [
  {
    id: "ocean-tank",
    title: "Ocean Tank",
    tagline: "Oceam Sim.",
    description:
      "Oceam Sim in a mini tank with ripple interaction",
    tags: ["Unity", "C#", "Simulation"],
    itchUrl: "https://zxdelt.itch.io/oceantank",
    year: 2026,
    featured: true
  },
  {
    id: "physics-sandbox",
    title: "Physics Sandbox",
    tagline: "Sandbox Simulation.",
    description:
      "Mini Phy Sanbbox for showcase play",
    tags: ["Unity", "C#", "Simulation"],
    itchUrl: "https://zxdelt.itch.io/physics-sandbox",
    year: 2026,
    featured: true
  },
  {
    id: "particle-galaxy",
    title: "Particle Galaxy",
    tagline: "Particle Simulation.",
    description:
      "Mini Galaxy with stars for showcase play",
    tags: ["Unity", "C#", "Simulation"],
    itchUrl: "https://zxdelt.itch.io/particle-galaxy",
    year: 2026,
    featured: true
  }
  // {
  //   id: "void-drift",
  //   title: "Void Drift",
  //   tagline: "Zero-gravity racing prototype.",
  //   description:
  //     "Physics-based ship racing across procedurally lit tunnels. Local split-screen support.",
  //   tags: ["Godot", "GDScript", "Prototype"],
  //   itchUrl: "https://your-handle.itch.io/void-drift",
  //   year: 2024
  // },
  // {
  //   id: "pixel-forge",
  //   title: "Pixel Forge",
  //   tagline: "A tiny pixel-art editor for the browser.",
  //   description: "Layered canvas, palette swap, GIF export. Zero-install web app.",
  //   tags: ["Web", "TypeScript", "Tool"],
  //   repoUrl: "https://github.com/your-handle/pixel-forge",
  //   liveUrl: "https://example.com/pixel-forge",
  //   itchUrl: "https://your-handle.itch.io/void-drift",
  //   year: 2024
  // }
];
