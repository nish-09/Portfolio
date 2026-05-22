"use client";

import { useEffect } from "react";
import { preloadGithubData } from "@/lib/github-data";

/** Warm GitHub API + stat card images during initial site load. */
export default function GitHubPrefetch() {
  useEffect(() => {
    preloadGithubData();
  }, []);

  return null;
}
