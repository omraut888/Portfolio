"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { Variants } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useMagneticHover } from "@/hooks/useMagneticHover";

const HeroCanvas = dynamic(() => import("./three/HeroCanvas"), { ssr: false });

const ROLES = [
  "AI Engineer",
  "ML Engineer",
  "Data Scientist",
  "RAG Architect",
  "AI Developer",
  "Data Analyst",
  "Problem Solver",
];

function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const size = Math.max(btn.offsetWidth, btn.offsetHeight);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 2.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

export default function Hero() {
  const { displayText } = useTypewriter({ words: ROLES });

  const primaryBtn = useMagneticHover<HTMLButtonElement>({ strength: 0.4 });
  const secondaryBtn = useMagneticHover<HTMLButtonElement>({ strength: 0.4 });

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const nameLetters = "Om Raut".split("");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* 3D particle sphere — full-bleed background, centered behind text */}
      <HeroCanvas />

      {/* Radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,229,255,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 60%, rgba(112,64,192,0.05) 0%, transparent 60%)",
        }}
      />
      {/* Dark vignette behind text for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 44%, rgba(0,0,0,0.62) 0%, transparent 68%)",
        }}
      />
      {/* Content — centered over the sphere */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Name — HUGE, letter by letter */}
        <div className="flex items-center justify-center flex-wrap">
          {nameLetters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: EASE_OUT,
                delay: 2.1 + i * 0.06,
              }}
              className="inline-block"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(72px, 12vw, 140px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: char === " " ? "transparent" : "#ffffff",
                textShadow: char === " " ? undefined : "0 0 60px rgba(0,0,0,0.8)",
                width: char === " " ? "0.25em" : undefined,
              }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </div>

        {/* Typewriter — massive hollow / outline text */}
        <motion.div variants={fadeUp} className="flex items-center justify-center mt-1 mb-8">
          <div
            className="font-display tracking-tight"
            style={{
              fontSize: "clamp(52px, 10vw, 116px)",
              fontWeight: 300,
              lineHeight: 1.05,
              minHeight: "1.05em",
              color: "#00e5ff",
              letterSpacing: "-0.02em",
            }}
          >
            {displayText}
            <span
              className="inline-block ml-1 align-middle animate-[cursorBlink_1s_step-end_infinite]"
              style={{
                width: 3,
                height: "0.7em",
                background: "#00e5ff",
                verticalAlign: "middle",
              }}
            />
          </div>
        </motion.div>

        {/* Available — subtle green dot */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2.5 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="text-white/55 text-sm font-mono tracking-wide">Available</span>
        </motion.div>

        {/* Bio */}
        <motion.p
          variants={fadeUp}
          className="text-white/45 mx-auto mb-12"
          style={{ maxWidth: 500, fontSize: 15, lineHeight: 1.75 }}
        >
          MS Information Systems @ Northeastern University — building production-grade
          RAG systems, multi-agent architectures &amp; LLM-powered applications.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
          <button
            ref={primaryBtn.ref}
            onMouseMove={primaryBtn.onMouseMove}
            onMouseLeave={() => {
              primaryBtn.onMouseLeave();
            }}
            onClick={(e) => {
              addRipple(e);
              scrollTo("projects");
            }}
            className="relative overflow-hidden px-8 py-3.5 rounded-full font-semibold text-white text-sm"
            style={{
              background: "linear-gradient(135deg, #7040c0, #00e5ff)",
              boxShadow: "0 0 30px rgba(0,229,255,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              transition: "box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 50px rgba(0,229,255,0.6), inset 0 1px 0 rgba(255,255,255,0.1)";
            }}
          >
            View My Work
          </button>

          <button
            ref={secondaryBtn.ref}
            onMouseMove={secondaryBtn.onMouseMove}
            onMouseLeave={() => {
              secondaryBtn.onMouseLeave();
              const btn = secondaryBtn.ref.current;
              if (btn) {
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.borderColor = "rgba(255,255,255,0.15)";
              }
            }}
            onClick={(e) => {
              addRipple(e);
              scrollTo("contact");
            }}
            className="relative overflow-hidden px-8 py-3.5 rounded-full font-semibold text-white text-sm"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              transition: "background 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,229,255,0.5)";
            }}
          >
            Contact Me
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div variants={fadeUp} className="mt-16 flex flex-col items-center gap-2">
          <span className="text-white/30 text-xs tracking-widest uppercase font-mono">
            Scroll
          </span>
          <div className="w-px h-12 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{
                height: "50%",
                background: "linear-gradient(180deg, #00e5ff, transparent)",
              }}
              animate={{ y: ["0%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
