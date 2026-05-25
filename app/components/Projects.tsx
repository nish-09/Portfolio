'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGallery from './CircularGallery';
import { StorySection } from './StorySection';
import {
  mergeWithGithubRepos,
  toGalleryItem,
  type PortfolioProject,
  type ProjectStatus,
} from '@/lib/projects-data';
import './Projects.css';

type GalleryItem = ReturnType<typeof toGalleryItem>;

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Completed: 'project-status--completed',
  'In Progress': 'project-status--progress',
  Experimental: 'project-status--experimental',
};

export default function Projects() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (selected) {
      document.body.classList.add('project-modal-open');
    } else {
      document.body.classList.remove('project-modal-open');
    }
    return () => {
      document.body.classList.remove('project-modal-open');
    };
  }, [selected]);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data: { projects?: PortfolioProject[] }) => {
        const list = (data.projects ?? []).map(toGalleryItem);
        setItems(list);
      })
      .catch(() => {
        setItems(mergeWithGithubRepos([]).map(toGalleryItem));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleItemClick = useCallback((index: number) => {
    setSelected(items[index] ?? null);
  }, [items]);

  const galleryItems = useMemo(
    () =>
      items.map(({ text, image, category, year, description, challenge, outcome, tech, links }) => ({
        text,
        image,
        category,
        year,
        description,
        challenge,
        outcome,
        tech,
        links,
      })),
    [items],
  );

  const project = selected?.project;

  return (
    <StorySection
      id="projects"
      className="relative z-20 w-full min-w-0 max-w-[100vw] py-12 sm:py-16 md:py-20 min-h-0 sm:min-h-screen overflow-hidden bg-transparent pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] sm:px-0"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-8 sm:pt-12 md:pt-20 text-center flex flex-col items-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-2 tracking-tight">
          MY Projects
        </h2>
        <p className="text-white/50 text-sm sm:text-base md:text-lg mb-2 max-w-2xl px-2">
          {loading
            ? 'Loading projects from GitHub…'
            : `${items.length} builds · Tap a card to explore · Drag or scroll to browse`}
        </p>
      </div>

      <div className="relative z-10 w-full max-w-[100vw] mx-auto h-[min(50vh,420px)] sm:h-[min(55vh,520px)] md:h-[600px]">
        {!loading && items.length > 0 && (
          <CircularGallery
            items={galleryItems}
            bend={0}
            textColor="#ffffff"
            borderRadius={0.13}
            scrollSpeed={5}
            scrollEase={0.15}
            font="bold 24px ui-monospace, monospace"
            onItemClick={handleItemClick}
          />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="project-shimmer h-48 w-48 rounded-3xl" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && project && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xl"
              onClick={() => setSelected(null)}
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 md:p-8 pointer-events-none pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
            >
              <div
                className="project-modal relative w-full min-w-0 max-w-4xl max-h-[min(92dvh,92svh)] overflow-y-auto overscroll-contain rounded-xl sm:rounded-3xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
              >
                <div className="relative h-48 sm:h-56 md:h-80 w-full min-w-0 overflow-hidden rounded-t-xl sm:rounded-t-3xl">
                  <img
                    src={selected.image}
                    alt={selected.text}
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition-colors backdrop-blur-md"
                    aria-label="Close"
                  >
                    ✕
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                    <span className={`project-status ${STATUS_STYLES[project.status]}`}>
                      {project.status}
                    </span>
                    <span className="text-xs font-mono tracking-widest text-white/70 bg-black/40 border border-white/15 px-3 py-1 rounded-full backdrop-blur-md">
                      {project.category} · {project.date}
                    </span>
                    {project.stars != null && project.stars > 0 && (
                      <span className="text-xs font-mono text-amber-200/90 bg-black/40 border border-amber-500/30 px-3 py-1 rounded-full">
                        ★ {project.stars}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight break-words">
                    {project.name}
                  </h3>

                  <p className="text-white/75 leading-relaxed text-base md:text-lg">
                    {project.description}
                  </p>

                  {project.highlights.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-3">
                        Highlights
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.highlights.map((h) => (
                          <li
                            key={h}
                            className="text-sm text-white/65 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="project-glass-panel">
                      <h4 className="text-xs font-mono tracking-widest text-[#ca12a8]/80 uppercase mb-3">
                        Problem
                      </h4>
                      <p className="text-white/65 leading-relaxed text-sm">{project.problem}</p>
                    </div>

                    <div className="project-glass-panel">
                      <h4 className="text-xs font-mono tracking-widest text-[#4ade80]/80 uppercase mb-3">
                        Solution
                      </h4>
                      <p className="text-white/65 leading-relaxed text-sm">{project.solution}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-3">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="project-tech-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                    <a
                      href={project.githubUrl || '#'}
                      target={project.githubUrl ? '_blank' : undefined}
                      rel={project.githubUrl ? 'noopener noreferrer' : undefined}
                      className="project-cta project-cta--github"
                      style={!project.githubUrl ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    >
                      GitHub →
                    </a>
                    <a
                      href={project.liveUrl || '#'}
                      target={project.liveUrl ? '_blank' : undefined}
                      rel={project.liveUrl ? 'noopener noreferrer' : undefined}
                      className="project-cta project-cta--live"
                      style={!project.liveUrl ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    >
                      Live Demo →
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </StorySection>
  );
}
