import { NextResponse } from "next/server";

const LEETCODE_USERNAME = "Nish_Parikh";
const ALFA_BASE = "https://alfa-leetcode-api.onrender.com";

type SolvedPayload = {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acSubmissionNum?: { difficulty: string; count: number; submissions: number }[];
  totalSubmissionNum?: { difficulty: string; count: number; submissions: number }[];
};

type ProfilePayload = {
  username: string;
  ranking: number;
  reputation: number;
  name: string;
};

type ProblemsPayload = {
  totalQuestions: number;
};

type SubmissionRow = {
  title: string;
  titleSlug: string;
  timestamp: string | number;
  statusDisplay: string;
  lang: string;
};

type SubmissionsPayload = {
  count: number;
  submission: SubmissionRow[];
};

type ContestPayload = {
  contestParticipation?: {
    rating: number;
    ranking: number;
    contest: { title: string };
  }[];
};

type SelectPayload = {
  questionTitle: string;
  titleSlug: string;
  difficulty: string;
  topicTags?: { name: string }[];
  question?: string;
};

async function fetchAlfa<T>(path: string): Promise<T> {
  const res = await fetch(`${ALFA_BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    throw new Error(`LeetCode data source error (${res.status})`);
  }

  return res.json() as Promise<T>;
}

function splitQuestionTotals(total: number) {
  const easy = Math.round(total * 0.244);
  const medium = Math.round(total * 0.518);
  const hard = Math.max(0, total - easy - medium);
  return { easy, medium, hard, all: total };
}

const WEEKS = 52;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildSubmissionHeatmap(submissions: SubmissionRow[]) {
  const heatmap: Record<string, number> = {};
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (WEEKS - 1) * 7);

  for (const sub of submissions) {
    const date = new Date(Number(sub.timestamp) * 1000);
    if (date < start || date > now) continue;
    const dayIndex = Math.floor(
      (date.getTime() - start.getTime()) / 86400000,
    );
    if (dayIndex < 0 || dayIndex >= WEEKS * 7) continue;
    const week = Math.floor(dayIndex / 7);
    const day = date.getDay();
    const key = `${week}-${day}`;
    heatmap[key] = (heatmap[key] || 0) + 1;
  }

  const monthWeeks: { label: string; week: number }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    const weekDate = new Date(start);
    weekDate.setDate(weekDate.getDate() + w * 7);
    const label = MONTHS[weekDate.getMonth()];
    const prev = monthWeeks[monthWeeks.length - 1];
    if (!prev || prev.label !== label) {
      monthWeeks.push({ label, week: w });
    }
  }

  return { heatmap, weeks: WEEKS, monthWeeks, startYear: start.getFullYear() };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);
}

async function enrichSubmission(sub: SubmissionRow) {
  try {
    const detail = await fetchAlfa<SelectPayload>(
      `/select?titleSlug=${encodeURIComponent(sub.titleSlug)}`,
    );
    const topics =
      detail.topicTags?.map((t) => t.name).join(", ") ?? "Algorithms";
    return {
      title: detail.questionTitle ?? sub.title,
      titleSlug: sub.titleSlug,
      difficulty: detail.difficulty ?? "Medium",
      topics,
      lang: sub.lang,
      status: sub.statusDisplay,
      submittedAt: new Date(Number(sub.timestamp) * 1000).toISOString(),
      problemUrl: `https://leetcode.com/problems/${sub.titleSlug}/`,
      excerpt: detail.question ? stripHtml(detail.question) : "",
    };
  } catch {
    return {
      title: sub.title,
      titleSlug: sub.titleSlug,
      difficulty: "Medium",
      topics: "Algorithms",
      lang: sub.lang,
      status: sub.statusDisplay,
      submittedAt: new Date(Number(sub.timestamp) * 1000).toISOString(),
      problemUrl: `https://leetcode.com/problems/${sub.titleSlug}/`,
      excerpt: "",
    };
  }
}

export async function GET() {
  try {
    const [profile, solved, problems, allSubmissions, acSubmissions, contest] =
      await Promise.all([
        fetchAlfa<ProfilePayload>(`/${LEETCODE_USERNAME}`),
        fetchAlfa<SolvedPayload>(`/${LEETCODE_USERNAME}/solved`),
        fetchAlfa<ProblemsPayload>("/problems?limit=1"),
        fetchAlfa<SubmissionsPayload>(`/${LEETCODE_USERNAME}/submission`),
        fetchAlfa<SubmissionsPayload>(`/${LEETCODE_USERNAME}/acSubmission`).catch(
          () => ({ count: 0, submission: [] }),
        ),
        fetchAlfa<ContestPayload>(`/${LEETCODE_USERNAME}/contest`).catch(
          () => ({ contestParticipation: [] }),
        ),
      ]);

    const totals = splitQuestionTotals(problems.totalQuestions ?? 3696);
    const submissions = allSubmissions.submission ?? [];
    const acceptedSubs = acSubmissions.submission ?? [];

    const submissionTimeline = buildSubmissionHeatmap(submissions);
    const totalAttempts = submissions.length;
    const acceptedAttempts = submissions.filter(
      (s) => s.statusDisplay === "Accepted",
    ).length;
    const acceptanceRate =
      totalAttempts > 0 ? Math.round((acceptedAttempts / totalAttempts) * 100) : 0;

    const uniqueAc = new Map<string, SubmissionRow>();
    for (const sub of acceptedSubs) {
      if (!uniqueAc.has(sub.titleSlug)) uniqueAc.set(sub.titleSlug, sub);
    }
    const recentRaw = Array.from(uniqueAc.values()).slice(0, 6);
    const recentSolutions = await Promise.all(recentRaw.map(enrichSubmission));

    const latestContest = contest.contestParticipation?.[0];
    const totalSubmissionCount =
      solved.totalSubmissionNum?.find((r) => r.difficulty === "All")?.submissions ??
      totalAttempts;

    return NextResponse.json({
      username: profile.username ?? LEETCODE_USERNAME,
      name: profile.name,
      totalSolved: solved.solvedProblem,
      totalProblems: totals.all,
      easy: { solved: solved.easySolved, total: totals.easy },
      medium: { solved: solved.mediumSolved, total: totals.medium },
      hard: { solved: solved.hardSolved, total: totals.hard },
      ranking: profile.ranking,
      reputation: profile.reputation,
      submissions: {
        heatmap: submissionTimeline.heatmap,
        weeks: submissionTimeline.weeks,
        monthWeeks: submissionTimeline.monthWeeks,
        startYear: submissionTimeline.startYear,
        totalAttempts,
        acceptedAttempts,
        acceptanceRate,
        totalSubmissionCount,
      },
      recentSolutions,
      contest: latestContest
        ? {
            rating: Math.round(latestContest.rating),
            globalRanking: latestContest.ranking,
            topPercentage: null,
            attendedContestsCount: contest.contestParticipation?.length ?? 0,
            badge: null,
            lastContest: latestContest.contest?.title ?? null,
          }
        : {
            rating: null,
            globalRanking: profile.ranking > 0 ? profile.ranking : null,
            topPercentage: null,
            attendedContestsCount: 0,
            badge: null,
            lastContest: null,
            note: "No contests yet — showing profile global rank",
          },
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("LeetCode API error:", err);
    return NextResponse.json(
      { error: "Failed to load live LeetCode stats." },
      { status: 500 },
    );
  }
}
