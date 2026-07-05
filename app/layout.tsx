import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Om Raut — AI/ML Engineer",
  description:
    "Portfolio of Om Raut — AI/ML Engineer and MS Information Systems student at Northeastern University. Building production-grade RAG systems and multi-agent architectures.",
  keywords: [
    "Om Raut",
    "AI Engineer",
    "ML Engineer",
    "RAG",
    "LangGraph",
    "Northeastern University",
    "Data Science",
    "Portfolio",
  ],
  authors: [{ name: "Om Raut" }],
  openGraph: {
    title: "Om Raut — AI/ML Engineer",
    description:
      "Building production-grade RAG systems, multi-agent architectures, and LLM-powered applications.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Om Raut — AI/ML Engineer",
    description:
      "Building production-grade RAG systems, multi-agent architectures, and LLM-powered applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#030308] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
