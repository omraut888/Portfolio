"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { WordReveal } from "./Reveal";

const links = [
  {
    label: "Email",
    value: "raut.om@northeastern.edu",
    href: "mailto:raut.om@northeastern.edu",
    color: "#00e5ff",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="22,6 12,13 2,6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    copyable: true,
  },
  {
    label: "Phone",
    value: "(617) 794-3580",
    href: "tel:+16177943580",
    color: "#2563eb",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    copyable: false,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/omraut88",
    href: "https://www.linkedin.com/in/omraut88/",
    color: "#7040c0",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="4"
          cy="4"
          r="2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    copyable: false,
  },
  {
    label: "GitHub",
    value: "github.com/omraut888",
    href: "https://github.com/omraut888",
    color: "#00e5ff",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    copyable: false,
  },
];

function OrbBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Blue / violet only
    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: canvas.width * (0.2 + i * 0.15),
      y: canvas.height * (0.3 + Math.sin(i) * 0.3),
      r: 80 + i * 30,
      color: i % 2 === 0 ? "rgba(37,99,235," : "rgba(112,64,192,",
      speed: 0.003 + i * 0.001,
      offset: i * 1.2,
    }));

    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((orb) => {
        const x = orb.x + Math.sin(t * orb.speed + orb.offset) * 40;
        const y = orb.y + Math.cos(t * orb.speed * 0.7 + orb.offset) * 30;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, orb.r);
        grad.addColorStop(0, `${orb.color}0.12)`);
        grad.addColorStop(1, `${orb.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
      t += 1;
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
}

const TERMINAL_LINES = [
  { cmd: "status",   out: "Open to full-time AI/ML roles"          },
  { cmd: "visa",     out: "F-1 OPT → H-1B sponsorship required"    },
  { cmd: "location", out: "Boston, MA — open to remote/hybrid"     },
  { cmd: "start",    out: "December 2026"                          },
  { cmd: "response", out: "Within 24 hours"                        },
];

function ContactTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4, margin: "-50px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const tick = () => {
      setVisibleLines((v) => v + 1);
      i++;
      if (i < TERMINAL_LINES.length) setTimeout(tick, 550);
    };
    const t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden w-full h-full"
      style={{
        background: "rgba(5,5,10,0.95)",
        border: "1px solid rgba(37,99,235,0.2)",
        fontFamily: "var(--font-mono)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* macOS traffic lights */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
        <span className="ml-2 text-white/30 text-[10px]">contact.sh</span>
      </div>

      <div className="p-4 space-y-2.5 text-[13px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <span style={{ color: "#2563eb" }}>$ </span>
              <span style={{ color: "#00e5ff" }}>{line.cmd}</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", paddingLeft: "1em", marginTop: 2 }}>
              → {line.out}
            </div>
          </motion.div>
        ))}
        {visibleLines < TERMINAL_LINES.length && (
          <div>
            <span style={{ color: "#2563eb" }}>$ </span>
            <span
              className="inline-block w-1.5 h-3.5 align-middle animate-[cursorBlink_1s_step-end_infinite]"
              style={{ background: "#00e5ff" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ContactLink({ link }: { link: (typeof links)[0] }) {
  const [copied, setCopied] = useState(false);
  const magnetic = useMagneticHover<HTMLAnchorElement>({ strength: 0.35 });

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      if (!link.copyable) return;
      e.preventDefault();
      await navigator.clipboard.writeText(link.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [link]
  );

  return (
    <motion.a
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      onClick={link.copyable ? handleCopy : undefined}
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex items-center gap-4 p-4 rounded-2xl group transition-all duration-300 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      whileHover={{
        scale: 1.02,
        borderColor: `${link.color}40`,
        backgroundColor: `${link.color}08` as never,
        boxShadow: `0 10px 30px ${link.color}15`,
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
        style={{
          background: `${link.color}15`,
          color: link.color,
          border: `1px solid ${link.color}25`,
        }}
      >
        {link.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-white/40 text-xs mb-0.5">{link.label}</div>
        <div className="text-white font-medium text-sm truncate">{link.value}</div>
      </div>

      {/* Copy indicator */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${link.color}20`,
              color: link.color,
              border: `1px solid ${link.color}30`,
            }}
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrow / copy glyph */}
      {!link.copyable ? (
        <svg
          className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M7 17L17 7M17 7H7M17 7v10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </motion.a>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative z-10 py-24 overflow-hidden flex items-center"
      style={{ background: "rgba(5,5,8,0.82)" }}
    >
      <OrbBackground />

      {/* Blue/violet vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        {/* Section eyebrow */}
        <motion.p
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-base font-semibold tracking-widest uppercase mb-10 text-center"
          style={{ color: "#00e5ff" }}
        >
          Get In Touch
        </motion.p>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-stretch">
          {/* LEFT (60%) */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Heading with green pulsing dot */}
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 4vw, 52px)",
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                <WordReveal text="Open to Work" />
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-white/50 text-base md:text-lg mb-8">
              AI/ML Engineer · MS @ Northeastern · Boston, MA
            </p>

            {/* 2x2 contact cards */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ContactLink link={link} />
                </motion.div>
              ))}
            </div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.35 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.3)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/75 text-xs font-mono tracking-wide">
                Available Dec 2026 · F-1 OPT
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT (40%) — terminal */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="min-h-[300px]"
          >
            <ContactTerminal />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-white/25 text-sm font-mono">
            Designed &amp; Built by{" "}
            <span className="text-[#00e5ff]/70">Om Raut</span> · 2026
          </p>
          <p className="text-white/15 text-xs mt-2">
            Built with Next.js · Framer Motion · Three.js
          </p>
        </motion.div>
      </div>
    </section>
  );
}
