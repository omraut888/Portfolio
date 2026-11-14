"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * prefers-reduced-motion, but `false` until after mount. The server can't know
 * the user's preference, so reading it during the first render makes
 * reduced-motion users' markup differ from the server's (hydration mismatch).
 * Motion values recompute when this flips, so the reduced state applies on the
 * next frame.
 */
export function useReducedMotionSafe(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}
