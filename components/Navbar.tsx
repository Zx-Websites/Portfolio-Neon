"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useMotionValueEvent(scrollY, "change", (y: number) => {
    const prev = scrollY.getPrevious() ?? 0;
    setAtTop(y < 10);
    if (y > prev && y > 80) setHidden(true);
    else if (y < prev) setHidden(false);
  });

  if (pathname?.startsWith("/projects/")) return null;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        className={`mx-auto mt-3 flex max-w-5xl items-center justify-between rounded-full px-5 py-3 backdrop-blur-md transition-colors duration-300 ${
          atTop
            ? "bg-panel/40 border border-white/5"
            : "bg-panel/80 border border-neon-cyan/30 shadow-neon-soft"
        }`}
      >
        <motion.a
          href="#home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="font-mono text-sm tracking-widest text-neon-cyan neon-text"
        >
          &lt;DEV/&gt;
        </motion.a>
        <ul className="flex gap-1 sm:gap-2">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
            >
              <a
                href={l.href}
                className="rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/70 transition-colors hover:text-neon-pink hover:bg-white/5"
              >
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
