"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseX: number;
  baseY: number;
  connections: number[];
}

const MAX_DIST = 160;
const PARTICLE_COUNT = 80;
const MOUSE_REPEL_RADIUS = 120;
const MOUSE_ATTRACT_STRENGTH = 0.015;

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Initialize particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        connections: [],
      };
    });

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Update particles
      particles.forEach((p) => {
        // Gentle drift
        p.x += p.vx;
        p.y += p.vy;

        // Mouse attraction (subtle pull toward cursor)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
          // Repel when very close, attract when further
          const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
          p.vx += (dx / dist) * force * MOUSE_ATTRACT_STRENGTH;
          p.vy += (dy / dist) * force * MOUSE_ATTRACT_STRENGTH;
        }

        // Gentle friction
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Slow drift back to base position
        p.vx += (p.baseX - p.x) * 0.0005;
        p.vy += (p.baseY - p.y) * 0.0005;

        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
          p.vx = (p.vx / speed) * 1.5;
          p.vy = (p.vy / speed) * 1.5;
        }

        // Wrap around edges
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;

            // Check if near mouse for highlight
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const mouseDist = Math.sqrt(
              (mouse.x - midX) ** 2 + (mouse.y - midY) ** 2
            );
            const isNearMouse = mouseDist < 150;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (isNearMouse) {
              ctx.strokeStyle = `rgba(59,130,246,${alpha * 2.5})`;
              ctx.lineWidth = 0.8;
            } else {
              ctx.strokeStyle = `rgba(99,120,180,${alpha})`;
              ctx.lineWidth = 0.5;
            }
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = dist < 100;

        ctx.beginPath();
        ctx.arc(p.x, p.y, isNearMouse ? p.radius * 1.8 : p.radius, 0, Math.PI * 2);

        if (isNearMouse) {
          ctx.fillStyle = "rgba(59,130,246,0.9)";
          // Glow
          ctx.shadowColor = "#00e5ff";
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = "rgba(139,160,220,0.6)";
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
}
