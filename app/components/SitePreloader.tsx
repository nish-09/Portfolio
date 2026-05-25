'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import LetterGlitch from './LetterGlitch';
import { preloadGithubData } from '@/lib/github-data';

const SiteReadyContext = createContext(false);

/** True after the preloader exit animation finishes and the overlay is removed. */
export function useSiteReady() {
  return useContext(SiteReadyContext);
}

const MIN_MS = 5_000;

const ROTATING_LINES = [
  'Syncing portfolio layers…',
  'Warming up the canvas…',
  'Hydrating scroll paths…',
  'Priming motion & physics…',
  'Unpacking visuals…',
  'Tuning typography & rhythm…',
  'Almost there — tightening bolts…',
  'Listening for the window load pulse…',
];

type SitePreloaderProps = {
  children: ReactNode;
};

export default function SitePreloader({ children }: SitePreloaderProps) {
  const startRef = useRef(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    preloadGithubData();
    fetch("/api/leetcode").catch(() => undefined);
    startRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }, []);

  useEffect(() => {
    const onLoad = () => setPageLoaded(true);
    if (document.readyState === 'complete') {
      setPageLoaded(true);
    } else {
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  const tryFinish = useCallback(() => {
    if (dismissed || exiting) return;
    const elapsed = performance.now() - startRef.current;
    if (pageLoaded && elapsed >= MIN_MS) {
      setExiting(true);
      window.setTimeout(() => setDismissed(true), 550);
    }
  }, [dismissed, exiting, pageLoaded]);

  useEffect(() => {
    if (dismissed) return;
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      setMinTimeElapsed(elapsed >= MIN_MS);
      const timeRatio = Math.min(1, elapsed / MIN_MS);
      let p = Math.min(99, timeRatio * 100);
      if (pageLoaded) p = 100;
      setProgress(p);
      tryFinish();
    };
    tick();
    const id = window.setInterval(tick, 80);
    return () => window.clearInterval(id);
  }, [dismissed, tryFinish, pageLoaded]);

  useEffect(() => {
    if (dismissed) return;
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % ROTATING_LINES.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [dismissed]);

  const subtitle = ROTATING_LINES[lineIndex];

  return (
    <SiteReadyContext.Provider value={dismissed}>
      {children}
      {!dismissed ? (
        <div
          className={`fixed inset-0 z-[200000] flex flex-col transition-opacity duration-500 ease-out pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] ${
            exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-live="polite"
          aria-busy={!exiting}
        >
          <div className="absolute inset-0">
            <LetterGlitch
              glitchSpeed={50}
              centerVignette
              outerVignette={false}
              smooth
              glitchColors={['#1a0a2e', '#9909dc', '#61dca3', '#4b2cdb', '#ffffff']}
            />
          </div>
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center pointer-events-none gap-6 px-6 sm:px-8 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
            <div className="flex w-full max-w-lg flex-col items-stretch gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/45">
                Loading phase
              </p>
              <p
                key={lineIndex}
                className="min-h-[3.25rem] text-lg font-medium leading-snug tracking-tight text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.85)] sm:text-xl"
              >
                {subtitle}
              </p>
              <div className="flex items-center justify-between gap-4 text-left">
                <span className="font-mono text-xs tabular-nums text-white/50">Progress</span>
                <span className="font-mono text-xs tabular-nums text-white/70">{Math.round(progress)}%</span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Site load progress"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#9909dc] via-white/90 to-[#61dca3] transition-[width] duration-150 ease-out"
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              <p className="font-mono text-[11px] text-white/40">
                {pageLoaded ? 'Window load complete' : 'Waiting on window load'}
                <span className="mx-2 text-white/25">·</span>
                {minTimeElapsed ? '5s hold complete' : '5s hold running'}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </SiteReadyContext.Provider>
  );
}
