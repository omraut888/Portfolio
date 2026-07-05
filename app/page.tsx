"use client";

import dynamic from "next/dynamic";
import LoadingAnimation from "@/components/LoadingAnimation";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import StarfieldBackground from "@/components/StarfieldBackground";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <StarfieldBackground />
      <LoadingAnimation />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
    </>
  );
}
