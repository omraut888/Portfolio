"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ClipReveal, LineDraw } from "./Reveal";

interface ExperienceItem {
  company: string;
  role: string;
  date: string;
  location: string;
  color: string;
  badge: string;
  bullets: string[];
  stat: string;
  statLabel: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "The Ticker App, Inc.",
    role: "AI Developer Co-op",
    date: "Feb 2026 – Present",
    location: "Boston, MA",
    color: "#00e5ff",
    badge: "Current",
    bullets: [
      "Production RAG pipeline: Voyage AI embeddings, hierarchical K-means/DBSCAN clustering over 10B+ vectors in Qdrant, MMR re-ranking via LangGraph + FastAPI",
      "Authored technical PRD for MCP-integrated multi-agent system using Gemini 2.0 Flash with dynamic tool-calling and context injection across agent boundaries",
      "Designed embedding-based FAQ clustering and prompt data collection pipelines to surface high-frequency user intents for fine-tuning feedback loops",
    ],
    stat: "10B+",
    statLabel: "Vectors in Production",
  },
  {
    company: "PGP Glass",
    role: "Data Science Intern",
    date: "Mar 2024 – Jun 2024",
    location: "Mumbai, India",
    color: "#7040c0",
    badge: "Internship",
    bullets: [
      "Built predictive models for manufacturing using time-series and ensemble methods — improved forecast accuracy by 15% via cross-validation and feature selection",
      "Engineered automated preprocessing pipelines (pandas, scikit-learn) for outlier detection, imputation, and feature transformation — cut data prep time by 20%",
      "Conducted multivariate statistical analysis translating model outputs into recommendations adopted across cross-functional global teams",
    ],
    stat: "+15%",
    statLabel: "Forecast Accuracy",
  },
  {
    company: "Utsavi Trading Co.",
    role: "Data Analyst",
    date: "Jan 2024 – Mar 2024",
    location: "Mumbai, India",
    color: "#f0c060",
    badge: "Analyst",
    bullets: [
      "Built time-series and regression models to forecast demand — reduced stockouts by 15%",
      "Wrote and optimized complex SQL queries cutting reporting turnaround time significantly",
      "Built Tableau dashboards tracking supply chain KPIs — drove 20% efficiency improvement",
    ],
    stat: "+20%",
    statLabel: "Supply Chain Efficiency",
  },
];

function TimelineCard({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3, margin: "-50px" });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`relative flex gap-8 ${
        isLeft ? "flex-row" : "flex-row-reverse"
      } items-start`}
    >
      {/* Card */}
      <motion.div
        initial={{ opacity: 1, x: 0, y: 0 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1,
        }}
        className="flex-1 group"
      >
        <div
          className="rounded-2xl p-6 transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid rgba(255,255,255,0.08)`,
            backdropFilter: "blur(10px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`;
            (e.currentTarget as HTMLDivElement).style.background = `${item.color}05`;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${item.color}15`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">
                {item.company}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${item.color}20`,
                    color: item.color,
                    border: `1px solid ${item.color}40`,
                  }}
                >
                  {item.role}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {item.badge}
                </span>
              </div>
            </div>

            {/* Stat badge */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="text-right"
              style={{
                background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
                border: `1px solid ${item.color}30`,
                borderRadius: "12px",
                padding: "8px 14px",
              }}
            >
              <div
                className="text-xl font-black"
                style={{ color: item.color }}
              >
                {item.stat}
              </div>
              <div className="text-xs text-white/40 whitespace-nowrap">
                {item.statLabel}
              </div>
            </motion.div>
          </div>

          {/* Date & Location */}
          <div className="flex items-center gap-3 mb-4 text-white/40 text-xs">
            <span>📅 {item.date}</span>
            <span>•</span>
            <span>📍 {item.location}</span>
          </div>

          {/* Bullets */}
          <ul className="space-y-2.5">
            {item.bullets.map((bullet, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 1, x: 0 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex gap-3 text-white/65 text-sm leading-relaxed"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                {bullet}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Timeline dot */}
      <div className="hidden md:flex flex-col items-center relative" style={{ minWidth: 40 }}>
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="w-4 h-4 rounded-full z-10 mt-6"
          style={{
            background: item.color,
            boxShadow: `0 0 15px ${item.color}60, 0 0 30px ${item.color}30`,
          }}
        />
      </div>

      {/* Empty spacer for alternating layout */}
      <div className="flex-1 hidden md:block" />
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative z-10 pt-16 pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(3,3,8,0.82) 0%, rgba(6,3,24,0.78) 50%, rgba(3,3,8,0.82) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <ClipReveal className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00e5ff" }}>
            Work History
          </p>
          <h2 className="section-heading text-white">Work Experience</h2>
          <LineDraw className="mx-auto mt-8" style={{ maxWidth: 200 }} color="rgba(255,255,255,0.1)" />
        </ClipReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-white/5" />
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{
                height: lineHeight,
                background: "linear-gradient(180deg, #7040c0, #00e5ff, #f0c060)",
              }}
            />
          </div>

          <div className="space-y-12">
            {experiences.map((item, i) => (
              <TimelineCard key={item.company} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
