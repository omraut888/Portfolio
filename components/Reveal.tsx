"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  animate,
  motion,
  transform,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const CURTAIN = [0.76, 0, 0.24, 1] as [number, number, number, number];
const RISE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Dramatic "curtain rises" clip-path reveal for section content. */
export function ClipReveal({
  children,
  className,
  delay = 0,
  amount = 0.05,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      // Start fully visible (unclipped) so Chrome never leaves the content
      // clipped-out if whileInView fails to fire; animation still runs when it does.
      initial={{ clipPath: "inset(0% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, amount, margin: "-50px" }}
      transition={{ duration: 0.9, ease: CURTAIN, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Heading whose words rise up through the floor, staggered. */
export function WordReveal({
  text,
  className,
  style,
  delay = 0,
  wordDelay = 0.08,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  wordDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline-block", ...style }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
            paddingBottom: "0.14em",
            marginBottom: "-0.14em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            // Rest at y:0 so words are never stuck below the mask in Chrome.
            initial={{ y: 0 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5, margin: "-50px" }}
            transition={{ duration: 0.75, ease: RISE, delay: delay + i * wordDelay }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Thin decorative line that draws from 0 to full width on enter. */
export function LineDraw({
  className,
  style,
  delay = 0,
  color = "rgba(255,255,255,0.12)",
}: {
  className?: string;
  style?: CSSProperties;
  delay?: number;
  color?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{ height: 1, background: color, transformOrigin: "left", width: "100%", ...style }}
      initial={{ scaleX: 1 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    />
  );
}

/**
 * Per-word staggered reveal for big statement headings: each word fades in
 * and rises 20px, ~0.05s apart, once the heading's top crosses 80% of the
 * viewport (the same trigger point ScrollScale starts at). Fires once.
 * Reduced motion: all words appear at once, instantly (no stagger, no rise).
 * Always starts "hidden" so the server and client render the same markup.
 */
export function WordStagger({
  text,
  className,
  style,
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
}) {
  const reduce = useReducedMotionSafe();
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", ...style }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : stagger } } }}
    >
      {words.map((w, i) => (
        <span key={i}>
          <motion.span
            style={{ display: "inline-block" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: reduce ? { duration: 0 } : { duration: 0.6, ease: RISE } },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Opacity is derived through a JS function on purpose: framer-motion hands a
 * plain `useTransform(scrollYProgress, …)` opacity to the browser's native
 * ScrollTimeline, which ignores `target`/`offset` and tracks whole-page scroll.
 * A function transform keeps it bound to the element's own scroll range.
 */
export const scrubOpacity = (input: number[], output: number[]) => (v: number) =>
  transform(v, input, output);

/**
 * Scroll-scrubbed headline: scales 0.7 → 1 and fades 0 → 1 as the block's top
 * travels from 80% to 30% of the viewport. Tied to scroll position, so it
 * reverses when scrolling back up. Reduced motion: opacity only.
 */
export function ScrollScale({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "start 0.3"] });
  const opacity = useTransform(scrollYProgress, scrubOpacity([0, 1], [0, 1]));
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.7, 1]);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, opacity, scale }}>
      {children}
    </motion.div>
  );
}

/**
 * Scroll-scrubbed list item (project rows, experience cards): slides in 120px
 * from the left (odd rows) or right (even rows) while scaling 0.85 → 1 and
 * fading in. Uses a slightly earlier window than headlines so a card is fully
 * settled before it reaches mid-screen. Reduced motion: opacity only.
 */
export function ScrollSlide({
  children,
  index,
  className,
  style,
}: {
  children: ReactNode;
  /** 0-based position; even index = odd row (from left), odd index = even row (from right). */
  index: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.55"] });
  const from = index % 2 === 0 ? -120 : 120;
  const opacity = useTransform(scrollYProgress, scrubOpacity([0, 1], [0, 1]));
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.85, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : from, 0]);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, opacity, scale, x }}>
      {children}
    </motion.div>
  );
}

/**
 * Counts the first number in `value` up from 0 when it scrolls into view
 * (once, ~1.2s), keeping any prefix/suffix and the original decimals and
 * thousands separators — e.g. "96.7%", "+15%", "3,700", "8.2 / 10".
 * Non-numeric values render as-is. The server render shows the final value,
 * so the real number is never lost if JS is slow; reduced motion skips the climb.
 */
export function CountUp({ value, duration = 1.2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = value.match(/\d[\d,]*(?:\.\d+)?/);
  const [display, setDisplay] = useState(value);
  const armed = useRef(false);

  const parts = match
    ? {
        pre: value.slice(0, match.index),
        post: value.slice((match.index ?? 0) + match[0].length),
        target: parseFloat(match[0].replace(/,/g, "")),
        decimals: (match[0].split(".")[1] ?? "").length,
        commas: match[0].includes(","),
      }
    : null;

  const fmt = (n: number) => {
    if (!parts) return value;
    const num = parts.commas
      ? n.toLocaleString("en-US", { minimumFractionDigits: parts.decimals, maximumFractionDigits: parts.decimals })
      : n.toFixed(parts.decimals);
    return parts.pre + num + parts.post;
  };

  // Arm on mount: drop to 0 while still off-screen so the climb is visible.
  useEffect(() => {
    if (!parts || reduce || armed.current || inView) return;
    armed.current = true;
    setDisplay(fmt(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => {
    if (!parts || !inView) return;
    if (reduce || !armed.current) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, parts.target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setDisplay(fmt(n)),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return <span ref={ref}>{display}</span>;
}
