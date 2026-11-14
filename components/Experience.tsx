"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { CountUp, LineDraw, ScrollScale, ScrollSlide } from "./Reveal";

interface ExperienceItem {
  company: string;
  role: string;
  date: string;
  location: string;
  badge?: string;
  bullets: string[];
  stat: string;
  statLabel: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "The Ticker App, Inc.",
    role: "AI Developer Co-op",
    date: "Feb 2026 – Aug 2026",
    location: "Boston, MA",
    bullets: [
      "Built production RAG pipeline: Voyage AI embeddings, hierarchical K-means/DBSCAN clustering over 10B+ vectors in Qdrant, MMR re-ranking via LangGraph + FastAPI",
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
      <ScrollSlide index={index} className="flex-1 group">
        <div
          className="rounded-2xl p-6 transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid rgba(255,255,255,0.08)`,
            backdropFilter: "blur(10px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,48,58,0.3)";
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
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
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {item.role}
                </span>
                {item.badge && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Stat badge */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="text-right"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "8px 14px",
              }}
            >
              <div className="text-xl font-black text-accent">
                <CountUp value={item.stat} />
              </div>
              <div className="text-xs text-white/40 whitespace-nowrap">
                {item.statLabel}
              </div>
            </motion.div>
          </div>

          {/* Date & Location */}
          <div className="flex items-center gap-3 mb-4 text-white/40 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} strokeWidth={1.5} aria-hidden /> {item.date}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} strokeWidth={1.5} aria-hidden /> {item.location}
            </span>
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
                  style={{ background: "rgba(255,255,255,0.3)" }}
                />
                {bullet}
              </motion.li>
            ))}
          </ul>
        </div>
      </ScrollSlide>

      {/* Timeline dot */}
      <div className="hidden md:flex flex-col items-center relative" style={{ minWidth: 40 }}>
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="w-4 h-4 rounded-full z-10 mt-6"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 0 4px #0A0908",
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
        background: "rgba(10,9,8,0.97)" /* #0A0908 — darker, richer step below Skills */,
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <ScrollScale className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-accent">
            Work History
          </p>
          <h2 className="section-heading text-white">Work Experience</h2>
          <LineDraw className="mx-auto mt-8" style={{ maxWidth: 120 }} color="rgba(232,48,58,0.55)" />
        </ScrollScale>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-white/5" />
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{
                height: lineHeight,
                background: "rgba(232,48,58,0.5)",
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
