"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, useSpring } from "framer-motion";

/**
 * Magnetic pull toward the cursor, driven by springs (stiffness 150, damping
 * 15) so it overshoots slightly and settles elastically.
 *
 * The pull starts once the cursor comes within `radius` px of the element's
 * edge, grows as it gets closer, and is capped at `max` px. Leaving the zone
 * springs the element back to centre. Disabled for prefers-reduced-motion.
 *
 * Usage: const m = useMagnetic<HTMLButtonElement>();
 *        <motion.button ref={m.ref} style={{ x: m.x, y: m.y }} />
 */
export function useMagnetic<T extends HTMLElement>({ max = 8, radius = 80 } = {}) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const spring = { stiffness: 150, damping: 15 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    if (reduce) {
      x.set(0);
      y.set(0);
      return;
    }
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      // Distance from the element's edge (0 while the cursor is over it)
      const edge = Math.hypot(Math.max(0, Math.abs(dx) - r.width / 2), Math.max(0, Math.abs(dy) - r.height / 2));
      if (edge > radius) {
        x.set(0);
        y.set(0);
        return;
      }
      const pull = 1 - edge / radius;
      x.set(clamp(dx / (r.width / 2)) * max * pull);
      y.set(clamp(dy / (r.height / 2)) * max * pull);
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", reset);
    };
  }, [reduce, max, radius, x, y]);

  return { ref, x, y };
}
