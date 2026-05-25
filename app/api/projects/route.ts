import { NextResponse } from 'next/server';
import { GITHUB_USERNAME, type GithubRepo } from '@/lib/github-data';
import { mergeWithGithubRepos } from '@/lib/projects-data';

export const revalidate = 3600;

async function fetchAllRepos(): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=public`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((repo: GithubRepo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    language: repo.language,
    updated_at: repo.updated_at,
    topics: repo.topics ?? [],
  }));
}

export async function GET() {
  try {
    const repos = await fetchAllRepos();
    const projects = mergeWithGithubRepos(repos);
    return NextResponse.json({ projects });
  } catch {
    const projects = mergeWithGithubRepos([]);
    return NextResponse.json({ projects });
  }
}
