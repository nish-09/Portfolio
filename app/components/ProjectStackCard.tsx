'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiStar } from 'react-icons/fi';
import type { PortfolioProject } from '@/lib/projects-data';

const STATUS_STYLES = {
  Completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Experimental: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
};

interface ProjectStackCardProps {
  project: PortfolioProject;
  index: number;
}

export default function ProjectStackCard({ project, index }: ProjectStackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y, active: true });
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={() => setGlow((g) => ({ ...g, active: false }))}
      className="group relative mx-auto w-full max-w-6xl min-h-[min(82dvh,820px)] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden"
      style={{
        boxShadow: glow.active
          ? `0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(168,85,247,0.15)`
          : '0 20px 60px rgba(0,0,0,0.45)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: glow.active
            ? `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, rgba(168,85,247,0.18), transparent 45%)`
            : undefined,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
        style={{
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(255,255,255,0.05), rgba(245,158,11,0.2))',
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative grid h-full min-h-[min(82dvh,820px)] grid-cols-1 lg:grid-cols-2">
        <div className="relative h-56 sm:h-72 lg:h-full min-h-[240px] overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/30 lg:to-black/90" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLES[project.status]}`}>
              {project.status}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-white/60">
              {project.category}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-[10px] font-mono tracking-[0.35em] text-white/35 uppercase mb-2">
              Project {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {project.title}
            </h3>
            {project.stars > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/45 font-mono">
                <FiStar className="text-amber-400/80" aria-hidden />
                {project.stars} stars
              </p>
            )}
          </div>

          <p className="text-white/65 leading-relaxed text-sm sm:text-base max-w-xl">
            {project.longDescription || project.description}
          </p>

          {project.features.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/55">
              {project.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 8).map((t) => (
              <span
                key={t}
                className="text-[11px] font-mono text-white/75 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white/85 text-sm font-mono hover:bg-white/10 hover:border-purple-400/40 transition-all"
              >
                <FiGithub aria-hidden />
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-white text-sm font-mono hover:bg-purple-500/20 transition-all"
              >
                <FiExternalLink aria-hidden />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
