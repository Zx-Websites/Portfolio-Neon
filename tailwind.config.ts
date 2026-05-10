import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05060a",
        panel: "#0b0d14",
        neon: {
          pink: "#ff2bd6",
          cyan: "#00f0ff",
          purple: "#9d00ff",
          lime: "#b6ff00",
          amber: "#ffae3d",
          rose: "#ff5e8a"
        }
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        neon: "0 0 12px rgba(0,240,255,0.6), 0 0 32px rgba(255,43,214,0.35)",
        "neon-soft": "0 0 8px rgba(0,240,255,0.35)"
      },
      animation: {
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "grid-move": "gridMove 16s linear infinite"
      },
      keyframes: {
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" }
        }
      }
    }
  },
  plugins: []
};
export default config;
