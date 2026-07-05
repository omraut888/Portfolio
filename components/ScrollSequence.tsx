'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FRAME_COUNT = 60;

const PHASES = [
  { start: 0, end: 20, heading: 'Building at scale.', sub: '10B+ vectors · Production RAG · Real traffic.' },
  { start: 20, end: 40, heading: 'Multi-agent systems.', sub: 'LangGraph orchestration · Human-in-the-loop · Zero downtime.' },
  { start: 40, end: 60, heading: 'From data to intelligence.', sub: 'Northeastern → Boston → The world.' },
];

const pad = (n: number) => String(n).padStart(4, '0');
const framePath = (i: number) => `/frames/frame_${pad(i + 1)}.jpg`;

export default function ScrollSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollYRef = useRef(0);
  const frameIdxRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Preload all frames
  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      const onDone = () => {
        if (cancelled) return;
        done += 1;
        setLoadedCount(done);
        if (done === FRAME_COUNT) setReady(true);
      };
      img.onload = onDone;
      img.onerror = onDone;
      imgs[i] = img;
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas sizing (device-pixel aware)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Scroll listener + rAF render loop
  useEffect(() => {
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const draw = () => {
      const canvas = canvasRef.current;
      const section = sectionRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !section || !ctx) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const rect = section.getBoundingClientRect();
      const progress = -rect.top / (rect.height - window.innerHeight);
      const clamped = Math.max(0, Math.min(1, progress));
      const frameIdx = Math.round(clamped * (FRAME_COUNT - 1));
      frameIdxRef.current = frameIdx;

      const cW = window.innerWidth;
      const cH = window.innerHeight;
      const img = imagesRef.current[frameIdx];

      ctx.clearRect(0, 0, cW, cH);

      if (img && img.naturalWidth > 0) {
        const scale = Math.max(cW / img.naturalWidth, cH / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        const dx = (cW - dw) / 2;
        const dy = (cH - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);

        // Vignette
        const vg = ctx.createRadialGradient(cW / 2, cH / 2, cH * 0.3, cW / 2, cH / 2, cH * 0.85);
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(1, 'rgba(3,3,8,0.7)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, cW, cH);
      }

      // Determine current phase from frame index
      const frameNum = frameIdx + 1;
      let pIdx = PHASES.findIndex((p) => frameNum > p.start && frameNum <= p.end);
      if (pIdx === -1) pIdx = frameNum <= PHASES[0].start ? 0 : PHASES.length - 1;
      setPhaseIndex((prev) => (prev === pIdx ? prev : pIdx));

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const phase = PHASES[phaseIndex];

  return (
    <div ref={sectionRef} style={{ position: 'relative', height: '600vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100vw', height: '100vh', display: 'block' }}
        />

        {/* Text overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
            padding: '0 24px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: '#00e5ff',
                  marginBottom: 24,
                }}
              />
              <h2
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  color: '#fff',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {phase.heading}
              </h2>
              <p
                style={{
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: 12,
                }}
              >
                {phase.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading overlay */}
        {!ready && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#030308',
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              LOADING SEQUENCE
            </span>
            <div
              style={{
                width: 200,
                height: 2,
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(loadedCount / FRAME_COUNT) * 100}%`,
                  height: '100%',
                  background: '#00e5ff',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {loadedCount} / {FRAME_COUNT}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
