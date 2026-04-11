"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px]"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff2bd6 100%)",
          boxShadow:
            "0 0 12px rgba(0,240,255,0.8), 0 0 24px rgba(255,43,214,0.6)"
        }}
      />
    </motion.div>
  );
}
