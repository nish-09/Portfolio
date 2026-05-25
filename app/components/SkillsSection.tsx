'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Ballpit from './Ballpit';
import { StorySection } from './StorySection';
import {
  SKILL_CATEGORIES,
  skillsForCategory,
  type SkillCategory,
} from '@/lib/skills-data';

const BALL_COLORS = [
  '#ff0080',
  '#7928ca',
  '#0070f3',
  '#38bdf8',
  '#4ade80',
  '#f59e0b',
  '#a855f7',
  '#22d3ee',
];

export default function SkillsSection() {
  const [category, setCategory] = useState<SkillCategory>('All');

  const activeSkills = useMemo(() => skillsForCategory(category), [category]);

  const ballCount = useMemo(
    () => Math.min(Math.max(activeSkills.length + 1, 8), 28),
    [activeSkills.length],
  );
  const ballTexts = useMemo(() => activeSkills.slice(0, ballCount - 1).map((s) => s.label), [activeSkills, ballCount]);
  const ballTextColors = useMemo(() => activeSkills.slice(0, ballCount - 1).map((s) => s.color), [activeSkills, ballCount]);

  return (
    <StorySection
      id="skills"
      className="flex flex-col justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden relative w-full min-w-0 px-3 sm:px-4"
    >
      <div className="w-full min-w-0 max-w-7xl mx-auto px-3 sm:px-6 mb-6 sm:mb-8 md:mb-10 text-center z-10 pointer-events-none relative">
        <h2 className="text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter text-white drop-shadow-md">
          Skills
        </h2>
        <p className="text-white/60 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg px-2">
          Filter categories · Drag and throw the skill spheres
        </p>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto mb-6 sm:mb-8 px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pb-4 pt-2 px-2">
          {SKILL_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-mono uppercase tracking-wider border transition-all duration-300 ${
                  active
                    ? 'bg-white/12 border-amber-400/50 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-105'
                    : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full min-w-0 max-w-[100vw] h-[min(48dvh,480px)] min-h-[240px] sm:min-h-[320px] sm:h-[min(52dvh,520px)] md:h-[70vh] md:min-h-[520px] relative z-10 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Ballpit
              key={`${category}-${ballCount}`}
              count={ballCount}
              minSize={0.75}
              maxSize={1.35}
              size0={1.4}
              gravity={0}
              friction={0.9975}
              wallBounce={0.95}
              followCursor={false}
              colors={BALL_COLORS}
              texts={ballTexts}
              textColors={ballTextColors}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </StorySection>
  );
}
