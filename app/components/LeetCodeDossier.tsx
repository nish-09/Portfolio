"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import "./LeetCodeDossier.css";

const LEETCODE_USERNAME = "Nish_Parikh";
const LEETCODE_PROFILE_URL = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;

interface MonthWeekLabel {
  label: string;
  week: number;
}

interface RecentSolution {
  title: string;
  titleSlug: string;
  difficulty: string;
  topics: string;
  lang: string;
  status: string;
  submittedAt: string;
  problemUrl: string;
  excerpt: string;
}

interface LeetCodeStats {
  username: string;
  totalSolved: number;
  totalProblems: number;
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
  ranking: number;
  reputation: number;
  submissions: {
    heatmap: Record<string, number>;
    weeks: number;
    monthWeeks: MonthWeekLabel[];
    startYear: number;
    totalAttempts: number;
    acceptedAttempts: number;
    acceptanceRate: number;
    totalSubmissionCount: number;
  };
  recentSolutions: RecentSolution[];
  contest: {
    rating: number | null;
    globalRanking: number | null;
    topPercentage: number | null;
    attendedContestsCount: number;
    badge: string | null;
    lastContest: string | null;
    note?: string;
  };
}

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

function formatRank(rank: number | null | undefined) {
  if (rank == null || rank <= 0) return "â€”";
  return `#${rank.toLocaleString()}`;
}

function difficultyClass(difficulty: string) {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "text-green-400 border-green-500/20 bg-green-500/5";
  if (d === "hard") return "text-rose-400 border-rose-500/20 bg-rose-500/5";
  return "text-amber-400 border-amber-500/20 bg-amber-500/5";
}

function SubmissionActivityTimeline({
  heatmap,
  weeks,
  monthWeeks,
  startYear,
  loading,
}: {
  heatmap: Record<string, number>;
  weeks: number;
  monthWeeks: MonthWeekLabel[];
  startYear: number;
  loading: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const maxVal = Math.max(...Object.values(heatmap), 1);
  const cellSize = 11;
  const gap = 3;
  const daysPerWeek = 7;
  const labelCol = 28;
  const w = labelCol + weeks * (cellSize + gap);
  const h = daysPerWeek * (cellSize + gap) + 22;
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  const hasActivity = Object.values(heatmap).some((c) => c > 0);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-black p-4 sm:p-5 glow-pulse-orange overflow-x-auto"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 min-w-[520px]">
        <h3 className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
          {startYear} Submission Activity
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-white/25">Less</span>
          {[0.06, 0.25, 0.5, 0.85].map((op, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: `rgba(245, 158, 11, ${op})` }}
            />
          ))}
          <span className="text-[8px] font-mono text-white/25">More</span>
        </div>
      </div>
      {loading ? (
        <div className="shimmer h-32 rounded-xl min-w-[520px]" />
      ) : !hasActivity ? (
        <p className="text-xs font-mono text-white/40 py-10 text-center min-w-[520px]">
          No submissions in the last year yet.
        </p>
      ) : (
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full min-w-[520px]"
          preserveAspectRatio="xMinYMin meet"
        >
          {dayLabels.map((label, i) =>
            label ? (
              <text
                key={i}
                x={0}
                y={18 + i * (cellSize + gap) + cellSize / 2}
                fill="rgba(255,255,255,0.25)"
                fontSize="7"
                fontFamily="ui-monospace, monospace"
                dominantBaseline="middle"
              >
                {label}
              </text>
            ) : null,
          )}
          {monthWeeks.map(({ label, week }) => (
            <text
              key={`${label}-${week}`}
              x={labelCol + week * (cellSize + gap)}
              y={9}
              fill="rgba(255,255,255,0.25)"
              fontSize="7"
              fontFamily="ui-monospace, monospace"
            >
              {label}
            </text>
          ))}
          {Array.from({ length: weeks }).map((_, week) =>
            Array.from({ length: daysPerWeek }).map((_, day) => {
              const key = `${week}-${day}`;
              const count = heatmap[key] || 0;
              const intensity = count / maxVal;
              const opacity = count === 0 ? 0.06 : 0.18 + intensity * 0.82;
              return (
                <rect
                  key={key}
                  x={labelCol + week * (cellSize + gap)}
                  y={16 + day * (cellSize + gap)}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill="#f59e0b"
                  opacity={inView ? opacity : 0.04}
                  style={{
                    transition: `opacity 0.35s ease ${(week * 7 + day) * 0.002}s`,
                  }}
                >
                  <title>{`${count} submission${count === 1 ? "" : "s"}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      )}
    </div>
  );
}

export default function LeetCodeDossier() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leetcode")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStats(data);
        setFetchError(null);
      })
      .catch((err: unknown) => {
        setStats(null);
        setFetchError(
          err instanceof Error ? err.message : "Failed to load LeetCode stats.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const totalSolved = stats?.totalSolved ?? 0;
  const totalProblems = stats?.totalProblems ?? 1;
  const easySolved = stats?.easy.solved ?? 0;
  const easyTotal = stats?.easy.total ?? 1;
  const mediumSolved = stats?.medium.solved ?? 0;
  const mediumTotal = stats?.medium.total ?? 1;
  const hardSolved = stats?.hard.solved ?? 0;
  const hardTotal = stats?.hard.total ?? 1;

  const solvePercentage = totalProblems
    ? Math.round((totalSolved / totalProblems) * 100)
    : 0;

  const contestRating = stats?.contest.rating;
  const contestRank =
    stats?.contest.globalRanking ?? stats?.ranking ?? null;
  const contestsAttended = stats?.contest.attendedContestsCount ?? 0;
  const recentSolutions = stats?.recentSolutions ?? [];
  const submissionHeatmap = stats?.submissions.heatmap ?? {};
  const submissionWeeks = stats?.submissions.weeks ?? 52;
  const submissionMonthWeeks = stats?.submissions.monthWeeks ?? [];
  const submissionStartYear = stats?.submissions.startYear ?? new Date().getFullYear();
  const acceptanceRate = stats?.submissions.acceptanceRate ?? 0;
  const totalAttempts = stats?.submissions.totalAttempts ?? 0;

  const radius = 64;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (solvePercentage / 100) * circumference;

  const selectedSolution =
    selectedIdx !== null ? recentSolutions[selectedIdx] : null;

  const handleCopyLink = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24 border-t border-white/8">
        
        {/* â”€â”€ Section Heading â”€â”€ */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] text-white/30 uppercase mb-3"
          >
            Algorithms & Problem Solving
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white"
          >
            LeetCode <span className="text-amber-500">Dossier</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-white/50 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2"
          >
            Live stats, submissions, contests, and recent solutions from LeetCode
          </motion.p>
          {stats && !loading && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] font-mono text-amber-500/70 mt-2 uppercase tracking-widest"
            >
              Live Â· @{stats.username}
            </motion.p>
          )}
          {fetchError && (
            <p className="text-xs font-mono text-rose-400/80 mt-3">{fetchError}</p>
          )}
        </div>

        {/* â”€â”€ Grid Layout â”€â”€ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* Column 1: Progress Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-black flex flex-col items-center hover:border-white/20 transition-all duration-300 shadow-xl glow-pulse-orange"
          >
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.483 0a1.39 1.39 0 0 0-.961.411l-9.12 9.119a1.37 1.37 0 0 0-.378.951c.002.375.155.73.43.995l9.12 9.123c.273.273.642.413 1.011.413.37 0 .739-.14 1.017-.419l9.12-9.122a1.37 1.37 0 0 0-.01-1.948L15.52.416A1.36 1.36 0 0 0 14.557 0h-1.074zm-2.429 8.443c.466 0 .845.378.845.845 0 .207-.075.405-.213.559l-2.907 3.228 2.903 3.223a.84.84 0 0 1 .217.56c0 .467-.379.846-.845.846-.245 0-.476-.109-.628-.297l-3.237-3.6a.834.834 0 0 1 0-1.116l3.237-3.6c.152-.187.383-.298.628-.298z" />
              </svg>
              Solve Progress
            </h3>

            {/* Circular Progress SVG */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Solved Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#orangeGradient)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Central Text */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-3xl font-mono font-bold text-white leading-none">
                  {loading ? "â€¦" : <AnimatedCounter value={totalSolved} />}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase mt-1">
                  Solved / {loading ? "â€¦" : totalProblems.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="w-full flex flex-col gap-4 mt-2">
              {/* Easy */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-green-400 font-bold">Easy</span>
                  <span className="text-white/60">
                    {loading ? "â€¦" : easySolved}{" "}
                    <span className="text-white/20">/ {loading ? "â€¦" : easyTotal.toLocaleString()}</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(easySolved / easyTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">Medium</span>
                  <span className="text-white/60">
                    {loading ? "â€¦" : mediumSolved}{" "}
                    <span className="text-white/20">/ {loading ? "â€¦" : mediumTotal.toLocaleString()}</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(mediumSolved / mediumTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Hard */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold">Hard</span>
                  <span className="text-white/60">
                    {loading ? "â€¦" : hardSolved}{" "}
                    <span className="text-white/20">/ {loading ? "â€¦" : hardTotal.toLocaleString()}</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(hardSolved / hardTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Contest Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-black flex flex-col hover:border-white/20 transition-all duration-300 shadow-xl glow-pulse-orange h-full"
          >
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Contest Metrics
            </h3>

            {/* Knight Badge Image/SVG */}
            <div className="flex flex-col items-center py-6 mb-6 rounded-xl border border-amber-500/10 bg-amber-500/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />
              {/* Custom Knight Badge Graphics */}
              <div className="w-20 h-20 mb-3 text-amber-400 relative flex items-center justify-center animate-pulse">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.6 15L12 15.6 9.6 18l-1.4-1.4 2.4-2.4L9 12.6l1.4-1.4 1.6 1.6L13.6 11l1.4 1.4-1.6 1.6 2.4 2.4-1.4 1.6zM12 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
                {/* Floating Glow Dot */}
                <div className="absolute w-2 h-2 rounded-full bg-amber-500 blur-sm top-4" />
              </div>
              <span className="text-xl font-mono font-extrabold text-amber-400 uppercase tracking-widest">
                {contestRating != null ? `${contestRating}` : "â€”"}
              </span>
              <span className="text-[10px] font-mono text-white/40 tracking-wider mt-0.5">
                {contestRating != null
                  ? "Contest rating"
                  : acceptanceRate > 0
                    ? `${acceptanceRate}% acceptance`
                    : "Global rank"}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Contest Rating</span>
                <span className="text-base font-mono font-bold text-white">
                  {loading ? "â€¦" : contestRating != null ? contestRating.toLocaleString() : "â€”"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Global Rank</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {loading ? "â€¦" : formatRank(contestRank)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Reputation</span>
                <span className="text-base font-mono font-bold text-white">
                  {loading ? "â€¦" : (stats?.reputation ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Total Attempts</span>
                <span className="text-base font-mono font-bold text-white">
                  {loading ? "â€¦" : totalAttempts}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs font-mono text-white/55">Acceptance Rate</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {loading ? "â€¦" : `${acceptanceRate}%`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs font-mono text-white/55">Contests Attended</span>
                <span className="text-base font-mono font-bold text-white">
                  {loading ? "â€¦" : contestsAttended}
                </span>
              </div>
              {stats?.contest.lastContest && (
                <p className="text-[10px] font-mono text-white/35 pt-1">
                  Last contest: {stats.contest.lastContest}
                </p>
              )}
              {stats?.contest.note && (
                <p className="text-[10px] font-mono text-white/30">{stats.contest.note}</p>
              )}
            </div>
          </motion.div>

          {/* Column 3: Recent accepted solutions (live) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-black flex flex-col hover:border-white/20 transition-all duration-300 shadow-xl glow-pulse-orange h-full lg:col-span-1"
          >
            <h3 className="text-lg font-mono font-bold tracking-wider text-white mb-6 uppercase flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recent Solutions
            </h3>

            <p className="text-xs text-white/45 mb-4 leading-relaxed font-mono">
              Latest accepted submissions from your profile:
            </p>

            <div className="flex flex-col gap-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="shimmer h-16 rounded-xl" />
                ))
              ) : recentSolutions.length === 0 ? (
                <p className="text-xs font-mono text-white/40 py-4 text-center">
                  No accepted solutions yet.
                </p>
              ) : (
                recentSolutions.map((sol, i) => (
                  <button
                    key={sol.titleSlug}
                    type="button"
                    onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left font-mono ${
                      selectedIdx === i
                        ? "border-amber-500/40 bg-amber-500/5 text-amber-400"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate mb-1">{sol.title}</div>
                      <div className="text-[10px] text-white/40 truncate">
                        {sol.topics} Â· {sol.lang}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 border rounded-full font-bold ml-2 shrink-0 ${difficultyClass(sol.difficulty)}`}
                    >
                      {sol.difficulty}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <a
                href={LEETCODE_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-white/30 hover:text-amber-400 transition-colors duration-200 uppercase tracking-wider"
              >
                View LeetCode Profile
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6"
        >
          <SubmissionActivityTimeline
            heatmap={submissionHeatmap}
            weeks={submissionWeeks}
            monthWeeks={submissionMonthWeeks}
            startYear={submissionStartYear}
            loading={loading}
          />
        </motion.div>

        <AnimatePresence>
          {selectedSolution && selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mt-6 rounded-2xl border border-amber-500/20 bg-black overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black">
                <div className="flex flex-wrap items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-white truncate">
                    {selectedSolution.title}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    {selectedSolution.lang} Â· {selectedSolution.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyLink(selectedSolution.problemUrl, selectedIdx)
                    }
                    className="text-[10px] font-mono px-3 py-1 rounded bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {copiedIdx === selectedIdx ? "Copied!" : "Copy link"}
                  </button>
                  <a
                    href={selectedSolution.problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all"
                  >
                    Open on LC
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedIdx(null)}
                    className="text-white/40 hover:text-white font-mono text-xs"
                    aria-label="Close detail"
                  >
                    âœ•
                  </button>
                </div>
              </div>
              <div className="p-5 font-mono space-y-3">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                  {selectedSolution.topics}
                </p>
                {selectedSolution.excerpt ? (
                  <p className="text-xs text-white/50 leading-relaxed">
                    {selectedSolution.excerpt}
                  </p>
                ) : null}
                <p className="text-[10px] text-white/35">
                  Submitted{" "}
                  {new Date(selectedSolution.submittedAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
}
