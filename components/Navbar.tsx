"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import GlitchText from "./GlitchText";

const sections = ["hero", "about", "skills", "experience", "projects", "education", "contact"];
const labels = ["Home", "About", "Skills", "Experience", "Projects", "Education", "Contact"];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const hireMe = useMagnetic<HTMLButtonElement>();

  const navBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(3,3,8,0)", "rgba(3,3,8,0.97)"] // near-opaque so it stays dark over cream sections
  );

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  }, []);

  return (
    <motion.nav
      style={{ backgroundColor: navBg }}
      className={`fixed top-2 left-0 right-0 z-[8000] transition-all duration-500 ${
        isScrolled ? "backdrop-blur-xl border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo("hero")}
          className="relative group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="text-xl font-black tracking-tighter"
            style={{ color: "#ffffff" }}
          >
            Om Raut
          </span>
        </motion.button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {sections.map((id, i) => (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              className={`glitch-host relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                activeSection === id
                  ? "text-white"
                  : "text-white/50 hover:text-accent"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === id && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${activeSection === id ? "" : "link-accent"}`}>
                <GlitchText text={labels[i]} />
              </span>
            </motion.button>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          ref={hireMe.ref}
          onClick={() => scrollTo("contact")}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            x: hireMe.x,
            y: hireMe.y,
            background: "rgba(232,48,58,0)",
            border: "1px solid #E8303A",
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(232,48,58,0.12)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-accent">Hire Me</span>
        </motion.button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-6 h-0.5 bg-white origin-center"
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-white"
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-white origin-center"
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden"
        style={{
          background: "rgba(3,3,8,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {sections.map((id, i) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-left py-2 text-base font-medium transition-colors ${
                activeSection === id ? "text-accent" : "text-white/60"
              }`}
            >
              {labels[i]}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
