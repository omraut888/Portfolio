"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

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
