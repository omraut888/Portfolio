"use client";

import { useRef, useEffect } from "react";

const N = 2000;

// Faint palette — mostly white with occasional cyan / gold specks
const WHITE = [255, 255, 255];
const CYAN = [0, 229, 255];
const GOLD = [240, 192, 96];

interface Star {
  // target position as viewport fraction (drifts slowly, wraps at edges)
  tx: number; ty: number;
  vx: number; vy: number;   // drift velocity (fraction / frame)
  r: number;                // radius px (0.3 .. 1.2)
  baseA: number;            // base opacity (0.08 .. 0.35)
  speed: number;            // per-particle explosion speed multiplier
  cr: number; cg: number; cb: number;
}

export default function StarfieldBackground() {
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

    // Scroll drives the explosion — ref only, no React re-renders
    scrollRef.current = window.scrollY;
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const stars: Star[] = Array.from({ length: N }, () => {
      const roll = Math.random();
      const [cr, cg, cb] = roll < 0.15 ? CYAN : roll < 0.3 ? GOLD : WHITE;
      return {
        tx: Math.random(),
        ty: Math.random(),
        vx: (Math.random() - 0.5) * 0.00025,
        vy: (Math.random() - 0.5) * 0.00025,
        r: 0.3 + Math.random() * 0.9,          // 0.3 .. 1.2
        baseA: 0.08 + Math.random() * 0.27,    // 0.08 .. 0.35
        speed: 0.7 + Math.random() * 0.6,      // 0.7 .. 1.3
        cr, cg, cb,
      };
    });

    const wrap01 = (v: number) => ((v % 1) + 1) % 1;

    let rafId = 0;
    const animate = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) { rafId = requestAnimationFrame(animate); return; }

      ctx.clearRect(0, 0, W, H);

      const progress = Math.min(scrollRef.current / 500, 1);

      for (let i = 0; i < N; i++) {
        const s = stars[i];

        // Slow drift of the target (wraps around the viewport)
        s.tx = wrap01(s.tx + s.vx);
        s.ty = wrap01(s.ty + s.vy);

        // Explode from center (0.5, 0.5) out to the drifting target
        const f = progress * s.speed;
        const cx = wrap01(0.5 + (s.tx - 0.5) * f);
        const cy = wrap01(0.5 + (s.ty - 0.5) * f);

        const a = s.baseA * progress;
        if (a < 0.004) continue;

        ctx.beginPath();
        ctx.arc(cx * W, cy * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.cr},${s.cg},${s.cb},${a.toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
