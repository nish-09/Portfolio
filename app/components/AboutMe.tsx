'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lanyard from './Lanyard';
import { StorySection } from './StorySection';
import './AboutMe.css';

// ─── Typewriter Component ──────────────────────────────────────────────────
interface TypewriterProps {
  paragraphs: string[];
  speed?: number;
  delayBetweenParagraphs?: number;
  onComplete?: () => void;
}

function Typewriter({
  paragraphs,
  speed = 30,
  delayBetweenParagraphs = 200,
  onComplete,
}: TypewriterProps) {
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>(
    paragraphs.map(() => '')
  );
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) return;

    if (currentParagraphIndex >= paragraphs.length) {
      setIsDone(true);
      onComplete?.();
      return;
    }

    const currentText = paragraphs[currentParagraphIndex];
    if (currentCharacterIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedParagraphs((prev) => {
          const next = [...prev];
          next[currentParagraphIndex] = currentText.slice(0, currentCharacterIndex + 1);
          return next;
        });
        setCurrentCharacterIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentParagraphIndex((prev) => prev + 1);
        setCurrentCharacterIndex(0);
      }, delayBetweenParagraphs);
      return () => clearTimeout(timer);
    }
  }, [currentParagraphIndex, currentCharacterIndex, paragraphs, speed, delayBetweenParagraphs, onComplete, isDone]);

  return (
    <div className="space-y-4 sm:space-y-6 text-left">
      {displayedParagraphs.map((text, idx) => {
        if (idx > currentParagraphIndex) return null;
        const isCurrentlyTyping = idx === currentParagraphIndex && !isDone;
        return (
          <p key={idx} className="break-words">
            {text}
            {isCurrentlyTyping && (
              <span className="animate-pulse inline-block ml-1 text-purple-500 font-bold">|</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

const PARAGRAPHS = [
  "I’m a code-curious AI & Data Science student who turns caffeine + curiosity into clean, functional web apps.",
  "I build with React, JavaScript, Tailwind, Node.js, and whatever else helps bring ideas to life.",
  "Currently leveling up in full-stack dev + DSA, while shipping projects that don’t just work but feel right.",
  "I like building things that look cool, run smooth, and actually solve problems.",
  "Less talk, more build."
];

export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // Viewport trigger for starting typewriter
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setShowCard(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative">
      <StorySection
        id="about"
        className="relative w-full min-w-0 max-w-[100vw] py-12 sm:py-16 md:py-20 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 md:px-12 lg:px-24 overflow-hidden bg-transparent"
      >
        <motion.div
          className="max-w-7xl w-full min-w-0 mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12 min-h-0 md:min-h-[600px]"
        >
          <div ref={textRef} className="w-full min-w-0 md:w-1/2 z-10 order-2 md:order-none">
            <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight text-center md:text-left">
              About <span className="text-purple-500">Me</span>
            </h2>
            
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-white/70 leading-relaxed text-center md:text-left text-pretty min-h-[16rem]">
              {inView ? (
                <Typewriter
                  paragraphs={PARAGRAPHS}
                  speed={12}
                  delayBetweenParagraphs={250}
                />
              ) : (
                <p className="opacity-0">...</p>
              )}
              
              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 md:gap-4">
                <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/90">
                  Artificial Intelligence
                </div>
                <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/90">
                  Data Science
                </div>
                <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/90">
                  Full-Stack Development
                </div>
              </div>
            </div>
          </div>

          <div className="w-full min-w-0 md:w-1/2 h-[min(48vh,440px)] sm:h-[min(56vh,560px)] md:h-[700px] relative order-1 md:order-last shrink-0 flex items-center justify-center">
            {showCard ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full h-full relative"
              >
                <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
                <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] sm:text-xs tracking-widest uppercase pointer-events-none animate-pulse text-center w-full px-2">
                  Grab the card
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center text-white/20 text-sm tracking-widest uppercase animate-pulse border border-white/5 bg-white/[0.01] rounded-3xl w-full h-[85%]">
                [ Awaiting transmission... ]
              </div>
            )}
          </div>
        </motion.div>
      </StorySection>
    </div>
  );
}
