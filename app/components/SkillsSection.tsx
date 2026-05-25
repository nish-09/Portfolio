'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Ballpit from './Ballpit';
import { StorySection } from './StorySection';
import {
  SKILL_CATEGORIES,
  getSkillsForCategory,
  skillsToBallpitProps,
  type SkillCategory,
} from '@/lib/skills-data';

export default function SkillsSection() {
  const [category, setCategory] = useState<SkillCategory>('All');

  const skills = useMemo(() => getSkillsForCategory(category), [category]);
  const ballpit = useMemo(() => skillsToBallpitProps(skills), [skills]);

  return (
    <StorySection
      id="skills"
      className="relative flex flex-col justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden w-full min-w-0 px-3 sm:px-4"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-amber-900/5"
        aria-hidden
      />
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute w-1 h-1 rounded-full bg-white/30"
          style={{
            left: `${8 + (i * 7) % 84}%`,
            top: `${12 + (i * 11) % 76}%`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeInOut',
          }}
          aria-hidden
        />
      ))}

      <div className="w-full min-w-0 max-w-7xl mx-auto px-3 sm:px-6 mb-6 sm:mb-8 text-center z-10 relative">
        <h2 className="text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter text-white drop-shadow-md">
          Skills
        </h2>
        <p className="text-white/60 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg px-2">
          Filter by category · drag and bounce the stack
        </p>

        <div className="mt-6 sm:mt-8 flex gap-2 overflow-x-auto pb-2 px-1 justify-start sm:justify-center scrollbar-thin max-w-full">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all duration-300 ${
                category === cat
                  ? 'bg-purple-500/20 border-purple-400/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[10px] font-mono text-white/35 tracking-widest uppercase">
          {skills.length} skills · {category}
        </p>
      </div>

      <motion.div
        key={category}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="w-full min-w-0 max-w-[100vw] h-[min(48dvh,480px)] min-h-[240px] sm:min-h-[320px] sm:h-[min(52dvh,520px)] md:h-[70vh] md:min-h-[520px] relative z-10 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
      >
        <Ballpit
          count={ballpit.count}
          minSize={0.75}
          maxSize={1.4}
          size0={1.4}
          gravity={0}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
          colors={ballpit.colors}
          texts={ballpit.texts}
          textColors={ballpit.textColors}
        />
      </motion.div>
    </StorySection>
  );
}
