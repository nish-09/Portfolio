"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { StorySection } from "./StorySection";
import "./GitHubStats.css";

// ─── Config ────────────────────────────────────────────────────────────────────
const GITHUB_USERNAME = "nish-09";
const STATS_THEME = "transparent&title_color=ffffff&text_color=ffffff99&icon_color=a855f7&border_color=ffffff15&bg_color=0d0d14";
const STREAK_THEME = "background=0d0d14&sideNums=ffffff&sideLabels=ffffff66&dates=ffffff44&ring=a855f7&fire=a855f7&currStreakNum=ffffff&currStreakLabel=a855f7&border=ffffff15";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1400;
    const step = (timestamp: number, startTime: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ─── Card Skeleton ─────────────────────────────────────────────────────────────
function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`shimmer rounded-2xl border border-white/10 bg-white/5 ${className}`}
    />
  );
}

// ─── Stats SVG Card ────────────────────────────────────────────────────────────
function StatsSvgCard({
  src,
  alt,
  className = "",
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.015 }}
      className={`relative rounded-2xl border border-white/10 bg-[#0d0d14] overflow-hidden transition-all duration-300 hover:border-white/20 glow-pulse-purple ${className}`}
    >
      {!loaded && <CardSkeleton className="absolute inset-0 rounded-2xl border-0" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-contain transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
      />
    </motion.div>
  );
}

// ─── Repo Card ─────────────────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  HTML: "#e34f26",
  CSS: "#1572b6",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  "C++": "#f34b7d",
  Shell: "#89e051",
};

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "#ffffff50") : "#ffffff30";
  const updatedDate = new Date(repo.updated_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${repo.name} on GitHub`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, scale: 1.015 }}
      className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-white/10 bg-[#0d0d14] hover:border-white/20 hover:bg-white/5 transition-all duration-300 cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <svg
            className="w-4 h-4 text-white/40 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
          </svg>
          <span className="text-sm font-mono font-semibold text-white truncate group-hover:text-purple-400 transition-colors duration-200">
            {repo.name}
          </span>
        </div>
        <svg
          className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 shrink-0 transition-colors duration-200 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>

      {/* Description */}
      <p className="text-xs text-white/50 leading-relaxed line-clamp-2 flex-1">
        {repo.description ?? "No description provided."}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono text-purple-400/80 border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Bottom stats */}
      <div className="flex items-center gap-4 pt-1 border-t border-white/5">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: langColor }}
              aria-hidden="true"
            />
            <span className="text-[11px] text-white/45 font-mono">{repo.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-white/35" aria-label={`${repo.stargazers_count} stars`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[11px] font-mono">{repo.stargazers_count}</span>
        </div>
        <div className="flex items-center gap-1 text-white/35" aria-label={`${repo.forks_count} forks`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h.01M8 12h.01M16 7h.01M16 12a4 4 0 01-4 4m0 0a4 4 0 01-4-4m4 4v4m-4-4a4 4 0 014-4m0 0a4 4 0 014 4" />
          </svg>
          <span className="text-[11px] font-mono">{repo.forks_count}</span>
        </div>
        <span className="ml-auto text-[10px] text-white/25 font-mono">{updatedDate}</span>
      </div>
    </motion.a>
  );
}

// ─── Snake Strip ───────────────────────────────────────────────────────────────
function SnakeStrip() {
  const [loaded, setLoaded] = useState(false);
  const snakeSrc = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}/output/github-contribution-grid-snake-dark.svg`;
  const fallbackSrc = `https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake-dark.svg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-2xl border border-white/10 bg-[#0d0d14] overflow-hidden relative"
      aria-label="GitHub contribution snake animation"
    >
      {/* Label */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
        <span className="text-xs font-mono tracking-widest text-white/30 uppercase">
          Contribution Snake
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500/70 animate-pulse" aria-hidden="true" />
      </div>

      {/* Snake — doubles itself for seamless loop */}
      <div className="overflow-hidden py-3 relative">
        {!loaded && (
          <div className="shimmer h-20 mx-4 rounded-xl" />
        )}
        <div
          className={`flex snake-drift transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        >
          {/* Two copies for seamless loop */}
          {[0, 1].map((i) => (
            <img
              key={i}
              src={snakeSrc}
              alt=""
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                // fallback to platane demo snake on error
                const t = e.currentTarget;
                if (!t.src.includes("platane")) {
                  t.src = fallbackSrc;
                }
              }}
              className="h-20 sm:h-24 w-auto shrink-0"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Profile Summary ───────────────────────────────────────────────────────────
function ProfileSummary() {
  return (
    <motion.a
      href={`https://github.com/${GITHUB_USERNAME}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit GitHub profile"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#0d0d14] hover:border-white/20 hover:bg-white/5 transition-all duration-300"
    >
      <div className="relative shrink-0">
        <img
          src={`https://github.com/${GITHUB_USERNAME}.png?size=80`}
          alt={`${GITHUB_USERNAME} GitHub avatar`}
          width={52}
          height={52}
          className="rounded-full border border-white/10"
          loading="lazy"
        />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0d0d14]"
          aria-label="Active"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-mono font-bold text-white group-hover:text-purple-400 transition-colors duration-200 truncate">
            {GITHUB_USERNAME}
          </span>
          <span className="text-[10px] font-mono text-white/25 border border-white/10 px-1.5 py-0.5 rounded-full shrink-0">
            Public
          </span>
        </div>
        <p className="text-xs text-white/45 truncate">Open source developer · India 🇮🇳</p>
      </div>
      <svg
        className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors duration-200 shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    </motion.a>
  );
}

// ─── Inline Stat Pill ──────────────────────────────────────────────────────────
function StatPill({
  label,
  value,
  suffix,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1 px-5 py-4 rounded-2xl border border-white/10 bg-white/5"
    >
      <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
        <AnimatedCounter value={value} suffix={suffix} />
      </span>
      <span className="text-[10px] font-mono tracking-widest text-white/35 uppercase">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function GitHubStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });

  const sectionOpacity = useTransform(smoothProgress, [0.03, 0.18, 0.88, 0.97], [0, 1, 1, 0]);
  const sectionY = useTransform(smoothProgress, [0.03, 0.18, 0.88, 0.97], [50, 0, 0, -50]);

  const [repos, setRepos] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=8&type=public`
    )
      .then((r) => r.json())
      .then((data: Repo[]) => {
        if (Array.isArray(data)) {
          setRepos(data.slice(0, 6));
        }
      })
      .catch(() => setRepos([]))
      .finally(() => setReposLoading(false));
  }, []);

  const statsBase = "https://github-readme-stats.vercel.app/api";
  const statsUrl = `${statsBase}?username=${GITHUB_USERNAME}&show_icons=true&count_private=true&include_all_commits=true&hide_border=true&${STATS_THEME}&card_width=400`;
  const langsUrl = `${statsBase}/top-langs?username=${GITHUB_USERNAME}&layout=compact&hide_border=true&langs_count=8&${STATS_THEME}&card_width=400`;
  const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&hide_border=true&${STREAK_THEME}&card_width=400`;

  return (
    <div ref={containerRef} className="w-full">
      <StorySection
        id="github"
        className="relative w-full min-w-0 max-w-[100vw] py-12 sm:py-16 md:py-20 lg:py-24 px-[max(1rem,env(safe-area-inset-left,0px))] overflow-hidden bg-transparent"
      >
        <motion.div style={{ opacity: sectionOpacity, y: sectionY }} className="w-full max-w-7xl mx-auto">

          {/* ── Section Heading ── */}
          <div className="text-center mb-10 sm:mb-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] text-white/30 uppercase mb-3"
            >
              Open Source Activity
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white"
            >
              GitHub <span className="text-purple-500">Stats</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-white/50 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2"
            >
              A live snapshot of my open-source contributions and activity
            </motion.p>
          </div>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

            {/* Row 1 col 1-2: Profile + Pills */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <ProfileSummary />

              {/* Quick stat pills */}
              <div className="grid grid-cols-3 gap-3">
                <StatPill label="Public Repos" value={repos.length > 0 ? repos.length + 2 : 12} delay={0.1} />
                <StatPill label="Total Stars" value={repos.reduce((s, r) => s + r.stargazers_count, 0)} suffix="+" delay={0.18} />
                <StatPill label="Forks" value={repos.reduce((s, r) => s + r.forks_count, 0)} delay={0.26} />
              </div>
            </div>

            {/* Row 1 col 3: Languages */}
            <StatsSvgCard
              src={langsUrl}
              alt="Top Programming Languages"
              className="min-h-[180px]"
              delay={0.1}
            />

            {/* Row 2: Stats card */}
            <StatsSvgCard
              src={statsUrl}
              alt="GitHub Statistics"
              className="lg:col-span-2 min-h-[180px]"
              delay={0.12}
            />

            {/* Row 2 col 3: Streak */}
            <StatsSvgCard
              src={streakUrl}
              alt="GitHub Streak Stats"
              className="min-h-[180px]"
              delay={0.2}
            />

            {/* Row 3: Snake full-width */}
            <div className="lg:col-span-3">
              <SnakeStrip />
            </div>

            {/* Row 4: Repo Cards */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="text-xs font-mono tracking-widest text-white/30 uppercase">
                  Featured Repositories
                </span>
                <div className="flex-1 h-px bg-white/8" />
                <a
                  href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-white/30 hover:text-purple-400 transition-colors duration-200 uppercase tracking-wider"
                >
                  View all →
                </a>
              </motion.div>

              {reposLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} className="h-44" />
                  ))}
                </div>
              ) : repos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repos.map((repo, i) => (
                    <RepoCard key={repo.id} repo={repo} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-sm font-mono text-center py-8">
                  Could not load repositories.
                </p>
              )}
            </div>

            {/* Row 5: CTA */}
            <div className="lg:col-span-3 flex justify-center pt-2">
              <motion.a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/20 text-white/80 text-sm font-mono hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View Full Profile
              </motion.a>
            </div>

          </div>
        </motion.div>
      </StorySection>
    </div>
  );
}
