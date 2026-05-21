'use client';

import Lanyard from './Lanyard';
import './AboutMe.css';
import { StorySection } from './StorySection';
import { useRef } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';

export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4
  });

  // Buttery-smooth scroll-linked entry, float, and exit
  const opacity = useTransform(smoothProgress, [0.05, 0.28, 0.8, 0.95], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0.05, 0.28, 0.8, 0.95], [60, 0, 0, -60]);
  const scale = useTransform(smoothProgress, [0.05, 0.28, 0.8, 0.95], [0.96, 1, 1, 0.96]);

  return (
    <div ref={containerRef} className="w-full relative">
      <StorySection
        id="about"
        className="relative w-full min-w-0 max-w-[100vw] py-12 sm:py-16 md:py-20 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 md:px-12 lg:px-24 overflow-hidden bg-transparent"
      >
        <motion.div 
          style={{ opacity, y, scale }}
          className="max-w-7xl w-full min-w-0 mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12 min-h-0 md:min-h-[600px]"
        >

        <div className="w-full min-w-0 md:w-1/2 z-10 order-2 md:order-none">
          <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight text-center md:text-left">
            About <span className="text-purple-500">Me</span>
          </h2>
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-white/70 leading-relaxed text-center md:text-left text-pretty">
            <p className="break-words">
            I’m a code-curious AI & Data Science student who turns caffeine + curiosity into clean, functional web apps.
I build with React, JavaScript, Tailwind, Node.js, and whatever else helps bring ideas to life.

Currently leveling up in full-stack dev + DSA, while shipping projects that don’t just work but feel right.

I like building things that look cool, run smooth, and actually solve problems.

Less talk, more build.
            </p>
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

        <div className="w-full min-w-0 md:w-1/2 h-[min(48vh,440px)] sm:h-[min(56vh,560px)] md:h-[700px] relative order-1 md:order-last shrink-0">
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />

          <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] sm:text-xs tracking-widest uppercase pointer-events-none animate-pulse text-center w-full px-2">
            Grab the card
          </div>
        </div>

        </motion.div>
      </StorySection>
    </div>
  );
}
