"use client";

import { motion } from "framer-motion";
import { LineDraw, ScrollScale } from "./Reveal";

type Cat = "llm" | "ml" | "backend" | "cloud" | "data" | "langs";

const CATEGORIES: { id: Cat; label: string }[] = [
  { id: "llm",     label: "LLMs & RAG", },
  { id: "ml",      label: "ML & Deep Learning", },
  { id: "backend", label: "Backend & Infra", },
  { id: "cloud",   label: "Cloud & DevOps", },
  { id: "data",    label: "Data & Analytics", },
  { id: "langs",   label: "Languages", },
];

const SKILLS: Record<Cat, string[]> = {
  llm: ["LangGraph", "RAG", "LangChain", "Qdrant", "ChromaDB", "Pinecone", "Voyage AI", "Weaviate"],
  ml: ["PyTorch", "scikit-learn", "NLP", "Transformers", "Neural Nets", "Fine-tuning", "TensorFlow"],
  backend: ["FastAPI", "REST APIs", "Docker", "PostgreSQL", "Airflow", "MongoDB", "Redis"],
  cloud: ["Git", "GCP", "Vercel", "AWS", "GH Actions", "CI/CD", "MCP"],
  data: ["Python", "Pandas", "SQL", "ETL", "Tableau", "Power BI", "Spark"],
  langs: ["HTML/CSS", "TypeScript", "Java", "Bash", "R"],
};

function SkillLine({
  name,
  category,
  delay,
}: {
  name: string;
  category: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
      className="group flex items-center gap-3 py-1.5 cursor-default"
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 group-hover:animate-[skillPulse_1s_ease-in-out_infinite]"
        style={{ background: "rgba(255,255,255,0.35)" }}
      />
      <span className="text-white/65 text-sm transition-colors duration-200 group-hover:text-white flex-shrink-0">
        {name}
      </span>
      <span className="flex-1 border-b border-dotted border-white/15 mx-1 translate-y-[3px]" />
      <span className="text-white/30 text-[11px] font-mono flex-shrink-0 whitespace-nowrap">
        {category}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  let n = 0; // running index for staggered slide-in

  return (
    <section
      id="skills"
      className="relative z-10 pt-16 pb-16 overflow-hidden"
      style={{ background: "rgba(22,20,18,0.95)" /* warm charcoal — one value step above Experience */ }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <ScrollScale className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-gold-metal">
            CAPABILITIES
          </p>
          <h2 className="section-heading text-white">Skills &amp; Technologies</h2>
          <LineDraw className="mx-auto mt-8" style={{ maxWidth: 120 }} color="rgba(184,144,62,0.55)" />
        </ScrollScale>

        {/* Two-column masonry index */}
        <div className="columns-1 md:columns-2 gap-x-16">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="break-inside-avoid mb-10">
              {/* Category header */}
              <div
                className="flex items-center gap-2.5 pb-2 mb-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] font-mono"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Skill lines */}
              {SKILLS[cat.id].map((name) => (
                <SkillLine
                  key={name}
                  name={name}
                  category={cat.label}
                  delay={n++ * 0.03}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
