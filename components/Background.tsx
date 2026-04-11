"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

export default function Background() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const skyX = useTransform(smx, [-1, 1], [-8, 8]);
  const skyY = useTransform(smy, [-1, 1], [-4, 4]);
  const moonX = useTransform(smx, [-1, 1], [-18, 18]);
  const moonY = useTransform(smy, [-1, 1], [-12, 12]);
  const farX = useTransform(smx, [-1, 1], [-22, 22]);
  const midX = useTransform(smx, [-1, 1], [-40, 40]);
  const nearX = useTransform(smx, [-1, 1], [-65, 65]);

  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        x: (i * 53.3) % 100,
        y: (i * 17.7) % 55,
        r: ((i % 4) + 1) * 0.4,
        o: 0.3 + ((i * 7) % 70) / 100,
        d: (i * 0.13) % 3
      })),
    []
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: (i * 37) % 100,
        delay: (i * 0.7) % 12,
        duration: 14 + (i % 7) * 2,
        size: 8 + (i % 4) * 3,
        drift: ((i % 5) - 2) * 30
      })),
    []
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: (i * 73) % 100,
        bottom: 4 + ((i * 11) % 28),
        delay: (i * 0.4) % 5,
        duration: 4 + (i % 3)
      })),
    []
  );

  const grass = useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => ({
        x: (i * 12.3) % 100,
        h: 8 + (i % 6) * 3,
        delay: (i * 0.07) % 2
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* twilight sky gradient (with parallax) */}
      <motion.div
        style={{ x: skyX, y: skyY, scale: 1.05 }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #050118 0%, #0e0530 18%, #2a0850 35%, #5a0e6e 52%, #a01577 66%, #e83c8f 78%, #ff8a6c 88%, #ffd089 96%)"
          }}
        />
      </motion.div>

      {/* aurora wash */}
      <motion.div
        animate={{ opacity: [0.35, 0.55, 0.35], x: [-20, 20, -20] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 35% at 50% 18%, rgba(0,240,255,0.18), transparent 60%), radial-gradient(ellipse 60% 30% at 20% 12%, rgba(157,0,255,0.22), transparent 60%)"
        }}
      />

      {/* stars */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {stars.map((s, i) => (
          <motion.circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#fff"
            initial={{ opacity: s.o }}
            animate={{ opacity: [s.o * 0.4, s.o, s.o * 0.4] }}
            transition={{ duration: 2 + s.d, repeat: Infinity, delay: s.d }}
          />
        ))}
      </svg>

      {/* shooting stars */}
      {[0, 5, 11].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-32 rounded-full"
          style={{
            top: `${10 + i * 8}%`,
            left: "-10%",
            background: "linear-gradient(90deg, transparent, #fff, transparent)",
            boxShadow: "0 0 8px 2px rgba(255,255,255,0.6)"
          }}
          animate={{ x: ["0vw", "120vw"], opacity: [0, 1, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatDelay: 9 + i * 3,
            delay,
            ease: "easeOut"
          }}
        />
      ))}

      {/* big neon moon (parallax) */}
      <motion.div
        style={{ x: moonX, y: moonY }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute right-[12%] top-[8%]"
      >
        <motion.div
          animate={{ boxShadow: [
            "0 0 80px 20px rgba(255,122,198,0.4), 0 0 160px 60px rgba(157,0,255,0.3)",
            "0 0 110px 30px rgba(255,122,198,0.55), 0 0 200px 80px rgba(157,0,255,0.4)",
            "0 0 80px 20px rgba(255,122,198,0.4), 0 0 160px 60px rgba(157,0,255,0.3)"
          ]}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #fff 0%, #ffd1ec 30%, #ff7ac6 65%, #c52a8a 80%, transparent 82%)"
          }}
        />
      </motion.div>

      {/* drifting clouds */}
      {[
        { top: "16%", duration: 95, dir: 1, w: 280, h: 14, color: "bg-white/20" },
        { top: "26%", duration: 130, dir: -1, w: 360, h: 12, color: "bg-pink-200/15" },
        { top: "8%", duration: 160, dir: 1, w: 220, h: 10, color: "bg-cyan-200/15" },
        { top: "32%", duration: 110, dir: 1, w: 320, h: 12, color: "bg-purple-200/12" }
      ].map((c, i) => (
        <motion.div
          key={i}
          initial={{ x: c.dir > 0 ? "-20%" : "110%" }}
          animate={{ x: c.dir > 0 ? "110%" : "-20%" }}
          transition={{ duration: c.duration, repeat: Infinity, ease: "linear" }}
          className={`absolute left-0 rounded-full blur-2xl ${c.color}`}
          style={{ top: c.top, width: c.w, height: c.h }}
        />
      ))}

      {/* sakura petals falling */}
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-[-6%]"
          style={{ left: `${p.left}%` }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift, 0, -p.drift, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20">
            <path
              d="M10 2 C13 6, 18 8, 10 18 C2 8, 7 6, 10 2 Z"
              fill="#ffb3d9"
              opacity="0.85"
            />
          </svg>
        </motion.div>
      ))}

      {/* distant mountains (far parallax) */}
      <motion.svg
        style={{ x: farX }}
        className="absolute bottom-0 left-[-5%] w-[110%]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        height="50%"
      >
        <defs>
          <linearGradient id="mtnFar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3a0f5c" />
            <stop offset="100%" stopColor="#0a0420" />
          </linearGradient>
        </defs>
        <path
          fill="url(#mtnFar)"
          d="M0,180 L120,90 L220,150 L340,60 L460,140 L580,80 L720,160 L860,70 L980,150 L1120,90 L1260,170 L1380,100 L1440,150 L1440,320 L0,320 Z"
        />
      </motion.svg>

      {/* mid hills */}
      <motion.svg
        style={{ x: midX }}
        className="absolute bottom-0 left-[-5%] w-[110%]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        height="42%"
      >
        <defs>
          <linearGradient id="hillMid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a3d2a" />
            <stop offset="100%" stopColor="#06140d" />
          </linearGradient>
        </defs>
        <path
          fill="url(#hillMid)"
          d="M0,220 C160,170 280,260 480,210 C680,170 820,250 1020,210 C1220,180 1340,240 1440,210 L1440,320 L0,320 Z"
        />
      </motion.svg>

      {/* near grass hills */}
      <motion.svg
        style={{ x: nearX }}
        className="absolute bottom-0 left-[-8%] w-[116%]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        height="32%"
      >
        <defs>
          <linearGradient id="hillNear" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0d6b3a" />
            <stop offset="55%" stopColor="#063a1f" />
            <stop offset="100%" stopColor="#02160a" />
          </linearGradient>
        </defs>
        <path
          fill="url(#hillNear)"
          d="M0,260 C140,220 260,290 460,250 C660,220 800,290 1000,250 C1200,220 1340,280 1440,250 L1440,320 L0,320 Z"
        />
      </motion.svg>

      {/* swaying grass blades */}
      <motion.div style={{ x: nearX }} className="absolute bottom-0 left-[-8%] w-[116%] h-24">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="h-full w-full">
          {grass.map((g, i) => (
            <motion.path
              key={i}
              d={`M${g.x * 14.4},100 Q${g.x * 14.4 + 2},${100 - g.h} ${g.x * 14.4 + 4},100 Z`}
              fill="#0a8c45"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{
                duration: 2.5 + g.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: g.delay
              }}
              style={{ transformOrigin: `${g.x * 14.4 + 2}px 100px` }}
            />
          ))}
        </svg>
      </motion.div>

      {/* fireflies */}
      {fireflies.map((f, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-neon-lime"
          style={{
            left: `${f.left}%`,
            bottom: `${f.bottom}%`,
            boxShadow: "0 0 10px 3px rgba(182,255,0,0.9)"
          }}
          animate={{
            y: [0, -25, -10, -30, 0],
            x: [0, 10, -10, 5, 0],
            opacity: [0.2, 1, 0.4, 1, 0.2]
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* dark vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(5,1,20,0.45) 70%, rgba(5,1,20,0.85) 100%)"
        }}
      />
    </div>
  );
}
