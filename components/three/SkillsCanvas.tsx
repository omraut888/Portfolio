"use client";

import { useRef, useEffect } from "react";

const CAT_COLORS: Record<string, [number, number, number]> = {
  llm:     [59,  130, 246],
  ml:      [139,  92, 246],
  backend: [16,  185, 129],
  cloud:   [245, 158,  11],
  data:    [236,  72, 153],
  langs:   [6,   182, 212],
};

const CLUSTER: Record<string, [number, number, number]> = {
  llm:     [ 0.0,  0.0,  0.0],
  ml:      [ 2.5,  0.9, -0.4],
  backend: [-2.3,  0.6,  0.6],
  cloud:   [ 1.6, -1.8,  1.1],
  data:    [-1.5, -1.3, -1.4],
  langs:   [ 0.2,  2.1, -1.4],
};

const SKILLS = [
  { name: "LangGraph",    cat: "llm",     r: 0.22 },
  { name: "Qdrant",       cat: "llm",     r: 0.20 },
  { name: "RAG",          cat: "llm",     r: 0.24 },
  { name: "LangChain",    cat: "llm",     r: 0.18 },
  { name: "Voyage AI",    cat: "llm",     r: 0.17 },
  { name: "ChromaDB",     cat: "llm",     r: 0.17 },
  { name: "PyTorch",      cat: "ml",      r: 0.22 },
  { name: "Transformers", cat: "ml",      r: 0.19 },
  { name: "scikit-learn", cat: "ml",      r: 0.20 },
  { name: "Fine-tuning",  cat: "ml",      r: 0.18 },
  { name: "NLP",          cat: "ml",      r: 0.20 },
  { name: "FastAPI",      cat: "backend", r: 0.22 },
  { name: "Docker",       cat: "backend", r: 0.21 },
  { name: "PostgreSQL",   cat: "backend", r: 0.19 },
  { name: "Airflow",      cat: "backend", r: 0.18 },
  { name: "MongoDB",      cat: "backend", r: 0.17 },
  { name: "GCP",          cat: "cloud",   r: 0.20 },
  { name: "AWS",          cat: "cloud",   r: 0.19 },
  { name: "CI/CD",        cat: "cloud",   r: 0.17 },
  { name: "GitHub Actions",cat:"cloud",   r: 0.16 },
  { name: "Python",       cat: "data",    r: 0.24 },
  { name: "Pandas",       cat: "data",    r: 0.20 },
  { name: "SQL",          cat: "data",    r: 0.19 },
  { name: "Spark",        cat: "data",    r: 0.16 },
  { name: "Tableau",      cat: "data",    r: 0.15 },
  { name: "TypeScript",   cat: "langs",   r: 0.19 },
  { name: "Java",         cat: "langs",   r: 0.17 },
  { name: "Bash",         cat: "langs",   r: 0.15 },
];

function seeded(seed: number) { const x = Math.sin(seed) * 9999; return x - Math.floor(x); }

const POSITIONS: [number, number, number][] = SKILLS.map((s, i) => {
  const [cx, cy, cz] = CLUSTER[s.cat];
  const ang = seeded(i * 3.7) * Math.PI * 2;
  const phi = seeded(i * 7.1) * Math.PI;
  const rad = 0.7 + seeded(i * 1.3) * 1.1;
  return [
    cx + rad * Math.sin(phi) * Math.cos(ang),
    cy + rad * Math.sin(phi) * Math.sin(ang),
    cz + rad * Math.cos(phi),
  ];
});

// Precompute intra-category edges
const EDGES: [number, number][] = [];
for (let i = 0; i < SKILLS.length; i++) {
  for (let j = i + 1; j < SKILLS.length; j++) {
    if (SKILLS[i].cat !== SKILLS[j].cat) continue;
    const dx = POSITIONS[i][0]-POSITIONS[j][0];
    const dy = POSITIONS[i][1]-POSITIONS[j][1];
    const dz = POSITIONS[i][2]-POSITIONS[j][2];
    if (dx*dx+dy*dy+dz*dz < 4) EDGES.push([i, j]);
  }
}

export default function SkillsCanvas({ activeCategory }: { activeCategory: string | null }) {
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

    const rot  = { x: 0, y: 0, tx: 0, ty: 0, dragging: false, lastX: 0, lastY: 0 };
    const autoY = { v: 0 };
    let hoveredIdx = -1;
    const proj2d = new Float32Array(SKILLS.length * 3);

    const onMove = (e: MouseEvent) => {
      if (rot.dragging) {
        rot.ty += (e.clientX - rot.lastX) * 0.008;
        rot.tx += (e.clientY - rot.lastY) * 0.008;
        rot.lastX = e.clientX; rot.lastY = e.clientY;
      }
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let closest = -1, closestDist = Infinity;
      for (let i = 0; i < SKILLS.length; i++) {
        const dx = proj2d[i*3] - mx;
        const dy = proj2d[i*3+1] - my;
        const d  = dx*dx + dy*dy;
        if (d < closestDist) { closestDist = d; closest = i; }
      }
      const px = proj2d[closest*3], py = proj2d[closest*3+1];
      const rdx = px - mx, rdy = py - my;
      const screenR = proj2d[closest*3+2];
      hoveredIdx = (rdx*rdx + rdy*rdy < (screenR + 16) * (screenR + 16)) ? closest : -1;
    };
    const onDown = (e: MouseEvent) => { rot.dragging = true; rot.lastX = e.clientX; rot.lastY = e.clientY; };
    const onUp   = () => { rot.dragging = false; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let rafId = 0;
    const animate = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      if (!W || !H) { rafId = requestAnimationFrame(animate); return; }
      ctx.clearRect(0, 0, W, H);

      if (!rot.dragging) autoY.v += 0.004;
      rot.x += (rot.tx - rot.x) * 0.08;
      rot.y += (rot.ty - rot.y) * 0.08;
      const rY  = autoY.v + rot.y;
      const rX  = rot.x;
      const cosY = Math.cos(rY), sinY = Math.sin(rY);
      const cosX = Math.cos(rX), sinX = Math.sin(rX);
      const FOV  = Math.min(W, H) * 0.32;
      const cx   = W / 2, cy = H / 2;

      const activeCat = activeCatRef.current;

      // Project all skill positions
      for (let i = 0; i < SKILLS.length; i++) {
        const [px, py, pz] = POSITIONS[i];
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;
        const scale = FOV / (z2 + 5);
        proj2d[i*3]   = cx + x1 * scale;
        proj2d[i*3+1] = cy + y1 * scale;
        proj2d[i*3+2] = SKILLS[i].r * scale; // screen radius
      }

      // Draw edges
      ctx.lineWidth = 0.7;
      for (const [i, j] of EDGES) {
        const dimmed = activeCat && SKILLS[i].cat !== activeCat;
        const [r, g, b] = CAT_COLORS[SKILLS[i].cat];
        ctx.beginPath();
        ctx.moveTo(proj2d[i*3], proj2d[i*3+1]);
        ctx.lineTo(proj2d[j*3], proj2d[j*3+1]);
        ctx.strokeStyle = `rgba(${r},${g},${b},${dimmed ? 0.04 : 0.12})`;
        ctx.stroke();
      }

      // Draw nodes
      for (let i = 0; i < SKILLS.length; i++) {
        const s    = SKILLS[i];
        const [r, g, b] = CAT_COLORS[s.cat];
        const dimmed = activeCat !== null && s.cat !== activeCat;
        const hov  = i === hoveredIdx;
        const sr   = proj2d[i*3+2] * (hov ? 1.7 : 1.0);
        const sx   = proj2d[i*3], sy = proj2d[i*3+1];
        const alpha = dimmed ? 0.18 : (hov ? 1.0 : 0.85);

        // Glow
        if (hov || !dimmed) {
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 2.5);
          grd.addColorStop(0, `rgba(${r},${g},${b},${(dimmed ? 0.05 : 0.2).toFixed(2)})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, sr * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Node
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
        ctx.fill();

        // Label on hover
        if (hov) {
          ctx.font = `11px var(--font-mono, monospace)`;
          const label = s.name;
          const tw = ctx.measureText(label).width;
          const lx = sx - tw / 2;
          const ly = sy - sr - 8;
          ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
          ctx.fillText(label, lx, ly);
        }
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ cursor: "none" }}
    />
  );
}
