"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Metric { value: string; label: string }

interface Project {
  id: string;
  title: string;
  tagline: string;
  color: string;
  status: string;
  /** Public repo URL. Omit for private / unreleased projects. */
  repo?: string;
  metrics: Metric[];
  /** Omit for projects with no public details yet — the row renders as "Coming Soon". */
  detail?: {
    problem: string;
    architecture: string;
    innovation: string;
    stack: string[];
  };
}

const PROJECTS: Project[] = [
  {
    id: "meridian",
    title: "MERIDIAN",
    tagline: "Hybrid RAG pipeline built for production-grade retrieval",
    color: "#00e5ff",
    status: "Public · PolyForm Strict license",
    repo: "https://github.com/omraut888/meridian",
    metrics: [
      { value: "Hybrid", label: "K-means/DBSCAN" },
      { value: "Dense+Sparse", label: "Retrieval Eval" },
      { value: "MMR", label: "Re-ranking" },
    ],
    detail: {
      problem: "Naive vector search misses relevant results when queries are ambiguous or results cluster around near-duplicates.",
      architecture: "Qdrant + Voyage AI embeddings, hierarchical K-means/DBSCAN clustering, MMR re-ranking, FastAPI serving layer, with a generation module for cited, streamed answers.",
      innovation: "An eval harness (dense-only vs hybrid vs cluster-routing vs MMR) that let the numbers decide the default — cluster routing is built and tested but shipped off by default based on those results.",
      stack: ["Qdrant", "Voyage AI", "FastAPI", "MMR re-ranking"],
    },
  },
  {
    id: "umbra",
    title: "UMBRA",
    tagline: "RAG coverage diagnostics — maps blind spots in retrieval systems",
    color: "#7040c0",
    status: "In Progress",
    metrics: [
      { value: "Confidence", label: "Retrieval Scoring" },
      { value: "Entropy", label: "Semantic Signal" },
      { value: "Dark Zones", label: "Failure Clusters" },
    ],
    detail: {
      problem: "RAG systems fail silently — you don't know where your retrieval has blind spots until a user hits one.",
      architecture: "Synthetic probe queries scored for retrieval confidence, semantic entropy, and hallucination probability; failures clustered via UMAP + HDBSCAN into \"dark zones.\"",
      innovation: "Validates the coverage scorer against a synthetic knowledge base with known ground truth before wiring up any live production endpoint — accuracy checked before it ever touches real data.",
      stack: ["UMAP + HDBSCAN", "Synthetic probe generation"],
    },
  },
  {
    id: "invariant",
    title: "INVARIANT",
    tagline: "Autonomous quant research pipeline — causal signal discovery to portfolio construction",
    color: "#f0c060",
    status: "Planned — next build",
    metrics: [
      { value: "Decay", label: "Validation" },
      { value: "Adversarial", label: "Regime Certification" },
    ],
    detail: {
      problem: "Most \"quant AI\" pipelines find signals that decay the moment they're deployed.",
      architecture: "A closed-loop system — causal signal discovery, information-theoretic decay validation, distributionally robust portfolio construction, adversarial regime certification.",
      innovation: "LLM-generated research memos turn each cycle's output into a human-readable investment thesis, not just a number.",
      stack: ["Causal discovery", "DRO optimization", "LLM memo generation"],
    },
  },
  {
    id: "sentinel-x",
    title: "SENTINEL-X",
    tagline: "A cross-modal AI system that flags when a company's own earnings-call statements and its SEC filings quietly contradict each other, and checks its stated guidance against what the real financial data actually supports.",
    color: "#2563eb",
    status: "Private · Repo release pending",
    metrics: [],
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
  const hasDetail = !!project.detail;
  const active = hasDetail && (hover || isExpanded);

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
        onClick={hasDetail ? onToggle : undefined}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex items-start gap-6 md:gap-12"
        style={{
          position: "relative",
          cursor: hasDetail ? "pointer" : "default",
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
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", marginBottom: 4 }}>
            {project.status}
          </div>
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
            {!hasDetail ? "Coming Soon" : isExpanded ? "← Collapse" : "View Details →"}
          </div>
        </div>
      </div>

      {/* ── Expandable detail panel ── */}
      <AnimatePresence initial={false}>
        {isExpanded && project.detail && (
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
                  <SectionBlock heading="The Problem" body={project.detail!.problem} />
                  <SectionBlock heading="The Architecture" body={project.detail!.architecture} />
                  <SectionBlock heading="Key Innovation" body={project.detail!.innovation} />
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
                      {project.detail!.stack.map((t) => (
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

                  {/* Repo link + collapse button — bottom right */}
                  <div className="flex justify-end gap-3 mt-auto pt-2">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: project.color,
                          background: "transparent",
                          border: `1px solid ${project.color}`,
                          borderRadius: 999,
                          padding: "8px 18px",
                          letterSpacing: "0.03em",
                          textDecoration: "none",
                        }}
                      >
                        GitHub ↗
                      </a>
                    )}
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
