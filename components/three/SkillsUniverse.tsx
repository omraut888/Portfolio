"use client";

import { useRef, useEffect } from "react";

const CAT_RGB: Record<string, [number, number, number]> = {
  llm:     [0,   229, 255],  // cyan
  ml:      [112, 64,  192],  // violet
  backend: [240, 192, 96],   // gold
  cloud:   [200, 208, 224],  // chrome
  data:    [0,   200, 160],  // teal
  langs:   [192, 96,  160],  // magenta
};

const CAT_LABELS: Record<string, string> = {
  llm: "LLMs & RAG", ml: "ML & Deep Learning",
  backend: "Backend & Infra", cloud: "Cloud & DevOps",
  data: "Data & Analytics", langs: "Languages",
};

// hx/hy: home position as fraction of canvas W/H
const SKILLS_DATA = [
  { name: "LangGraph",   cat: "llm",     r: 38, hx: 0.20, hy: 0.32 },
  { name: "RAG",         cat: "llm",     r: 35, hx: 0.16, hy: 0.55 },
  { name: "Qdrant",      cat: "llm",     r: 30, hx: 0.27, hy: 0.70 },
  { name: "LangChain",   cat: "llm",     r: 27, hx: 0.11, hy: 0.42 },
  { name: "ChromaDB",    cat: "llm",     r: 25, hx: 0.32, hy: 0.50 },
  { name: "Pinecone",    cat: "llm",     r: 23, hx: 0.10, hy: 0.65 },
  { name: "Voyage AI",   cat: "llm",     r: 22, hx: 0.22, hy: 0.82 },
  { name: "Weaviate",    cat: "llm",     r: 21, hx: 0.36, hy: 0.76 },

  { name: "PyTorch",     cat: "ml",      r: 38, hx: 0.78, hy: 0.28 },
  { name: "NLP",         cat: "ml",      r: 34, hx: 0.70, hy: 0.44 },
  { name: "Transformers",cat: "ml",      r: 28, hx: 0.85, hy: 0.40 },
  { name: "scikit-learn",cat: "ml",      r: 26, hx: 0.65, hy: 0.32 },
  { name: "Fine-tuning", cat: "ml",      r: 24, hx: 0.90, hy: 0.22 },
  { name: "TensorFlow",  cat: "ml",      r: 23, hx: 0.80, hy: 0.55 },
  { name: "Neural Nets", cat: "ml",      r: 21, hx: 0.90, hy: 0.52 },

  { name: "FastAPI",     cat: "backend", r: 38, hx: 0.28, hy: 0.18 },
  { name: "Docker",      cat: "backend", r: 35, hx: 0.42, hy: 0.12 },
  { name: "PostgreSQL",  cat: "backend", r: 26, hx: 0.17, hy: 0.12 },
  { name: "Airflow",     cat: "backend", r: 25, hx: 0.36, hy: 0.28 },
  { name: "MongoDB",     cat: "backend", r: 23, hx: 0.11, hy: 0.26 },
  { name: "Redis",       cat: "backend", r: 21, hx: 0.08, hy: 0.15 },
  { name: "REST APIs",   cat: "backend", r: 22, hx: 0.50, hy: 0.22 },

  { name: "GCP",         cat: "cloud",   r: 35, hx: 0.80, hy: 0.78 },
  { name: "AWS",         cat: "cloud",   r: 35, hx: 0.90, hy: 0.68 },
  { name: "CI/CD",       cat: "cloud",   r: 24, hx: 0.72, hy: 0.88 },
  { name: "GH Actions",  cat: "cloud",   r: 26, hx: 0.86, hy: 0.84 },
  { name: "Git",         cat: "cloud",   r: 21, hx: 0.68, hy: 0.72 },
  { name: "Vercel",      cat: "cloud",   r: 22, hx: 0.62, hy: 0.80 },
  { name: "MCP",         cat: "cloud",   r: 22, hx: 0.92, hy: 0.78 },

  { name: "Python",      cat: "data",    r: 42, hx: 0.50, hy: 0.48 },
  { name: "SQL",         cat: "data",    r: 33, hx: 0.58, hy: 0.62 },
  { name: "Pandas",      cat: "data",    r: 28, hx: 0.43, hy: 0.60 },
  { name: "Spark",       cat: "data",    r: 24, hx: 0.56, hy: 0.76 },
  { name: "Tableau",     cat: "data",    r: 22, hx: 0.44, hy: 0.76 },
  { name: "Power BI",    cat: "data",    r: 22, hx: 0.62, hy: 0.52 },
  { name: "ETL",         cat: "data",    r: 24, hx: 0.50, hy: 0.35 },

  { name: "TypeScript",  cat: "langs",   r: 30, hx: 0.55, hy: 0.16 },
  { name: "Java",        cat: "langs",   r: 24, hx: 0.68, hy: 0.10 },
  { name: "HTML/CSS",    cat: "langs",   r: 22, hx: 0.78, hy: 0.12 },
  { name: "Bash",        cat: "langs",   r: 20, hx: 0.62, hy: 0.08 },
  { name: "R",           cat: "langs",   r: 19, hx: 0.47, hy: 0.08 },
];

// Precompute same-category pairs for edge drawing
const PAIRS: [number, number][] = [];
for (let i = 0; i < SKILLS_DATA.length; i++) {
  for (let j = i + 1; j < SKILLS_DATA.length; j++) {
    if (SKILLS_DATA[i].cat === SKILLS_DATA[j].cat) PAIRS.push([i, j]);
  }
}

function sr(seed: number) { const x = Math.sin(seed + 1) * 9999; return x - Math.floor(x); }

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  scale: number; targetScale: number;
  alpha: number; targetAlpha: number;
  driftPhase: number;
  driftSpeed: number;
  driftAmpX: number;
  driftAmpY: number;
  birthDelay: number;
  alive: boolean;
}

export default function SkillsUniverse({ activeCategory }: { activeCategory: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeCatRef = useRef(activeCategory);
  activeCatRef.current = activeCategory;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: Node[] = SKILLS_DATA.map((_, i) => ({
      x: 0, y: 0, vx: 0, vy: 0,
      scale: 0, targetScale: 1,
      alpha: 0, targetAlpha: 1,
      driftPhase:  sr(i * 3.71) * Math.PI * 2,
      driftSpeed:  0.003 + sr(i * 1.93) * 0.004,
      driftAmpX:   10    + sr(i * 2.31) * 20,
      driftAmpY:   8     + sr(i * 4.07) * 14,
      birthDelay:  Math.floor(i * 2.6),
      alive: false,
    }));

    const mouse = { x: -9999, y: -9999 };
    let hoveredIdx = -1;
    let frame = 0;
    let initFrame = -1;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let rafId = 0;

    const animate = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      if (!W || !H) { rafId = requestAnimationFrame(animate); return; }
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Big bang: fire all nodes from center on first valid frame
      if (initFrame < 0) {
        initFrame = frame;
        for (let i = 0; i < SKILLS_DATA.length; i++) {
          const s = SKILLS_DATA[i];
          const ang = Math.atan2(s.hy * H - H / 2, s.hx * W - W / 2);
          const burst = 20 + sr(i * 5.13) * 18;
          nodes[i].x  = W / 2;
          nodes[i].y  = H / 2;
          nodes[i].vx = Math.cos(ang) * burst;
          nodes[i].vy = Math.sin(ang) * burst;
        }
      }

      const activeCat = activeCatRef.current;
      const rel = frame - initFrame;
      const t   = rel * 0.016;

      // Hover detection
      hoveredIdx = -1;
      for (let i = 0; i < SKILLS_DATA.length; i++) {
        const n = nodes[i];
        if (!n.alive) continue;
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dr = SKILLS_DATA[i].r;
        if (dx * dx + dy * dy < (dr + 12) * (dr + 12)) { hoveredIdx = i; break; }
      }

      // Update nodes
      for (let i = 0; i < SKILLS_DATA.length; i++) {
        const n = nodes[i];
        const s = SKILLS_DATA[i];
        if (rel < n.birthDelay) continue;
        if (!n.alive) n.alive = true;

        const earlyRel = rel - n.birthDelay;

        // Drifting home position
        let hx = s.hx * W + Math.sin(t * n.driftSpeed + n.driftPhase) * n.driftAmpX;
        let hy = s.hy * H + Math.cos(t * n.driftSpeed * 0.73 + n.driftPhase * 1.27) * n.driftAmpY;

        // Pull matching category toward center when filter active
        if (activeCat !== null && s.cat === activeCat) {
          hx = hx * 0.5 + W * 0.5 * 0.5;
          hy = hy * 0.5 + H * 0.5 * 0.5;
        }

        // Spring toward home (stronger during big bang settling)
        const k = earlyRel < 45 ? 0.09 : 0.024;
        n.vx += (hx - n.x) * k;
        n.vy += (hy - n.y) * k;

        // Mouse magnetic attraction (120px radius)
        const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 14400 && md2 > 1) {
          const f = (1 - Math.sqrt(md2) / 120) * 0.03;
          n.vx += mdx * f;
          n.vy += mdy * f;
        }

        n.vx *= 0.87; n.vy *= 0.87;
        n.x  += n.vx;  n.y  += n.vy;

        // Target alpha / scale
        const isHov = i === hoveredIdx;
        const active = activeCat === null || s.cat === activeCat;
        n.targetAlpha = active ? 1.0 : 0.15;
        n.targetScale = earlyRel < 8 ? 0 : (active ? (isHov ? 1.4 : 1.0) : 0.75);

        n.scale += (n.targetScale - n.scale) * 0.10;
        n.alpha += (n.targetAlpha - n.alpha) * 0.08;
      }

      // ---- Draw edges ----
      for (const [i, j] of PAIRS) {
        const ni = nodes[i], nj = nodes[j];
        if (!ni.alive || !nj.alive) continue;
        const pairAlpha = Math.min(ni.alpha, nj.alpha);
        if (pairAlpha < 0.05) continue;
        const dx = ni.x - nj.x, dy = ni.y - nj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 280) continue;
        const isHov = i === hoveredIdx || j === hoveredIdx;
        const [r, g, b] = CAT_RGB[SKILLS_DATA[i].cat];
        const a = isHov
          ? pairAlpha * 0.65
          : pairAlpha * (1 - dist / 280) * 0.10;
        if (a < 0.005) continue;
        ctx.beginPath();
        ctx.moveTo(ni.x, ni.y);
        ctx.lineTo(nj.x, nj.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
        ctx.lineWidth = isHov ? 1.2 : 0.6;
        ctx.stroke();
      }

      // ---- Draw nodes ----
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < SKILLS_DATA.length; i++) {
        const n = nodes[i];
        if (!n.alive || n.alpha < 0.01 || n.scale < 0.01) continue;
        const s    = SKILLS_DATA[i];
        const [r, g, b] = CAT_RGB[s.cat];
        const dr   = s.r * n.scale;
        const isHov = i === hoveredIdx;

        ctx.globalAlpha = n.alpha;
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.shadowBlur  = isHov ? 24 : 10;

        // Fill
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, dr);
        grd.addColorStop(0, `rgba(${r},${g},${b},${isHov ? 0.32 : 0.18})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0.06)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, dr, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Border
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, dr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${isHov ? 0.95 : 0.55})`;
        ctx.lineWidth   = isHov ? 1.6 : 0.9;
        ctx.stroke();

        // Text — font size derived from base radius (not scaled) so text stays readable
        const fp = Math.min(12, Math.max(8, Math.floor((s.r * 1.5) / (s.name.length * 0.62))));
        ctx.font      = `500 ${fp}px sans-serif`;
        ctx.fillStyle = `rgba(${r},${g},${b},${isHov ? 1.0 : 0.88})`;
        ctx.fillText(s.name, n.x, n.y);

        // Tooltip below on hover
        if (isHov) {
          ctx.font      = `400 9px monospace`;
          ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
          ctx.fillText(CAT_LABELS[s.cat], n.x, n.y + dr + 14);
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur  = 0;
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ cursor: "crosshair" }}
    />
  );
}
