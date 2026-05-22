"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { getGithubEvents, GITHUB_USERNAME, type GithubEvent } from "@/lib/github-data";
import "./GitHubStats.css";

interface MonthlyData {
  label: string;
  count: number;
}

interface HourData {
  hour: number;
  count: number;
}

interface DayData {
  day: string;
  count: number;
}

interface BreakdownData {
  label: string;
  value: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── Utility: process events into chart data ──────────────────────────────────
function processEvents(events: GithubEvent[]) {
  // Monthly activity trend (last 12 months)
  const monthCounts = new Map<string, number>();
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    monthCounts.set(key, 0);
  }

  // Hour distribution
  const hourCounts = new Array(24).fill(0);

  // Day-of-week distribution
  const dayCounts = new Array(7).fill(0);

  // Activity breakdown
  const breakdown: Record<string, number> = {
    Commits: 0,
    PRs: 0,
    Issues: 0,
    Repos: 0,
  };
  const repoSet = new Set<string>();

  // Heatmap: day-of-year contribution intensity
  const heatmapData: Record<string, number> = {};

  for (const evt of events) {
    const date = new Date(evt.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
    if (monthCounts.has(monthKey)) {
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    }

    hourCounts[date.getHours()]++;
    dayCounts[date.getDay()]++;

    // breakdown
    if (evt.type === "PushEvent") breakdown.Commits++;
    else if (evt.type === "PullRequestEvent") breakdown.PRs++;
    else if (evt.type === "IssuesEvent") breakdown.Issues++;
    if (evt.repo?.name) repoSet.add(evt.repo.name);

    // heatmap key: "week-day"
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const weekNum = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (7 * 86400000)
    );
    const heatKey = `${weekNum}-${date.getDay()}`;
    heatmapData[heatKey] = (heatmapData[heatKey] || 0) + 1;
  }

  const monthly: MonthlyData[] = [];
  for (const [key, count] of monthCounts) {
    const [, m] = key.split("-");
    monthly.push({ label: MONTHS[parseInt(m)], count });
  }

  const hourly: HourData[] = hourCounts.map((count, hour) => ({ hour, count }));
  const daily: DayData[] = dayCounts.map((count, i) => ({ day: DAYS[i], count }));
  breakdown.Repos = repoSet.size;
  const breakdownArr: BreakdownData[] = Object.entries(breakdown).map(([label, value]) => ({
    label,
    value,
  }));

  return { monthly, hourly, daily, breakdownArr, heatmapData };
}

// ─── Stat Pill ─────────────────────────────────────────────────────────────────
function MiniStatPill({
  value,
  label,
  delay,
}: {
  value: string | number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border border-purple-500/20 bg-purple-500/5"
    >
      <span className="text-lg sm:text-xl font-bold text-white tabular-nums font-mono">
        {value}
      </span>
      <span className="text-[9px] font-mono tracking-widest text-white/35 uppercase">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Activity Trend Line Chart ─────────────────────────────────────────────────
function ActivityTrendChart({ data }: { data: MonthlyData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const w = 280;
  const h = 100;
  const padX = 0;
  const padY = 8;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padY + chartH - (d.count / maxVal) * chartH;
    return { x, y };
  });

  // Smooth curve path using cubic bezier
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    pathD += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 glow-pulse-purple">
      <h4 className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">
        Activity Trend
      </h4>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(168,85,247,0.3)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={padX}
            y1={padY + chartH * (1 - frac)}
            x2={w - padX}
            y2={padY + chartH * (1 - frac)}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={0.5}
          />
        ))}
        {/* Area fill */}
        <path
          d={areaD}
          fill="url(#trendGrad)"
          opacity={inView ? 1 : 0}
          style={{ transition: "opacity 0.8s ease" }}
        />
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#a855f7"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={inView ? 1 : 0}
          strokeDasharray={inView ? "none" : "1000"}
          strokeDashoffset={inView ? 0 : 1000}
          style={{ transition: "all 1.2s ease" }}
        />
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            fill="#a855f7"
            opacity={inView ? 0.8 : 0}
            style={{ transition: `opacity 0.4s ease ${i * 0.05}s` }}
          />
        ))}
      </svg>
      {/* Month labels */}
      <div className="flex justify-between mt-1.5 px-0.5">
        {data.map((d, i) =>
          i % 2 === 0 ? (
            <span key={i} className="text-[8px] font-mono text-white/25">
              {d.label}
            </span>
          ) : (
            <span key={i} />
          )
        )}
      </div>
    </div>
  );
}

// ─── Commit Hours Bar Chart ────────────────────────────────────────────────────
function CommitHoursChart({ data }: { data: HourData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const barW = 8;
  const gap = 3.5;
  const chartH = 80;
  const w = data.length * (barW + gap);

  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 glow-pulse-purple">
      <h4 className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">
        Commit Hours (UTC)
      </h4>
      <svg
        viewBox={`0 0 ${w} ${chartH}`}
        className="w-full"
        preserveAspectRatio="xMidYEnd meet"
      >
        {data.map((d, i) => {
          const barH = Math.max((d.count / maxVal) * (chartH - 4), 2);
          return (
            <rect
              key={i}
              x={i * (barW + gap)}
              y={chartH - barH}
              width={barW}
              height={barH}
              rx={2}
              fill="#a855f7"
              opacity={inView ? 0.3 + (d.count / maxVal) * 0.7 : 0}
              style={{ transition: `opacity 0.4s ease ${i * 0.02}s` }}
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-1.5">
        {[0, 6, 12, 18, 23].map((h) => (
          <span key={h} className="text-[8px] font-mono text-white/25">
            {h}:00
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Breakdown Radar Chart ────────────────────────────────────────────
function BreakdownRadar({ data }: { data: BreakdownData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 55;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const angles = data.map((_, i) => (i / data.length) * Math.PI * 2 - Math.PI / 2);

  // Radar polygon points
  const radarPoints = data
    .map((d, i) => {
      const r = (d.value / maxVal) * maxR;
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);
      return `${x},${y}`;
    })
    .join(" ");

  // Grid rings
  const rings = [0.33, 0.66, 1];

  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 glow-pulse-purple">
      <h4 className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">
        Activity Breakdown
      </h4>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto">
        {/* Grid rings */}
        {rings.map((frac) => (
          <polygon
            key={frac}
            points={angles
              .map((a) => {
                const r = frac * maxR;
                return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={0.5}
          />
        ))}
        {/* Axis lines */}
        {angles.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(a)}
            y2={cy + maxR * Math.sin(a)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={0.5}
          />
        ))}
        {/* Data polygon */}
        <polygon
          points={radarPoints}
          fill="rgba(168,85,247,0.15)"
          stroke="#a855f7"
          strokeWidth={1.5}
          opacity={inView ? 1 : 0}
          style={{ transition: "opacity 0.8s ease 0.2s" }}
        />
        {/* Data points */}
        {data.map((d, i) => {
          const r = (d.value / maxVal) * maxR;
          const x = cx + r * Math.cos(angles[i]);
          const y = cy + r * Math.sin(angles[i]);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              fill="#a855f7"
              opacity={inView ? 1 : 0}
              style={{ transition: `opacity 0.4s ease ${0.3 + i * 0.1}s` }}
            />
          );
        })}
        {/* Labels */}
        {data.map((d, i) => {
          const labelR = maxR + 16;
          const x = cx + labelR * Math.cos(angles[i]);
          const y = cy + labelR * Math.sin(angles[i]);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white/50"
              style={{ fontSize: "8px", fontFamily: "monospace" }}
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Weekly Momentum Bar Chart ─────────────────────────────────────────────────
function WeeklyMomentum({ data }: { data: DayData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const barW = 24;
  const gap = 8;
  const chartH = 80;
  const w = data.length * (barW + gap);

  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 glow-pulse-purple">
      <h4 className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">
        Weekly Momentum
      </h4>
      <svg
        viewBox={`0 0 ${w} ${chartH}`}
        className="w-full"
        preserveAspectRatio="xMidYEnd meet"
      >
        {data.map((d, i) => {
          const barH = Math.max((d.count / maxVal) * (chartH - 4), 3);
          return (
            <rect
              key={i}
              x={i * (barW + gap)}
              y={chartH - barH}
              width={barW}
              height={barH}
              rx={3}
              fill="#a855f7"
              opacity={inView ? 0.35 + (d.count / maxVal) * 0.65 : 0}
              style={{ transition: `opacity 0.4s ease ${i * 0.05}s` }}
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-1.5 px-0.5">
        {data.map((d) => (
          <span key={d.day} className="text-[8px] font-mono text-white/25 w-6 text-center">
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Contribution Heatmap ──────────────────────────────────────────────────────
function ContributionHeatmap({ heatmap }: { heatmap: Record<string, number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const maxVal = Math.max(...Object.values(heatmap), 1);
  const cellSize = 10;
  const gap = 2;
  const weeks = 52;
  const daysPerWeek = 7;
  const w = weeks * (cellSize + gap) + 30; // extra space for day labels
  const h = daysPerWeek * (cellSize + gap) + 20; // extra for month labels

  // Only show Mon, Wed, Fri labels
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 glow-pulse-purple overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
          {new Date().getFullYear()} Activity Timeline
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-white/25">Less</span>
          {[0.05, 0.2, 0.5, 0.8].map((op, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: `rgba(168, 85, 247, ${op})` }}
            />
          ))}
          <span className="text-[8px] font-mono text-white/25">More</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full min-w-[600px]"
        preserveAspectRatio="xMinYMin meet"
      >
        {/* Day labels */}
        {dayLabels.map((label, i) =>
          label ? (
            <text
              key={i}
              x={0}
              y={20 + i * (cellSize + gap) + cellSize / 2}
              className="fill-white/25"
              style={{ fontSize: "7px", fontFamily: "monospace" }}
              dominantBaseline="middle"
            >
              {label}
            </text>
          ) : null
        )}
        {/* Month labels at top */}
        {MONTHS.map((m, i) => {
          const weekStart = Math.floor((i / 12) * weeks);
          return (
            <text
              key={m}
              x={30 + weekStart * (cellSize + gap)}
              y={10}
              className="fill-white/25"
              style={{ fontSize: "7px", fontFamily: "monospace" }}
            >
              {m}
            </text>
          );
        })}
        {/* Cells */}
        {Array.from({ length: weeks }).map((_, week) =>
          Array.from({ length: daysPerWeek }).map((_, day) => {
            const key = `${week}-${day}`;
            const count = heatmap[key] || 0;
            const intensity = count / maxVal;
            const opacity = count === 0 ? 0.05 : 0.15 + intensity * 0.85;
            return (
              <rect
                key={key}
                x={30 + week * (cellSize + gap)}
                y={20 + day * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill="#a855f7"
                opacity={inView ? opacity : 0.02}
                style={{
                  transition: `opacity 0.3s ease ${(week * 7 + day) * 0.002}s`,
                }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────
export default function GitHubActivityGraphs() {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGithubEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const { monthly, hourly, daily, breakdownArr, heatmapData } = useMemo(
    () => processEvents(events),
    [events]
  );

  const totalContribs = events.length;
  const currentStreak = useMemo(() => {
    if (events.length === 0) return 0;
    const dates = new Set(
      events.map((e) => new Date(e.created_at).toISOString().slice(0, 10))
    );
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (dates.has(key)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  }, [events]);

  if (loading) {
    return (
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shimmer rounded-xl border border-white/8 bg-white/[0.02] h-40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 flex flex-col gap-5">
      {/* Header row — profile ring + stat pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center gap-5"
      >
        {/* Profile ring */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-purple-500/50 flex items-center justify-center overflow-hidden">
              <img
                src={`https://github.com/${GITHUB_USERNAME}.png?size=56`}
                alt={GITHUB_USERNAME}
                width={56}
                height={56}
                className="rounded-full"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0d14]" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Contribution Activity
            </h3>
            <p className="text-[10px] font-mono text-white/35 uppercase tracking-wider">
              Dossier: {GITHUB_USERNAME}
            </p>
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex gap-3 sm:ml-auto">
          <MiniStatPill value={totalContribs} label="Events" delay={0.05} />
          <MiniStatPill value={currentStreak} label="Current Streak" delay={0.1} />
          <MiniStatPill
            value={new Set(events.map((e) => e.repo.name)).size}
            label="Active Repos"
            delay={0.15}
          />
        </div>
      </motion.div>

      {/* Charts Grid — 2×2 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <ActivityTrendChart data={monthly} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <CommitHoursChart data={hourly} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <BreakdownRadar data={breakdownArr} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <WeeklyMomentum data={daily} />
        </motion.div>
      </div>

      {/* Heatmap — full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <ContributionHeatmap heatmap={heatmapData} />
      </motion.div>
    </div>
  );
}
