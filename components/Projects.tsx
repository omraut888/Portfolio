"use client";

import ProjectsGallery from "./three/ProjectsGallery";
import { ClipReveal } from "./Reveal";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative z-10 pt-16 pb-16 overflow-hidden"
      style={{ background: "rgba(5,5,8,0.82)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <ClipReveal className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#00e5ff" }}>
            Portfolio
          </p>
          <h2 className="section-heading text-white">Featured Projects</h2>
          <p className="text-white/35 text-sm font-mono mt-4">
            click any project to expand full details
          </p>
        </ClipReveal>

        <div>
          <ProjectsGallery />
        </div>
      </div>
    </section>
  );
}
