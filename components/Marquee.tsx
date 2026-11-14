"use client";

/**
 * Continuous right-to-left ticker between the hero and the first section.
 * Pure CSS loop (see .marquee-track in globals.css): the track holds two
 * identical halves and slides by -50%, so the seam is invisible. Each half
 * repeats the term list enough times to be wider than the viewport.
 * Decorative texture, so it's hidden from screen readers.
 */
const TERMS = ["RAG Systems", "Multi-Agent Pipelines", "LangGraph", "Qdrant", "PyTorch", "Production ML"];
const REPEATS_PER_HALF = 3;

function Half() {
  return (
    <div className="marquee-half">
      {Array.from({ length: REPEATS_PER_HALF }).flatMap((_, r) =>
        TERMS.map((t) => (
          <span key={`${r}-${t}`} className="marquee-item">
            {t}
            <span className="marquee-sep">·</span>
          </span>
        ))
      )}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Half />
        <Half />
      </div>
    </div>
  );
}
