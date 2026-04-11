'use client';

import Lenis from 'lenis';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function scrollToSection(
  lenis: Lenis | null,
  id: string,
  options?: { duration?: number; offset?: number }
) {
  const el = document.getElementById(id);
  if (!el) return;

  const duration = options?.duration ?? 1.45;
  const offset = options?.offset ?? 0;
  const easing = (t: number) => 1 - Math.pow(1 - t, 3);

  if (lenis) {
    lenis.scrollTo(el, {
      offset,
      duration,
      easing,
      force: true,
      programmatic: true,
    });
    return;
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: true,
      duration: 1.35,
      easing: easeOutQuart,
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 1.2,
      syncTouch: true,
      syncTouchLerp: 0.11,
    });

    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
