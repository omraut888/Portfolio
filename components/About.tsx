"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import type { MotionValue } from "framer-motion";
import { LineDraw, WordStagger } from "./Reveal";
import RgbGlitch from "./RgbGlitch";

const TERMINAL_LINES = [
  { cmd: "whoami",    out: "Om Raut, AI Engineer"                   },
  { cmd: "location",  out: "Boston, MA"                              },
  { cmd: "status",    out: "Open to opportunities — AI/ML, RAG, agentic systems" },
  { cmd: "education", out: "MS Information Systems, Northeastern 2026" },
  { cmd: "stack",     out: "LangGraph · Qdrant · FastAPI · PyTorch"  },
];

function Terminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const tick = () => {
      setVisibleLines((v) => v + 1);
      i++;
      if (i < TERMINAL_LINES.length) setTimeout(tick, 600);
    };
    const t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: "rgba(5,5,8,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "var(--font-mono)",
        maxWidth: 340,
      }}
    >
      {/* macOS traffic lights */}
      <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
        <span className="ml-2 text-white/25 text-[10px]">career.sh</span>
      </div>
      <div className="p-3 space-y-1.5 text-xs">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            <span className="text-accent">$ </span>
            <span style={{ color: "rgba(255,255,255,0.85)" }}>{line.cmd}</span>
            <div style={{ color: "rgba(255,255,255,0.55)", paddingLeft: "1em" }}>{line.out}</div>
          </div>
        ))}
        {visibleLines < TERMINAL_LINES.length && (
          <div>
            <span className="text-accent">$ </span>
            <span
              className="inline-block w-1.5 h-3 align-middle animate-[cursorBlink_1s_step-end_infinite]"
              style={{ background: "var(--accent)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PortraitCard({ filter }: { filter: MotionValue<string> }) {
  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden"
      style={{ width: 300, height: 440, boxShadow: "0 28px 70px rgba(26,24,22,0.28)", filter }}
    >
      <RgbGlitch className="absolute inset-0">
        <Image src="/profile.jpg" alt="Om Raut" fill className="object-cover xray-photo" />
      </RgbGlitch>
      <div className="xray-line" />
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }} />
      <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: "22%", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }} />
      <div className="absolute inset-y-0 left-0 pointer-events-none" style={{ width: "15%", background: "linear-gradient(to right, rgba(0,0,0,0.4), transparent)" }} />
      <div className="absolute inset-y-0 right-0 pointer-events-none" style={{ width: "15%", background: "linear-gradient(to left, rgba(0,0,0,0.4), transparent)" }} />
      <svg className="absolute top-3 left-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M0 14 L0 0 L14 0" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#E8303A] group-hover:[stroke-opacity:0.95]" />
      </svg>
      <svg className="absolute top-3 right-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M18 14 L18 0 L4 0" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#E8303A] group-hover:[stroke-opacity:0.95]" />
      </svg>
      <svg className="absolute bottom-3 left-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M0 4 L0 18 L14 18" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#E8303A] group-hover:[stroke-opacity:0.95]" />
      </svg>
      <svg className="absolute bottom-3 right-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M18 4 L18 18 L4 18" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#E8303A] group-hover:[stroke-opacity:0.95]" />
      </svg>
    </motion.div>
  );
}

// Section scroll progress where the portrait starts / finishes regaining colour.
const PHOTO_GRAY_START = 0.15;
const PHOTO_COLOR_AT = 0.45;

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const reduceMotion = useReducedMotionSafe();
  // Photo drifts against the scroll for parallax depth (off for reduced motion).
  const photoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [140, -300]);
  // Photo starts fully desaturated and reaches full colour as it nears the
  // middle of the viewport. Not a motion effect, so it stays for reduced motion.
  const photoFilter = useTransform(scrollYProgress, (v) => {
    const t = Math.min(1, Math.max(0, (v - PHOTO_GRAY_START) / (PHOTO_COLOR_AT - PHOTO_GRAY_START)));
    return `grayscale(${(1 - t).toFixed(3)})`;
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="surface-light relative z-10 pt-16 pb-16 overflow-hidden"
    >

      <div className="max-w-7xl mx-auto px-6">
        {/* Statement line */}
        <div>
          <div className="max-w-4xl">
            <WordStagger
              text="I build systems that think."
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "clamp(48px, 8vw, 120px)",
                fontWeight: 400,
                lineHeight: 1.02,
                color: "var(--ink)",
                letterSpacing: "0.005em",
                textTransform: "uppercase",
              }}
            />
          </div>
          <LineDraw className="mt-12 mb-16" style={{ maxWidth: 260 }} color="rgba(232,48,58,0.8)" />
        </div>

        {/* Two columns: bio fills the left, photo/terminal hugs its content on the right */}
        <div className="grid lg:grid-cols-[1fr_max-content] gap-12 lg:gap-16 items-stretch">
          {/* Left: long-form bio */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="w-full min-w-0 flex flex-col justify-center space-y-7"
            style={{ marginLeft: 0, paddingLeft: 0, alignSelf: "stretch" }}
          >
            {/* Section heading */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-accent">
                Get to know me
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(30px, 3.5vw, 44px)",
                  fontWeight: 400,
                  lineHeight: 1.05,
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                }}
              >
                About Me
              </h2>
            </div>

            <p style={{ width: "100%", margin: 0, fontSize: 17, lineHeight: 1.8, color: "rgba(26,24,22,0.72)" }}>
              I&apos;m an AI/ML Engineer and MS Information Systems candidate at Northeastern
              University, focused on building production-grade RAG systems, multi-agent
              architectures, and LLM-powered applications that hold up under real traffic.
            </p>
            <p style={{ width: "100%", margin: 0, fontSize: 17, lineHeight: 1.8, color: "rgba(26,24,22,0.72)" }}>
              My work turns messy, high-volume data problems into systems that reason,
              retrieve, and act — from 10B+ vector embeddings in production to agent
              pipelines with human-in-the-loop safeguards. I care about the unglamorous
              parts: latency, evaluation, and correctness at the boundaries.
            </p>
            <p style={{ width: "100%", margin: 0, fontSize: 17, lineHeight: 1.8, color: "rgba(26,24,22,0.72)" }}>
              Previously built AI at{" "}
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>The Ticker App</span> (Feb 2026 – Aug 2026),
              where I shipped retrieval and multi-agent infrastructure that reached real users.
            </p>
          </motion.div>

          {/* Right: photo (parallax) + terminal */}
          <div className="flex flex-col items-center gap-6">
            <motion.div style={{ y: photoY }} className="flex flex-col items-center gap-5">
              <PortraitCard filter={photoFilter} />
              {/* Name badge */}
              <div
                className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(26,24,22,0.04)",
                  border: "1px solid rgba(26,24,22,0.12)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                <span className="text-ink/90 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  Om Raut
                </span>
                <span className="text-ink/50 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  NEU 2026
                </span>
              </div>
            </motion.div>
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}
