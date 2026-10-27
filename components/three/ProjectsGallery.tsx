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
      { value: "96.7%", label: "Multi-Doc Recall · from 90.0%" },
      { value: "8.2 / 10", label: "Distinct Docs@10 · from 7.0" },
      { value: "55", label: "Tests · Unit + Live Integration" },
      { value: "359", label: "Chunks · 290 Eval Queries" },
    ],
    detail: {
      problem: "RAG pipelines are usually evaluated end to end — ask a question, read the answer, decide if it looks right. That only measures the net result. If one stage helps and another quietly hurts, the aggregate score still looks fine, and the broken stage never gets found. Most RAG projects never actually learn which of their own design decisions did anything.",
      architecture: "Qdrant serves dense (Voyage AI) and sparse (BM25) retrieval from a single index, fused via Reciprocal Rank Fusion rather than a weighted score blend, since RRF only needs rank position — not scores on comparable scales, which dense and sparse search don't produce. K-means finds well-separated topic clusters offline; DBSCAN catches the density-based outliers K-means would otherwise force into the wrong group. The fused candidate pool is re-ranked with MMR (λ=0.7) to cut redundancy, then Claude writes a cited, streamed answer served through FastAPI.",
      innovation: "An ablation harness isolates every stage — dense-only, BM25-only, hybrid, +routing, +MMR — against 290 queries, reporting every delta with a 95% confidence interval, so a 0.01 shift is noise until proven otherwise. That process rejected cluster routing, the stage I was most confident about going in: it cost up to 0.035 nDCG@10. A query-level diagnostic found the actual mechanism — routing only filters the dense branch, so BM25 still finds the correct chunk unfiltered, but a chunk found by only one branch earns half the fused RRF score of one found by both, letting wrong-topic chunks outrank it. The document wasn't lost — it was demoted. Routing ships off by default, fully implemented and still measured on every eval run.",
      stack: ["Qdrant", "Voyage AI", "FastAPI", "Claude", "K-means/DBSCAN", "MMR Re-ranking"],
    },
  },
  {
    id: "umbra",
    title: "UMBRA",
    tagline: "RAG coverage diagnostics — finds what a knowledge base can't answer, before users do",
    color: "#7040c0",
    status: "Public",
    repo: "https://github.com/omraut888/umbra",
    metrics: [
      { value: "85%", label: "3-Tier Accuracy · from 30%" },
      { value: "0.80", label: "Gap Recall · 5 Seeds" },
      { value: "255", label: "Tests · CI-Verified" },
      { value: "3,700", label: "Probes · Zero Data Loss" },
    ],
    detail: {
      problem: "RAG systems fail silently: ask about something outside the knowledge base, and retrieval returns the closest chunk anyway while the model writes a confident answer over nothing. Standard evaluation tools only grade answers to questions you already thought to ask — they can't find the gaps nobody tested for.",
      architecture: "Four independent probe-generation strategies — including one that never reads the knowledge base, specifically to catch topics with zero documents — generate questions scored on three signals: retrieval confidence, semantic entropy, and a cross-encoder hallucination check. UMAP projects to 10D for density-based clustering (HDBSCAN) and separately to 2D for the map; failures surface as named \"dark zones,\" ranked by severity, with document recommendations attached.",
      innovation: "Every detection threshold is calibrated against a gap-injection benchmark — known gaps in a synthetic knowledge base, not hand-picked numbers. That process surfaced two real problems during validation: the semantic-entropy formula I built from was backwards (scored unrelated chunks as \"focused\"), and three of four probe-generation strategies structurally can't detect a topic with zero documents at all, since they derive questions from the corpus itself — confirmed at 0 of 12 on the benchmark. Both are fixed and documented; the fourth strategy, which probes from domain knowledge instead of the corpus, is what actually closes the gap.",
      stack: ["Python", "UMAP + HDBSCAN", "Qdrant", "pgvector", "Plotly Dash", "Docker", "GitHub Actions"],
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
    metrics: [
      { value: "0.92", label: "F1 Score · from 0.44" },
      { value: "1.00", label: "Recall · Zero Missed" },
      { value: "294", label: "Tests · Unit + CI" },
      { value: "16", label: "Tickers · 150 Pairs Labeled" },
    ],
    detail: {
      problem: "Earnings calls are optimistic by design — executives speaking live, shaping a narrative. The same company's 10-K, filed under legal obligation, is written by a different team in deliberately hedged, cautious language. An analyst is supposed to check whether the two actually agree, but doing that by hand doesn't scale past a handful of companies. And the naive automated fix makes it worse: NLI models reliably fire at ~0.99 contradiction confidence on pairs that share financial vocabulary without any real logical conflict, so \"just flag disagreements\" mostly produces noise. Almost nobody builds the version that measures its own false-positive rate before trusting it.",
      architecture: "A four-node LangGraph pipeline. Candidate generation runs pgvector ANN search over MiniLM embeddings to find topically-aligned cross-modal pairs. Contradiction detection scores each pair with a cross-encoder NLI model (nli-deberta-v3-base) in both directions, combined into a Weighted Contradiction Score — NLI confidence × source reliability × claim confidence × exp(-λ·|days apart|), with λ=0.01 set empirically against real eval data, not the spec's default. A trend-analyst node forecasts deseasonalized YoY revenue growth with Chronos-T5 against any parsed guidance claim, and flags its own forecast as underdispersed when the model's confidence interval comes back narrower than the input series' actual historical volatility. Filing ingestion (SEC EDGAR/XBRL) and news ingestion (Yahoo Finance RSS, company-name relevance filtered) are both fully automatic — any real ticker, no hardcoded samples.",
      innovation: "The temporal decay term — meant to discount stale comparisons — was silently making 13 of 16 tested tickers mathematically incapable of ever producing a flagged pair, regardless of what NLI actually decided. A news article compared against a 10-K filed 7–13 months earlier gets its score multiplied toward zero by exp(-0.01×395) before the contradiction threshold is even checked. I'd been reading \"zero pairs\" as \"the model correctly found nothing.\" A frozen scoring snapshot across all 4,880 real candidate pairs showed NLI had fired above 90% confidence on 278 of them — the signal existed, decay just never let it surface. It wasn't that the system found no contradictions. It had been structurally prevented from finding one, for most companies, by arithmetic alone.",
      stack: ["Python", "FastAPI", "LangGraph", "PostgreSQL/pgvector", "Chronos-T5", "Claude", "scikit-learn"],
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
