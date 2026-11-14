"use client";

import { ClipReveal, CountUp } from "./Reveal";

const STATS = [
  { target: 10, suffix: "B+", label: "Vectors in Production", decimals: 0 },
  { target: 86.7, suffix: "%", label: "RAG Accuracy", decimals: 1 },
  { target: 5, suffix: "", label: "AI Agents Built", decimals: 0 },
  { target: 3, suffix: "", label: "Production Systems", decimals: 0 },
];

function StatItem({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6 py-6"
      style={{
        borderLeft: index === 0 ? "none" : "1px solid rgba(26,24,22,0.12)",
      }}
    >
      <div
        className="text-accent"
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "clamp(60px, 8vw, 100px)",
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "0.01em",
        }}
      >
        <CountUp value={stat.target.toFixed(stat.decimals) + stat.suffix} />
      </div>
      <div
        className="mt-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(26,24,22,0.5)",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="surface-light relative z-10 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <ClipReveal>
          <p className="text-center text-ink/50 text-sm font-mono uppercase tracking-[0.25em] mb-10">
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
