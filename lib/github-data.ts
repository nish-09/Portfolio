export const GITHUB_USERNAME = "nish-09";

export const STATS_THEME =
  "transparent&title_color=ffffff&text_color=ffffff99&icon_color=a855f7&border_color=ffffff15&bg_color=0d0d14";
export const STREAK_THEME =
  "background=0d0d14&sideNums=ffffff&sideLabels=ffffff66&dates=ffffff44&ring=a855f7&fire=a855f7&currStreakNum=ffffff&currStreakLabel=a855f7&border=ffffff15";

const STATS_BASE = "https://gh-stats.com/api";

export const GITHUB_STATS_URLS = {
  stats: `${STATS_BASE}?username=${GITHUB_USERNAME}&show_icons=true&count_private=true&include_all_commits=true&hide_border=true&${STATS_THEME}&card_width=400`,
  langs: `${STATS_BASE}/top-langs?username=${GITHUB_USERNAME}&layout=compact&hide_border=true&langs_count=8&${STATS_THEME}&card_width=400`,
  streak: `https://streak-stats.demolab.com/?user=${GITHUB_USERNAME}&hide_border=true&${STREAK_THEME}&card_width=400`,
  snake: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}/output/github-contribution-grid-snake-dark.svg`,
  snakeFallback:
    "https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake-dark.svg",
  avatar: `https://github.com/${GITHUB_USERNAME}.png?size=80`,
} as const;

export interface GithubRepo {
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

export interface GithubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

let reposPromise: Promise<GithubRepo[]> | null = null;
let eventsPromise: Promise<GithubEvent[]> | null = null;
let assetsPromise: Promise<void> | null = null;
const preloadedImages = new Set<string>();

async function fetchRepos(): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=8&type=public`,
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.slice(0, 6);
}

async function fetchEvents(): Promise<GithubEvent[]> {
  const pages = [1, 2, 3];
  const results = await Promise.all(
    pages.map((p) =>
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30&page=${p}`,
      ).then((r) => r.json()),
    ),
  );
  return results.flat().filter((e: unknown) => e && typeof e === "object" && "type" in e) as GithubEvent[];
}

function preloadImage(url: string): Promise<void> {
  if (preloadedImages.has(url)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      preloadedImages.add(url);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = url;
  });
}

async function preloadAssets(): Promise<void> {
  await preloadImage(GITHUB_STATS_URLS.avatar);
  await preloadImage(GITHUB_STATS_URLS.snake);
  if (!preloadedImages.has(GITHUB_STATS_URLS.snake)) {
    await preloadImage(GITHUB_STATS_URLS.snakeFallback);
  }
}

export function preloadGithubData(): Promise<void> {
  if (!reposPromise) reposPromise = fetchRepos().catch(() => []);
  if (!eventsPromise) eventsPromise = fetchEvents().catch(() => []);
  if (!assetsPromise) assetsPromise = preloadAssets();
  return Promise.all([reposPromise, eventsPromise, assetsPromise]).then(() => undefined);
}

export function getGithubRepos(): Promise<GithubRepo[]> {
  if (!reposPromise) reposPromise = fetchRepos().catch(() => []);
  return reposPromise;
}

export function getGithubEvents(): Promise<GithubEvent[]> {
  if (!eventsPromise) eventsPromise = fetchEvents().catch(() => []);
  return eventsPromise;
}

export function isGithubImagePreloaded(src: string): boolean {
  return preloadedImages.has(src);
}
