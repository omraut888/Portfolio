"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Metric { value: string; label: string }

interface Project {
  id: string;
  title: string;
  tagline: string;
  color: string;
  metrics: Metric[];
  detail: {
    problem: string;
    architecture: string;
    innovation: string;
    stack: string[];
  };
}

const PROJECTS: Project[] = [
  {
    id: "codegen",
    title: "CodeGen AI",
    tagline: "5-agent system automating the full software dev lifecycle",
    color: "#2563eb",
    metrics: [
      { value: "89%", label: "Code Quality" },
      { value: "60%", label: "Faster Generation" },
      { value: "92%", label: "Test Pass Rate" },
    ],
    detail: {
      problem: "Manual code review cycles waste 60%+ of developer time. Repetitive generation-review loops create bottlenecks that slow shipping velocity and increase error rates in production.",
      architecture: "A 5-agent pipeline — Generate → Review → Test → Document → Optimize — orchestrated in LangGraph with Pydantic-typed handoffs. Airflow ingests from GitHub/StackOverflow; Pinecone stores embeddings.",
      innovation: "RAG pipeline with semantic chunking orchestrated by LangGraph. Schema validation at every agent boundary stops early errors from amplifying through the chain.",
      stack: ["LangGraph", "FastAPI", "PostgreSQL", "Docker", "Airflow", "Pinecone"],
    },
  },
  {
    id: "aurelia",
    title: "AURELIA",
    tagline: "Financial RAG system with 86.7% retrieval accuracy",
    color: "#7040c0",
    metrics: [
      { value: "86.7%", label: "Retrieval" },
      { value: "+23%", label: "Over Baseline" },
      { value: "3,462", label: "Pages Processed" },
    ],
    detail: {
      problem: "A 3,462-page financial manual is impossible to query accurately with standard search — dense-only retrieval misses keyword matches, keyword-only misses semantic context.",
      architecture: "Multi-strategy chunking feeds ChromaDB for dense retrieval plus BM25 for keywords, with a Wikipedia fallback for out-of-manual context. FastAPI + Streamlit frontend, Airflow ETL.",
      innovation: "Hybrid dense + keyword retrieval with Reciprocal Rank Fusion, outperforming the single-strategy dense baseline by 23% on a 500-question test set.",
      stack: ["ChromaDB", "FastAPI", "Streamlit", "Airflow", "Python", "BM25"],
    },
  },
  {
    id: "orbit",
    title: "ORBIT v2",
    tagline: "Multi-agent PE intelligence with Human-in-the-Loop gates",
    color: "#00e5ff",
    metrics: [
      { value: "97%+", label: "Test Coverage" },
      { value: "<500ms", label: "Agent Step" },
      { value: "~15%", label: "HITL Catch Rate" },
    ],
    detail: {
      problem: "Private equity research requires synthesizing hundreds of data points per deal. Manual first-pass analysis is the bottleneck — analysts spend 80% of their time gathering data.",
      architecture: "A LangGraph state machine with conditional edges — Research → Analysis → HITL Checkpoint → Recommendation — using ReAct reasoning. ChromaDB stores deal memory; Airflow orchestrates pipelines.",
      innovation: "MCP integration with live tool-calling across agent boundaries, plus HITL gates that pause the graph for review then resume from exact checkpoint state.",
      stack: ["LangGraph", "MCP", "FastAPI", "ChromaDB", "Airflow", "ReAct"],
    },
  },
  {
    id: "ticker-gpt",
    title: "Ticker GPT",
    tagline: "ChatGPT Store GPT for social investing education",
    color: "#f0c060",
    metrics: [
      { value: "4", label: "Modules" },
      { value: "Live", label: "On GPT Store" },
      { value: "RAG", label: "Backend Active" },
    ],
    detail: {
      problem: "Retail investors lack structured, accessible AI-powered education. Existing tools either give generic (risky) advice or are too complex for beginners.",
      architecture: "GPT Builder custom instructions with function-calling into a live Qdrant RAG backend, scoped to a 4-module curriculum with guardrails enforcing regulatory compliance.",
      innovation: "First social investing GPT with a live vector backend on the ChatGPT Store — curriculum-scoped retrieval keeps responses educational and compliant.",
      stack: ["GPT Builder", "RAG", "LangGraph", "Qdrant", "FastAPI"],
    },
  },
];

const PANEL_EASE = [0.4, 0, 0.2, 1] as [number, number, number, number];

function SectionBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 500,
          color: "#ffffff",
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        {heading}
      </h4>
      <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
        {body}
      </p>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  isExpanded,
  onToggle,
}: {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [hover, setHover] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  const active = hover || isExpanded;

  return (
    <motion.div
      // Start visible so the project rows are never left blank in Chrome if
      // whileInView fails to fire (this section's content otherwise vanishes).
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "0px 0px -10px 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* ── Row header (click anywhere to toggle) ── */}
      <div
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex items-start gap-6 md:gap-12"
        style={{
          position: "relative",
          cursor: "pointer",
          padding: "clamp(24px, 3.5vw, 44px) clamp(14px, 2.5vw, 36px)",
          borderLeft: `3px solid ${active ? project.color : "transparent"}`,
          background: active ? "rgba(255,255,255,0.025)" : "transparent",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(40px, 6vw, 88px)",
            fontWeight: 400,
            lineHeight: 1,
            color: "#ffffff",
            opacity: 0.08,
            flexShrink: 0,
          }}
        >
          {num}
        </span>

        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: active ? project.color : "#ffffff",
              textShadow: active ? `0 0 40px ${project.color}70` : "none",
              transition: "color 0.4s, text-shadow 0.4s",
            }}
          >
            {project.title}
          </div>
          <div style={{ marginTop: 14, fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, maxWidth: 540 }}>
            {project.tagline}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0" style={{ minWidth: 170, paddingTop: 8 }}>
          {project.metrics.map((m) => (
            <div key={m.label} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
              <span style={{ color: project.color, fontWeight: 600 }}>{m.value}</span> {m.label}
            </div>
          ))}
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: active ? project.color : "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-mono)",
              transition: "color 0.3s",
            }}
          >
            {isExpanded ? "← Collapse" : "View Details →"}
          </div>
        </div>
      </div>

      {/* ── Expandable detail panel ── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.5, ease: PANEL_EASE },
              opacity: { duration: 0.3 },
            }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                margin: "0 clamp(8px, 2vw, 28px) 28px",
                padding: "clamp(28px, 3vw, 44px)",
                background: "rgba(8,8,12,0.8)",
                borderLeft: `3px solid ${project.color}`,
                borderRadius: 14,
              }}
            >
              <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                {/* LEFT column */}
                <div className="flex flex-col gap-8">
                  <SectionBlock heading="The Problem" body={project.detail.problem} />
                  <SectionBlock heading="The Architecture" body={project.detail.architecture} />
                  <SectionBlock heading="Key Innovation" body={project.detail.innovation} />
                </div>

                {/* RIGHT column */}
                <div className="flex flex-col gap-10">
                  {/* Key metrics — large numbers, no badges */}
                  <div>
                    <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.16em", color: project.color, marginBottom: 18 }}>
                      Key Metrics
                    </div>
                    <div className="flex flex-wrap gap-x-12 gap-y-8">
                      {project.metrics.map((m) => (
                        <div key={m.label}>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400, lineHeight: 1, color: project.color }}>
                            {m.value}
                          </div>
                          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack — simple pills */}
                  <div>
                    <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.16em", color: project.color, marginBottom: 14 }}>
                      Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.detail.stack.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: 12,
                            fontFamily: "var(--font-mono)",
                            padding: "5px 12px",
                            borderRadius: 999,
                            color: "rgba(255,255,255,0.55)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Collapse button — bottom right */}
                  <div className="flex justify-end mt-auto pt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggle(); }}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: project.color,
                        background: "transparent",
                        border: `1px solid ${project.color}`,
                        borderRadius: 999,
                        padding: "8px 18px",
                        cursor: "pointer",
                        letterSpacing: "0.03em",
                      }}
                    >
                      ← Collapse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectsGallery() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      {PROJECTS.map((p, i) => (
        <ProjectCard
          key={p.id}
          project={p}
          index={i}
          isExpanded={expandedId === p.id}
          onToggle={() => toggle(p.id)}
        />
      ))}
    </div>
  );
}
