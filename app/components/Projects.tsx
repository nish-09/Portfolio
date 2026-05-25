'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import ProjectStackCard from './ProjectStackCard';
import { StorySection } from './StorySection';
import {
  loadAllProjects,
  filterProjects,
  sortProjects,
  PROJECT_FILTER_TABS,
  PROJECT_SORT_OPTIONS,
  type PortfolioProject,
  type ProjectFilterTab,
  type ProjectSort,
} from '@/lib/projects-data';

export default function Projects() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<ProjectFilterTab>('All');
  const [sortBy, setSortBy] = useState<ProjectSort>('Featured');

  useEffect(() => {
    loadAllProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = useMemo(() => {
    const filtered = filterProjects(projects, filterTab);
    return sortProjects(filtered, sortBy);
  }, [projects, filterTab, sortBy]);

  return (
    <StorySection
      id="projects"
      className="relative z-20 w-full min-w-0 max-w-[100vw] py-12 sm:py-16 md:py-20 overflow-visible bg-transparent"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-8 sm:pt-12 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-2 tracking-tight">
          Projects
        </h2>
        <p className="text-white/50 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto">
          Cinematic scroll stack · GitHub repos + curated work
        </p>

        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
            {PROJECT_FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all duration-300 ${
                  filterTab === tab
                    ? 'bg-purple-500/20 border-purple-400/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] scale-105'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {PROJECT_SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSortBy(opt)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all ${
                  sortBy === opt
                    ? 'border-white/40 text-white bg-white/10'
                    : 'border-white/10 text-white/40 hover:text-white/70'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full mt-6">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-purple-400 animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-center text-white/40 font-mono py-20">No projects in this filter.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filterTab}-${sortBy}-${displayed.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ScrollStack
                className="projects-scroll-stack"
                itemDistance={120}
                itemScale={0.035}
                itemStackDistance={40}
                stackPosition="18%"
                scaleEndPosition="8%"
                baseScale={0.88}
                rotationAmount={1}
                blurAmount={1.5}
                useWindowScroll={true}
              >
                {displayed.map((project, index) => (
                  <ScrollStackItem key={project.id}>
                    <ProjectStackCard project={project} index={index} />
                  </ScrollStackItem>
                ))}
              </ScrollStack>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </StorySection>
  );
}
