"use client";

import { useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import dynamic from "next/dynamic";
import type { Variants } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useMagnetic } from "@/hooks/useMagnetic";
import { scrubOpacity } from "./Reveal";

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

const HeroCanvas = dynamic(() => import("./three/HeroCanvas"), { ssr: false });

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

  const primaryBtn = useMagnetic<HTMLButtonElement>();
  const secondaryBtn = useMagnetic<HTMLButtonElement>();

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const nameLetters = "Om Raut".split("");

  // Name grows and dissolves as the hero scrolls away (scrubbed to scroll).
  // The name leaves the viewport after roughly the first third of the hero's
  // scroll, so both effects complete within the first half to stay on-screen.
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const nameScale = useTransform(scrollYProgress, [0, 0.5], [1, reduceMotion ? 1 : 1.35]);
  const nameOpacity = useTransform(scrollYProgress, scrubOpacity([0, 0.45], [1, 0]));

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* 3D particle sphere — full-bleed background, centered behind text */}
      <HeroCanvas />

      {/* Content — centered over the sphere */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Name — HUGE, letter by letter */}
        <motion.div
          className="flex items-center justify-center flex-wrap"
          style={{ scale: nameScale, opacity: nameOpacity }}
        >
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
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(48px, 8vw, 120px)",
                fontWeight: 400,
                letterSpacing: "0.01em",
                lineHeight: 1.02,
                textTransform: "uppercase",
                color: char === " " ? "transparent" : "#ffffff",
                textShadow: char === " " ? undefined : "0 0 60px rgba(0,0,0,0.8)",
                width: char === " " ? "0.25em" : undefined,
              }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Typewriter — massive hollow / outline text */}
        <motion.div variants={fadeUp} className="flex items-center justify-center mt-4 mb-8">
          <div
            className="text-accent"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(20px, 2.4vw, 30px)",
              fontWeight: 500,
              lineHeight: 1.3,
              minHeight: "1.3em",
              letterSpacing: "0.01em",
            }}
          >
            {displayText}
            <span
              className="inline-block ml-1 align-middle animate-[cursorBlink_1s_step-end_infinite]"
              style={{
                width: 3,
                height: "0.9em",
                background: "var(--accent)",
                verticalAlign: "middle",
              }}
            />
          </div>
        </motion.div>

        {/* Available — subtle status dot */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2.5 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
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
          <motion.button
            ref={primaryBtn.ref}
            onMouseLeave={() => {
              const btn = primaryBtn.ref.current;
              if (btn) btn.style.background = "transparent";
            }}
            onClick={(e) => {
              addRipple(e);
              scrollTo("projects");
            }}
            className="relative overflow-hidden px-8 py-3.5 rounded-full font-semibold text-sm"
            style={{
              x: primaryBtn.x,
              y: primaryBtn.y,
              background: "transparent",
              border: "1px solid var(--accent)",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(232,48,58,0.12)";
            }}
          >
            <span className="text-accent">View My Work</span>
          </motion.button>

          <motion.button
            ref={secondaryBtn.ref}
            onMouseLeave={() => {
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
              x: secondaryBtn.x,
              y: secondaryBtn.y,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              transition: "background 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,48,58,0.5)";
            }}
          >
            Contact Me
          </motion.button>
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
                background: "linear-gradient(180deg, var(--accent), transparent)",
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
