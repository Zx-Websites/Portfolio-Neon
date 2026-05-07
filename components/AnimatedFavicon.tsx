"use client";

import { useEffect } from "react";

const FRAMES = 24;
const FPS = 12;

function svgFrame(t: number): string {
  // gentle bob + flame flicker, all driven from t in [0, 1)
  const bob = Math.sin(t * Math.PI * 2) * 0.6;
  const flameWiggle = Math.sin(t * Math.PI * 4) * 0.6;
  const flameLen = 7 + Math.sin(t * Math.PI * 4 + 0.3) * 1.5;
  const flameOpacity = 0.85 + Math.sin(t * Math.PI * 6) * 0.15;
  const portholeGlow = 0.7 + Math.sin(t * Math.PI * 2) * 0.3;

  // body & fins ride the bob
  const by = -bob;
  const flameY = 22 - bob;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<defs>
<linearGradient id="b" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#0a0118"/>
<stop offset="100%" stop-color="#1a0235"/>
</linearGradient>
<linearGradient id="body" x1="0" x2="1" y1="0" y2="1">
<stop offset="0%" stop-color="#fff"/>
<stop offset="100%" stop-color="#9be8ff"/>
</linearGradient>
<linearGradient id="flame" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#fff"/>
<stop offset="40%" stop-color="#00f0ff"/>
<stop offset="100%" stop-color="#ff2bd6" stop-opacity="0"/>
</linearGradient>
</defs>
<rect width="32" height="32" rx="6" fill="url(#b)"/>
<path d="M${14 + flameWiggle * 0.2} ${flameY} Q16 ${flameY + flameLen + 1} ${18 - flameWiggle * 0.2} ${flameY} Q17 ${flameY + flameLen * 0.6} 16 ${flameY + flameLen} Q15 ${flameY + flameLen * 0.6} ${14 + flameWiggle * 0.2} ${flameY} Z" fill="url(#flame)" opacity="${flameOpacity.toFixed(2)}"/>
<g transform="translate(0 ${by.toFixed(2)})">
<path d="M16 4 C20 8 21 13 21 17 L21 22 L11 22 L11 17 C11 13 12 8 16 4 Z" fill="url(#body)" stroke="#00f0ff" stroke-width="0.8"/>
<path d="M11 17 L7 21 L7 23 L11 22 Z" fill="#ff2bd6"/>
<path d="M21 17 L25 21 L25 23 L21 22 Z" fill="#ff2bd6"/>
<circle cx="16" cy="13" r="2.4" fill="#0a0118" stroke="#00f0ff" stroke-width="0.9"/>
<circle cx="15.3" cy="12.3" r="0.7" fill="#9be8ff" opacity="${portholeGlow.toFixed(2)}"/>
</g>
</svg>`;
}

function toDataUri(svg: string): string {
  // No base64 — encodeURIComponent keeps it small and SVG-friendly
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function AnimatedFavicon() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Find existing icon link or create one. Override anything Next.js injected.
    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    const original = link.getAttribute("href");
    link.type = "image/svg+xml";

    // Prebuild all frames once so the interval is cheap
    const frames = Array.from({ length: FRAMES }).map((_, i) =>
      toDataUri(svgFrame(i / FRAMES))
    );

    let i = 0;
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      link!.href = frames[i];
      i = (i + 1) % FRAMES;
    };
    tick();
    const id = window.setInterval(tick, 1000 / FPS);

    // Pause when tab is hidden — saves CPU and most browsers ignore favicon updates anyway
    const onVisibility = () => {
      if (document.hidden) {
        window.clearInterval(id);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopped = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      if (original) link!.href = original;
    };
  }, []);

  return null;
}
