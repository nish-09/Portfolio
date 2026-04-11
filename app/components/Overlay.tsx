"use client";

import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { useRef } from "react";

const heroScrollSpring = {
  stiffness: 48,
  damping: 46,
  mass: 0.65,
} as const;

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothHeroScroll = useSpring(scrollYProgress, heroScrollSpring);

  const opacity1 = useTransform(smoothHeroScroll, [0, 0.15, 0.25, 1], [1, 1, 0, 0]);
  const y1 = useTransform(smoothHeroScroll, [0, 0.25, 1], [0, -100, -100]);

  const opacity2 = useTransform(smoothHeroScroll, [0, 0.35, 0.45, 0.6, 0.7, 1], [0, 0, 1, 1, 0, 0]);
  const y2 = useTransform(smoothHeroScroll, [0, 0.35, 0.7, 1], [100, 100, -100, -100]);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full max-w-[100vw] min-w-0 h-[400vh] pointer-events-none z-10 overflow-x-clip">
      <div className="sticky top-0 h-[100dvh] min-h-[100svh] max-h-[100dvh] w-full max-w-[100vw] min-w-0 flex items-center overflow-hidden box-border pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]">

        <motion.div
          style={{ opacity: opacity1, y: y1 }}
          className="absolute inset-0 w-full max-w-full flex flex-col items-center justify-center text-center px-3 sm:px-5 md:px-6 box-border"
        >
          <h1 className="w-full max-w-[min(100%,20ch)] sm:max-w-none text-[clamp(1.85rem,7.5vw,6rem)] md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl leading-[1.08] break-words px-1">
            Nishit Parikh
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl lg:text-3xl text-gray-300 mt-2 sm:mt-3 md:mt-4 tracking-wide font-light drop-shadow-md max-w-[min(100%,34ch)] sm:max-w-[40ch] md:max-w-none px-2">
            AI & Data Science | Web Developer
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="absolute left-0 right-0 sm:right-auto md:left-24 w-full max-w-full sm:max-w-2xl mx-auto sm:mx-0 px-3 sm:px-6 md:pl-8 md:pr-6"
        >
          <h2 className="text-[clamp(1.35rem,4.5vw,3.75rem)] md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl leading-[1.12] break-words">
            I build responsive web applications.
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-white mt-6 sm:mt-8 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mt-4 sm:mt-6 tracking-wide font-light max-w-lg">
            A continuous learner passionate about problem-solving and full-stack development.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
