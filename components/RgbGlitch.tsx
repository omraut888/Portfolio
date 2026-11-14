"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Chromatic RGB-split glitch, fired briefly at random intervals.
 *
 * An SVG filter isolates the red, green and blue channels of the content
 * (feColorMatrix), shifts each by a few pixels (feOffset) and recombines them
 * with feBlend mode="screen" (pure channels screened together add back up to
 * the original colours, so only the offsets show). The filter is only applied
 * while `.is-glitching` is on the wrapper: 150-250ms bursts every 4-8s, and
 * only while the element is on screen. Each burst randomises the offsets so
 * consecutive glitches don't look identical. Disabled for reduced motion.
 *
 * Intervals are a chain of setTimeouts rather than one setInterval, because
 * setInterval can't vary its delay between ticks.
 */
export default function RgbGlitch({
  children,
  className,
  minDelay = 4000,
  maxDelay = 8000,
}: {
  children: ReactNode;
  className?: string;
  minDelay?: number;
  maxDelay?: number;
}) {
  const id = `rgb-split-${useId().replace(/:/g, "")}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<SVGFilterElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduce) return;

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const timers: number[] = [];

    const setOffsets = () => {
      const f = filterRef.current;
      if (!f) return;
      const dx = Math.round(rand(4, 9));
      f.querySelector('[data-ch="r"]')?.setAttribute("dx", String(-dx));
      f.querySelector('[data-ch="b"]')?.setAttribute("dx", String(dx));
      f.querySelector('[data-ch="r"]')?.setAttribute("dy", String(Math.round(rand(-2, 2))));
      f.querySelector('[data-ch="b"]')?.setAttribute("dy", String(Math.round(rand(-2, 2))));
    };

    const schedule = () => {
      timers.push(
        window.setTimeout(() => {
          if (visible && !document.hidden) {
            setOffsets();
            wrap.classList.add("is-glitching");
            timers.push(window.setTimeout(() => wrap.classList.remove("is-glitching"), rand(150, 250)));
          }
          schedule();
        }, rand(minDelay, maxDelay))
      );
    };
    schedule();

    return () => {
      timers.forEach(clearTimeout);
      io.disconnect();
      wrap.classList.remove("is-glitching");
    };
  }, [reduce, minDelay, maxDelay]);

  return (
    <div
      ref={wrapRef}
      className={`rgb-glitch ${className ?? ""}`}
      style={{ ["--rgb-filter" as string]: `url(#${id})` }}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <filter
          ref={filterRef}
          id={id}
          x="-4%"
          y="-2%"
          width="108%"
          height="104%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
          <feOffset in="red" data-ch="r" dx="-6" dy="0" result="redShift" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
          <feOffset in="blue" data-ch="b" dx="6" dy="0" result="blueShift" />
          <feBlend in="redShift" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueShift" mode="screen" />
        </filter>
      </svg>
      {children}
    </div>
  );
}
