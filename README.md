# Om Raut — AI/ML Engineer Portfolio

> Building production-grade AI systems that reason, retrieve, and act at scale.

[![Live Site](https://img.shields.io/badge/Live-omraut.dev-00e5ff?style=flat-square)](https://om-raut-portfolio-rho.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-omraut88-7040c0?style=flat-square)](https://linkedin.com/in/omraut88)
[![GitHub](https://img.shields.io/badge/GitHub-omraut888-f0c060?style=flat-square)](https://github.com/omraut888)

---

## About

I'm an AI/ML Engineer and MS Information Systems candidate at Northeastern University (Dec 2026), currently building production AI infrastructure at The Ticker App in Boston. My work spans RAG pipelines, multi-agent orchestration, and LLM-powered applications that hold up under real traffic.

This portfolio is not a template. It's a ground-up, production-grade Next.js application built with the same engineering standards I apply to every system I ship — clean architecture, real animations, and zero shortcuts.

**Current focus:** Multi-agent systems with LangGraph, vector search at scale with Qdrant, and LLM evaluation pipelines.

---

## Technical Highlights

| Metric | Value |
|--------|-------|
| Vectors in production | 10B+ |
| RAG retrieval accuracy | 86.7% |
| AI agents built | 5 |
| Production systems shipped | 3 |

---

## Portfolio Architecture

```
portfolio/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx          # Root layout + metadata
│   └── page.tsx            # Page composition
├── components/
│   ├── three/              # Three.js / WebGL components
│   │   └── HeroCanvas.tsx  # Particle sphere + scroll explosion
│   ├── Hero.tsx            # Landing section
│   ├── About.tsx           # Bio + terminal animation
│   ├── Skills.tsx          # Tech index (CV style)
│   ├── Experience.tsx      # Timeline with scroll-drawn line
│   ├── Projects.tsx        # Expandable project list
│   ├── Education.tsx       # Academic + certifications
│   ├── Contact.tsx         # Terminal contact card
│   ├── StarfieldBackground.tsx  # Fixed canvas starfield
│   ├── Navbar.tsx          # Scroll-aware navigation
│   ├── CustomCursor.tsx    # Magnetic cursor
│   └── ScrollProgress.tsx  # Top progress bar
├── hooks/
│   └── useTypewriter.ts    # Role cycling typewriter
├── public/
│   └── frames/             # Generated JPEG sequence frames
└── scripts/
    └── generateFrames.js   # Node.js frame generator
```

---

## Tech Stack

### Frontend
- **Next.js 14** — App Router, SSR, dynamic imports
- **TypeScript** — strict type safety throughout
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — scroll-driven animations, spring physics, AnimatePresence

### 3D & Visual
- **Three.js** — WebGL particle system, sphere geometry, fibonacci distribution
- **React Three Fiber** — declarative Three.js in React
- **Canvas 2D API** — custom starfield, scroll explosion effect
- **RequestAnimationFrame** — 60fps animation loop, zero React re-renders during scroll

### Design System
- **Theme:** Neural Cosmos — deep void black (#030308), cyan (#00e5ff), violet (#7040c0), gold (#f0c060)
- **Typography:** Cormorant Garamond (display), DM Sans (body), JetBrains Mono (terminal)
- **Motion:** Custom easing curves [0.16, 1, 0.3, 1], magnetic hover, text scramble

### Infrastructure
- **Vercel** — production deployment, edge network, preview environments
- **Node.js** — custom frame generation script (canvas package)

---

## Featured Projects

### CodeGen AI
5-agent LangGraph pipeline automating the full software development lifecycle. Generator → Reviewer → Tester → Documenter → Optimizer. 89% code quality, 60% faster generation, 92% test pass rate.

**Stack:** LangGraph · FastAPI · PostgreSQL · Docker · Apache Airflow · Pinecone

### AURELIA
Financial RAG system achieving 86.7% retrieval accuracy across a 3,462-page corpus. Hybrid dense + keyword retrieval outperforming single-strategy baseline by 23%.

**Stack:** ChromaDB · FastAPI · Streamlit · Apache Airflow · Python

### ORBIT v2
Multi-agent PE intelligence platform with LangGraph Human-in-the-Loop workflows. MCP integration with live tool-calling across agent boundaries. 97%+ test coverage.

**Stack:** LangGraph · MCP · FastAPI · ChromaDB · Apache Airflow

### Ticker GPT
Live ChatGPT Store GPT for social investing education. 4-module curriculum backed by a production Qdrant RAG endpoint.

**Stack:** GPT Builder · Qdrant · LangGraph · RAG

---

## Engineering Decisions

**Why no component library?**
Every UI component is custom-built. Component libraries introduce visual uniformity that kills distinctiveness. The cursor, the starfield, the particle sphere, the terminal animations — all written from scratch.

**Why Canvas 2D over CSS animations for the starfield?**
CSS animations are GPU-composited but limited. The scroll-driven particle explosion requires per-frame position interpolation across 2000 particles — Canvas 2D with rAF gives precise control at 60fps with zero layout recalculation.

**Why Framer Motion for section reveals?**
Spring physics feel more human than CSS cubic-bezier curves. Framer's `useScroll` + `useTransform` hook eliminates the need for scroll event listeners on individual elements — one shared scroll value drives all parallax transforms.

**Why sticky canvas for the starfield?**
`position: fixed` causes issues in iOS Safari and certain Chrome scroll contexts. `position: sticky` on the canvas with a tall scroll spacer gives the same visual result with better cross-browser compatibility.

---

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Generate frame sequence (optional)
node scripts/generateFrames.js

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

Deployed on Vercel with automatic preview deployments on every push.

```bash
# Deploy to production
vercel deploy --prod

# Or push to main branch (auto-deploys via GitHub integration)
git push origin main
```

---

## Contact

Currently open to full-time AI/ML engineering roles (Dec 2026, F-1 OPT → H-1B sponsorship required).

| Channel | Link |
|---------|------|
| Email | raut.om@northeastern.edu |
| LinkedIn | linkedin.com/in/omraut88 |
| GitHub | github.com/omraut888 |
| Phone | (617) 794-3580 |

---

*Designed and built by Om Raut · 2026 · Boston, MA*
