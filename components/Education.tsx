"use client";

import { motion } from "framer-motion";
import { ClipReveal, WordReveal, LineDraw } from "./Reveal";

const schools = [
  {
    name: "Northeastern University",
    degree: "MS Information Systems",
    track: "",
    location: "Boston, MA",
    period: "Expected Dec 2026",
    gpa: "3.39",
    color: "#00e5ff",
    accentColor: "#00e5ff",
    icon: "🎓",
    gradient: "linear-gradient(135deg, #001820, #0a3d4a)",
  },
  {
    name: "D.Y. Patil University",
    degree: "BTech Computer Science",
    track: "",
    location: "Mumbai, India",
    period: "Aug 2020 – May 2024",
    gpa: "3.33",
    color: "#7040c0",
    accentColor: "#9d7be0",
    icon: "🏛️",
    gradient: "linear-gradient(135deg, #12002b, #3a1e5f)",
  },
];

const certifications = [
  {
    title: "Generative AI Professional",
    issuer: "Oracle",
    color: "#00e5ff",
    icon: "🤖",
  },
  {
    title: "AI Vector Search",
    issuer: "Oracle",
    color: "#7040c0",
    icon: "🔍",
  },
  {
    title: "Autonomous Database",
    issuer: "Oracle",
    color: "#f0c060",
    icon: "🗄️",
  },
  {
    title: "APEX Cloud Developer",
    issuer: "Oracle",
    color: "#00c8a0",
    icon: "☁️",
  },
  {
    title: "Machine Learning",
    issuer: "IBM",
    color: "#00e5ff",
    icon: "⚙️",
  },
  {
    title: "Business Analytics",
    issuer: "Harvard Business School",
    color: "#7040c0",
    icon: "📊",
  },
];

export default function Education() {
  return (
    <section
      id="education"
      className="relative z-10 pt-16 pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(3,3,8,0.82) 0%, rgba(6,3,24,0.78) 50%, rgba(3,3,8,0.82) 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 70%, rgba(112,64,192,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ClipReveal className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00e5ff" }}>
            Academic
          </p>
          <h2 className="section-heading text-white">
            <WordReveal text="Education" />
          </h2>
          <LineDraw className="mx-auto mt-8" style={{ maxWidth: 200 }} color="rgba(255,255,255,0.1)" />
        </ClipReveal>

        {/* School cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {schools.map((school, i) => (
            <motion.div
              key={school.name}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${school.color}30`,
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 20px 60px ${school.color}15`,
              }}
            >
              {/* Gradient top bar */}
              <div
                className="h-1.5"
                style={{ background: school.gradient }}
              />

              <div className="p-7">
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: `${school.color}15`,
                      border: `1px solid ${school.color}30`,
                    }}
                  >
                    {school.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl leading-tight">
                      {school.name}
                    </h3>
                    <p
                      className="font-semibold text-sm mt-0.5"
                      style={{ color: school.accentColor }}
                    >
                      {school.degree}
                    </p>
                    {school.track && <p className="text-white/40 text-xs mt-0.5">{school.track}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Location", value: school.location },
                    { label: "Period", value: school.period },
                    { label: "GPA", value: school.gpa },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-3"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div className="text-white/35 text-[10px] uppercase tracking-wider mb-1">
                        {item.label}
                      </div>
                      <div className="text-white/80 text-sm font-semibold">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3
            className="text-center mb-8"
            style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.02em", color: "#f5efe8" }}
          >
            Certifications &amp; Badges
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 1, scale: 1, y: 0 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.06,
                  y: -4,
                  boxShadow: `0 10px 30px ${cert.color}25`,
                }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: `${cert.color}10`,
                  border: `1px solid ${cert.color}25`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-2xl mb-2">{cert.icon}</div>
                <div
                  className="font-bold text-xs leading-tight mb-1"
                  style={{ color: cert.color }}
                >
                  {cert.title}
                </div>
                <div className="text-white/30 text-[10px]">{cert.issuer}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
