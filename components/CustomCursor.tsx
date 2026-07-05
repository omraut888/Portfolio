"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    const onEnterLink = () => setIsHovering(true);
    const onLeaveLink = () => setIsHovering(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    const addHoverListeners = () => {
      document
        .querySelectorAll("a, button, [data-cursor-hover]")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnterLink);
          el.addEventListener("mouseleave", onLeaveLink);
        });
    };

    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Dot snaps instantly
      dot.style.left = `${posRef.current.x}px`;
      dot.style.top = `${posRef.current.y}px`;

      // Ring lags behind with lerp
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;
      ring.style.left = `${ringPosRef.current.x}px`;
      ring.style.top = `${ringPosRef.current.y}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed z-[9999] pointer-events-none"
        style={{
          width: isHovering ? 8 : 6,
          height: isHovering ? 8 : 6,
          borderRadius: "50%",
          backgroundColor: "#00e5ff",
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s, height 0.2s",
          boxShadow: "0 0 8px rgba(0,229,255,0.85), 0 0 16px rgba(0,229,255,0.5)",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed z-[9998] pointer-events-none"
        style={{
          width: isClicking ? 28 : isHovering ? 40 : 32,
          height: isClicking ? 28 : isHovering ? 40 : 32,
          borderRadius: "50%",
          border: `1.5px solid ${isHovering ? "rgba(240,192,96,0.85)" : "rgba(0,229,255,0.45)"}`,
          transform: "translate(-50%, -50%)",
          transition:
            "width 0.3s cubic-bezier(0.23,1,0.32,1), height 0.3s cubic-bezier(0.23,1,0.32,1), border-color 0.3s",
          backdropFilter: isHovering ? "blur(2px)" : "none",
        }}
      />
    </>
  );
}
