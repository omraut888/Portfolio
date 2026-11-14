"use client";

import { motion } from "framer-motion";
import { GraduationCap, Landmark, Bot, Database, Cpu, BarChart3 } from "lucide-react";
import { CountUp, WordReveal, LineDraw, ScrollScale } from "./Reveal";

const schools = [
  {
    name: "Northeastern University",
    degree: "MS Information Systems",
    track: "",
    location: "Boston, MA",
    period: "Expected Dec 2026",
    gpa: "3.39",
    icon: GraduationCap,
  },
  {
    name: "D.Y. Patil University",
    degree: "BTech Computer Science",
    track: "",
    location: "Mumbai, India",
    period: "Aug 2020 – May 2024",
    gpa: "3.33",
    icon: Landmark,
  },
];

const certifications = [
  {
    title: "OCI 2025 Certified Data Science Professional",
    issuer: "Oracle",
    icon: Database,
    url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=0126302BCDA638530DE3D17D187A73056CF0A5AE6418A3749F894BB0F5D64F75",
  },
  {
    title: "OCI 2025 Certified Generative AI Professional",
    issuer: "Oracle",
    icon: Bot,
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=72855E378E3491FD6233A89FC5431377D5550AE6A3BBF295FF20B02D714E4C8E",
  },
  {
    title: "Machine Learning Introduction for Everyone",
    issuer: "IBM (via Coursera)",
    icon: Cpu,
    url: "https://coursera.org/verify/KBDKDI8QKNF9",
  },
  {
    title: "Business Analytics",
    issuer: "Harvard Business School Online · Nov 2021",
    icon: BarChart3,
    url: "https://online.hbs.edu/verify-certificate?dvid=V38HGA4L",
  },
];

export default function Education() {
  return (
    <section
      id="education"
      className="surface-light relative z-10 pt-16 pb-16 overflow-hidden"
    >

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollScale className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-accent">
            Academic
          </p>
          <h2 className="section-heading text-ink">
            <WordReveal text="Education" />
          </h2>
          <LineDraw className="mx-auto mt-8" style={{ maxWidth: 120 }} color="rgba(232,48,58,0.8)" />
        </ScrollScale>

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
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(26,24,22,0.12)",
              }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(232,48,58,0.35)",
              }}
            >
              {/* Top accent line */}
              <div className="h-px" style={{ background: "rgba(232,48,58,0.45)" }} />

              <div className="p-7">
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: "rgba(26,24,22,0.04)",
                      border: "1px solid rgba(26,24,22,0.12)",
                    }}
                  >
                    <school.icon size={24} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-xl leading-tight">
                      {school.name}
                    </h3>
                    <p
                      className="font-semibold text-sm mt-0.5"
                      style={{ color: "rgba(26,24,22,0.65)" }}
                    >
                      {school.degree}
                    </p>
                    {school.track && <p className="text-ink/55 text-xs mt-0.5">{school.track}</p>}
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
                      style={{ background: "rgba(26,24,22,0.04)" }}
                    >
                      <div className="text-ink/50 text-[10px] uppercase tracking-wider mb-1">
                        {item.label}
                      </div>
                      <div className="text-ink/85 text-sm font-semibold">
                        {item.label === "GPA" ? <CountUp value={item.value} /> : item.value}
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
            style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.02em", color: "var(--ink)" }}
          >
            Certifications &amp; Badges
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {certifications.map((cert, i) => (
              <motion.a
                key={cert.title}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
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
                  borderColor: "rgba(232,48,58,0.35)",
                }}
                className="block rounded-xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(26,24,22,0.12)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="h-8 mb-2 flex items-center justify-center">
                  <cert.icon size={24} color="rgba(26,24,22,0.75)" strokeWidth={1.5} />
                </div>
                <div
                  className="font-bold text-xs leading-tight mb-1"
                  style={{ color: "rgba(26,24,22,0.9)" }}
                >
                  {cert.title}
                </div>
                <div className="text-ink/50 text-[10px]">{cert.issuer}</div>
                <div className="text-[10px] font-semibold mt-2">
                  <span className="link-accent text-accent">Verify ↗</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
