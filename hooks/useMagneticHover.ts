"use client";

import { useRef, useCallback, RefObject } from "react";

interface MagneticConfig {
  strength?: number;
  ease?: number;
}

export function useMagneticHover<T extends HTMLElement>({
  strength = 0.3,
}: MagneticConfig = {}): {
  ref: RefObject<T>;
  onMouseMove: (e: React.MouseEvent<T>) => void;
  onMouseLeave: () => void;
} {
  const ref = useRef<T>(null);
  const rafRef = useRef<number | null>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (el) {
          el.style.transform = `translate(${dx}px, ${dy}px)`;
          el.style.transition = "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)";
        }
      });
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  }, []);

  return { ref: ref as RefObject<T>, onMouseMove, onMouseLeave };
}
