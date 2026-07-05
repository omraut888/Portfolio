"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ClipReveal, WordReveal, LineDraw } from "./Reveal";

const TERMINAL_LINES = [
  { cmd: "whoami",    out: "Om Raut, AI Engineer"                   },
  { cmd: "location",  out: "Boston, MA"                              },
  { cmd: "status",    out: "Building production AI @ The Ticker App" },
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
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
        <span className="ml-2 text-white/25 text-[10px]">career.sh</span>
      </div>
      <div className="p-3 space-y-1.5 text-xs">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            <span style={{ color: "#00e5ff" }}>$ </span>
            <span style={{ color: "#00e5c0" }}>{line.cmd}</span>
            <div style={{ color: "rgba(255,255,255,0.55)", paddingLeft: "1em" }}>{line.out}</div>
          </div>
        ))}
        {visibleLines < TERMINAL_LINES.length && (
          <div>
            <span style={{ color: "#00e5ff" }}>$ </span>
            <span
              className="inline-block w-1.5 h-3 align-middle animate-[cursorBlink_1s_step-end_infinite]"
              style={{ background: "#00e5ff" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PortraitCard() {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden"
      style={{ width: 300, height: 440, boxShadow: "0 32px 90px rgba(0,0,0,0.9)" }}
    >
      <Image src="/profile.jpg" alt="Om Raut" fill className="object-cover xray-photo" />
      <div className="xray-line" />
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }} />
      <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: "22%", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }} />
      <div className="absolute inset-y-0 left-0 pointer-events-none" style={{ width: "15%", background: "linear-gradient(to right, rgba(0,0,0,0.4), transparent)" }} />
      <div className="absolute inset-y-0 right-0 pointer-events-none" style={{ width: "15%", background: "linear-gradient(to left, rgba(0,0,0,0.4), transparent)" }} />
      <svg className="absolute top-3 left-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M0 14 L0 0 L14 0" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#00e5ff] group-hover:[stroke-opacity:0.95]" />
      </svg>
      <svg className="absolute top-3 right-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M18 14 L18 0 L4 0" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#00e5ff] group-hover:[stroke-opacity:0.95]" />
      </svg>
      <svg className="absolute bottom-3 left-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M0 4 L0 18 L14 18" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#00e5ff] group-hover:[stroke-opacity:0.95]" />
      </svg>
      <svg className="absolute bottom-3 right-3 z-10" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M18 4 L18 18 L4 18" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" className="transition-[stroke,stroke-opacity] duration-500 group-hover:stroke-[#00e5ff] group-hover:[stroke-opacity:0.95]" />
      </svg>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Photo moves slower than scroll (~0.6x) → parallax depth
  const photoY = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 pt-16 pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(3,3,8,0.82) 0%, rgba(6,3,24,0.78) 50%, rgba(3,3,8,0.82) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute left-1/4 top-1/3 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Statement line */}
        <ClipReveal>
          <div className="max-w-4xl">
            <WordReveal
              text="I build systems that think."
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 400,
                lineHeight: 1.15,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            />
          </div>
          <LineDraw className="mt-12 mb-16" style={{ maxWidth: 260 }} color="rgba(0,229,255,0.4)" />
        </ClipReveal>

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
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#00e5ff" }}>
                Get to know me
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(30px, 3.5vw, 44px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  color: "#ffffff",
                }}
              >
                About Me
              </h2>
            </div>

            <p style={{ width: "100%", margin: 0, fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.62)" }}>
              I&apos;m an AI/ML Engineer and MS Information Systems candidate at Northeastern
              University, focused on building production-grade RAG systems, multi-agent
              architectures, and LLM-powered applications that hold up under real traffic.
            </p>
            <p style={{ width: "100%", margin: 0, fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.62)" }}>
              My work turns messy, high-volume data problems into systems that reason,
              retrieve, and act — from 10B+ vector embeddings in production to agent
              pipelines with human-in-the-loop safeguards. I care about the unglamorous
              parts: latency, evaluation, and correctness at the boundaries.
            </p>
            <p style={{ width: "100%", margin: 0, fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,0.62)" }}>
              Currently building AI at{" "}
              <span style={{ color: "#00e5ff" }}>The Ticker App</span>, where I ship
              retrieval and multi-agent infrastructure that reaches real users.
            </p>
          </motion.div>

          {/* Right: photo (parallax) + terminal */}
          <div className="flex flex-col items-center gap-6">
            <motion.div style={{ y: photoY }} className="flex flex-col items-center gap-5">
              <PortraitCard />
              {/* Name badge */}
              <div
                className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  Om Raut
                </span>
                <span className="text-white/40 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
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
