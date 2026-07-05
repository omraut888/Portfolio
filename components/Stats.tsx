"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { ClipReveal } from "./Reveal";

const STATS = [
  { target: 10, suffix: "B+", label: "Vectors in Production", color: "#00e5ff", decimals: 0 },
  { target: 86.7, suffix: "%", label: "RAG Accuracy", color: "#7040c0", decimals: 1 },
  { target: 5, suffix: "", label: "AI Agents Built", color: "#f0c060", decimals: 0 },
  { target: 3, suffix: "", label: "Production Systems", color: "#2563eb", decimals: 0 },
];

function Counter({ target, suffix, decimals }: { target: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1900;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function StatItem({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col items-center justify-center text-center px-6 py-6"
      style={{
        borderLeft: index === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(60px, 8vw, 100px)",
          fontWeight: 300,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: hover ? stat.color : "#ffffff",
          textShadow: hover ? `0 0 40px ${stat.color}80` : "none",
          transition: "color 0.4s, text-shadow 0.4s",
        }}
      >
        <Counter target={stat.target} suffix={stat.suffix} decimals={stat.decimals} />
      </div>
      <div
        className="mt-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative z-10 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <ClipReveal>
          <p className="text-center text-white/35 text-sm font-mono uppercase tracking-[0.25em] mb-10">
            Only the real numbers here
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <StatItem key={s.label} stat={s} index={i} />
            ))}
          </div>
        </ClipReveal>
      </div>
    </section>
  );
}
