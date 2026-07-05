"use client";

import { useRef, useEffect } from "react";

const N = 3000;            // points on the sphere
const R = 1.7;             // sphere radius (world units)
const INTRO_MS = 2600;     // explode + reform duration
const SCATTER = 20;        // world-space scatter reach (~3x viewport)

// Neural Cosmos palette
const GOLD = [240, 192, 96];    // #f0c060 — warm star core
const VIOLET = [112, 64, 192];  // #7040c0 — nebula edge

interface Particle {
  // home = unit vector on the sphere surface (fibonacci distribution)
  hx: number; hy: number; hz: number;
  // scatter = random destination in 3D space (set once), + per-particle speed
  sx: number; sy: number; sz: number;
  speed: number;
  twinkle: number; // per-point phase for subtle shimmer
}

// easeOutCubic / easeInOutCubic
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Scroll fades the sphere out as the starfield takes over
    scrollRef.current = window.scrollY;
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Fibonacci sphere distribution
    const golden = Math.PI * (3 - Math.sqrt(5));
    const particles: Particle[] = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;      // 1 -> -1
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      return {
        hx: Math.cos(theta) * rad,
        hy: y,
        hz: Math.sin(theta) * rad,
        sx: (Math.random() * 2 - 1) * SCATTER,
        sy: (Math.random() * 2 - 1) * SCATTER,
        sz: (Math.random() * 2 - 1) * SCATTER,
        speed: 0.7 + Math.random() * 0.6,
        twinkle: (i % 97) / 97 * Math.PI * 2,
      };
    });

    const rot = { x: 0, y: 0, tx: 0, ty: 0 };
    const autoY = { v: 0 };

    const onMove = (e: MouseEvent) => {
      rot.tx = (e.clientY / window.innerHeight - 0.5) * -0.6;
      rot.ty = (e.clientX / window.innerWidth - 0.5) * 0.9;
    };
    window.addEventListener("mousemove", onMove);

    const start = performance.now();

    let rafId = 0;
    const animate = (now: number) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) { rafId = requestAnimationFrame(animate); return; }

      ctx.clearRect(0, 0, W, H);

      // Intro: explode outward from center, then reform into the sphere
      const t = Math.min(1, (now - start) / INTRO_MS);
      let radiusFactor: number;
      if (t < 0.42) {
        radiusFactor = easeOut(t / 0.42) * 1.75;       // 0 -> 1.75 (explode)
      } else {
        const e = easeInOut((t - 0.42) / 0.58);
        radiusFactor = 1.75 - 0.75 * e;                // 1.75 -> 1.0 (reform)
      }
      const introAlpha = Math.min(1, t / 0.15);

      // Fade the whole sphere out over the first 500px of scroll
      const progress = Math.min(scrollRef.current / 500, 1);
      const fade = 1 - progress;
      if (fade <= 0.001) { rafId = requestAnimationFrame(animate); return; }

      autoY.v += 0.0022;
      rot.x += (rot.tx - rot.x) * 0.045;
      rot.y += (rot.ty - rot.y) * 0.045;
      const rY = autoY.v + rot.y;
      const rX = rot.x;
      const cosY = Math.cos(rY), sinY = Math.sin(rY);
      const cosX = Math.cos(rX), sinX = Math.sin(rX);
      const FOV = Math.min(W, H) * 0.62;
      const time = now * 0.001;

      for (let i = 0; i < N; i++) {
        const p = particles[i];
        const rr = R * radiusFactor;

        // Home position on the sphere, lerped toward its scatter target
        const homeX = p.hx * rr, homeY = p.hy * rr, homeZ = p.hz * rr;
        const f = progress * p.speed;
        const px = homeX + (p.sx - homeX) * f;
        const py = homeY + (p.sy - homeY) * f;
        const pz = homeZ + (p.sz - homeZ) * f;

        // Rotate + project
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        if (z2 <= -4.8) continue; // behind the camera

        const scale = FOV / (z2 + 5.0);
        const sx = W / 2 + x1 * scale;
        const sy = H / 2 + y1 * scale;

        // depth 0 (far/edge) .. 1 (front/core) — colour + size/alpha
        const d = Math.max(0, Math.min(1, (z2 + R) / (2 * R)));
        const cr = Math.round(VIOLET[0] + (GOLD[0] - VIOLET[0]) * d);
        const cg = Math.round(VIOLET[1] + (GOLD[1] - VIOLET[1]) * d);
        const cb = Math.round(VIOLET[2] + (GOLD[2] - VIOLET[2]) * d);

        const tw = 0.75 + 0.25 * Math.sin(time * 1.6 + p.twinkle);
        const r = Math.max(0.5, (0.7 + d * 1.6) * (5.0 / (z2 + 5.0)));
        const a = (0.22 + d * 0.62) * tw * introAlpha * fade;

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a.toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.92, pointerEvents: "none" }}
    />
  );
}
