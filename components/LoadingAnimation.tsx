"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030308]"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
          }}
        >
          {/* Inner wipe layer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #060318 0%, #030308 100%)",
            }}
            exit={{
              clipPath: "inset(0 100% 0 0)",
              transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
            }}
          />

          {/* Logo / Name reveal */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(64px, 10vw, 96px)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                background: "linear-gradient(135deg, #c8d0e0, #00e5ff, #f0c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OR
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginTop: -4,
              }}
            >
              Om Raut
            </motion.div>

            {/* Loading bar */}
            <motion.div className="w-32 h-[1px] bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #7040c0, #00e5ff, #f0c060)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-xs text-white/50 tracking-widest uppercase font-mono"
            >
              Loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
