"use client";

import { useState, useEffect } from "react";

interface TypewriterConfig {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  startDelay?: number;
}

interface TypewriterResult {
  displayText: string;
  isTyping: boolean;
  isDeleting: boolean;
  currentWordIndex: number;
}

export function useTypewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 50,
  holdDuration = 1500,
  startDelay = 400,
}: TypewriterConfig): TypewriterResult {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const s = {
      charIndex: 0,
      wordIndex: 0,
      wordCount: 0, // remaining whole words shown while deleting
      phase: "typing" as "typing" | "holding" | "deleting",
    };

    function tick() {
      const word = words[s.wordIndex];

      if (s.phase === "typing") {
        if (s.charIndex < word.length) {
          s.charIndex++;
          setDisplayText(word.slice(0, s.charIndex));
          setIsTyping(true);
          setIsDeleting(false);
          timer = setTimeout(tick, typeSpeed + Math.random() * 40 - 20);
        } else {
          setIsTyping(false);
          s.phase = "holding";
          s.wordCount = word.split(" ").length;
          timer = setTimeout(() => {
            s.phase = "deleting";
            tick();
          }, holdDuration);
        }
      } else if (s.phase === "deleting") {
        // Delete whole words at a time so the displayed text is always a
        // sequence of complete words, never a partial string like "Prob".
        if (s.wordCount > 0) {
          s.wordCount--;
          const shown = word.split(" ").slice(0, s.wordCount).join(" ");
          // Hard floor: never flash a fragment shorter than 3 characters
          // (e.g. "Pr", "P") — snap straight to empty instead.
          setDisplayText(shown.length >= 3 ? shown : "");
          setIsTyping(false);
          setIsDeleting(true);
          timer = setTimeout(tick, deleteSpeed);
        } else {
          setIsDeleting(false);
          s.charIndex = 0;
          s.wordIndex = (s.wordIndex + 1) % words.length;
          setCurrentWordIndex(s.wordIndex);
          s.phase = "typing";
          timer = setTimeout(tick, startDelay);
        }
      }
    }

    timer = setTimeout(tick, startDelay);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { displayText, isTyping, isDeleting, currentWordIndex };
}
