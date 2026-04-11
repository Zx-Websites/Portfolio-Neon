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
    id: "neon-runner",
    title: "Neon Runner",
    tagline: "Endless cyber-skater set to a synthwave beat.",
    description:
      "An infinite runner with reactive lighting, parallax cityscapes, and a chiptune soundtrack. Built solo in Unity.",
    tags: ["Unity", "C#", "Game"],
    itchUrl: "https://your-handle.itch.io/neon-runner",
    year: 2025,
    featured: true
  },
  {
    id: "void-drift",
    title: "Void Drift",
    tagline: "Zero-gravity racing prototype.",
    description:
      "Physics-based ship racing across procedurally lit tunnels. Local split-screen support.",
    tags: ["Godot", "GDScript", "Prototype"],
    itchUrl: "https://your-handle.itch.io/void-drift",
    year: 2024
  },
  {
    id: "pixel-forge",
    title: "Pixel Forge",
    tagline: "A tiny pixel-art editor for the browser.",
    description: "Layered canvas, palette swap, GIF export. Zero-install web app.",
    tags: ["Web", "TypeScript", "Tool"],
    repoUrl: "https://github.com/your-handle/pixel-forge",
    liveUrl: "https://example.com/pixel-forge",
    itchUrl: "https://your-handle.itch.io/void-drift",
    year: 2024
  },
  {
    id: "pixel-forge",
    title: "sanjana ke bubu bacha sabse acha!",
    tagline: "A tiny pixel-art editor for the browser.",
    description: "Layered canvas, palette swap, GIF export. Zero-install web app.",
    tags: ["Web", "TypeScript", "Tool"],
    repoUrl: "https://github.com/your-handle/pixel-forge",
    liveUrl: "https://example.com/pixel-forge",
    year: 2024
  }
];
