'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import CinematicLayer from './CinematicLayer';
import { useSiteReady } from './SitePreloader';
import { useLenis, scrollToSection } from './SmoothScroll';
import styles from './VideoIntro.module.css';

const DESKTOP_VIDEO_SRC = '/videos/talking-head.mp4';
const MOBILE_VIDEO_SRC = '/assets/video/mobile.mp4';

const IconChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function VideoIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const hasLeftHeroRef = useRef(false);
  const hasStartedRef = useRef(false);
  const [videoSrc, setVideoSrc] = useState(DESKTOP_VIDEO_SRC);
  const isMobileVideo = videoSrc === MOBILE_VIDEO_SRC;

  const siteReady = useSiteReady();
  const lenis = useLenis();

  const startVideos = useCallback(() => {
    const main = mainRef.current;
    const ambient = ambientRef.current;
    if (!main || !ambient) return;

    main.muted = isMobileVideo;
    main.volume = isMobileVideo ? 0 : 1;
    main.currentTime = 0;
    ambient.currentTime = 0;
    void main.play().catch(() => undefined);
    void ambient.play().catch(() => undefined);
    hasStartedRef.current = true;
  }, [isMobileVideo]);

  useEffect(() => {
    const main = mainRef.current;
    const ambient = ambientRef.current;
    if (!main || !ambient) return;

    main.pause();
    ambient.pause();
    main.currentTime = 0;
    ambient.currentTime = 0;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(
      '(max-width: 768px), (max-aspect-ratio: 9/16)',
    );
    const pickSrc = () => (mq.matches ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC);
    const apply = () => setVideoSrc(pickSrc());
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    const ambient = ambientRef.current;
    if (!main || !ambient) return;
    main.src = videoSrc;
    ambient.src = videoSrc;
    main.load();
    ambient.load();
    hasStartedRef.current = false;
  }, [videoSrc]);

  const handleVideoError = useCallback(() => {
    if (videoSrc !== DESKTOP_VIDEO_SRC) {
      setVideoSrc(DESKTOP_VIDEO_SRC);
    }
  }, [videoSrc]);

  useEffect(() => {
    if (!siteReady) return;
    startVideos();
  }, [siteReady, startVideos, videoSrc]);

  useEffect(() => {
    if (!siteReady || !sectionRef.current) return;

    gsap.set(
      [
        `.${styles.tagline}`,
        `.${styles.firstName}`,
        `.${styles.lastName}`,
        `.${styles.divider}`,
        `.${styles.role}`,
        `.${styles.scrollIndicator}`,
      ],
      { opacity: 0 },
    );

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.6, defaults: { ease: 'power4.out' } });

      tl
        .fromTo(
          `.${styles.tagline}`,
          { opacity: 0, y: 22, letterSpacing: '0.55em' },
          { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 1.4 },
        )
        .fromTo(
          `.${styles.firstName}`,
          { opacity: 0, y: 72, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.2 },
          '-=0.8',
        )
        .fromTo(
          `.${styles.lastName}`,
          { opacity: 0, y: 72, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.2 },
          '-=1.0',
        )
        .fromTo(
          `.${styles.divider}`,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.out',
            transformOrigin: 'left center',
          },
          '-=0.65',
        )
        .fromTo(
          `.${styles.role}`,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          '-=0.55',
        )
        .fromTo(
          `.${styles.scrollIndicator}`,
          { opacity: 0 },
          { opacity: 1, duration: 0.85, ease: 'power2.out' },
          '-=0.4',
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [siteReady]);

  useEffect(() => {
    const main = mainRef.current;
    const ambient = ambientRef.current;
    if (!main || !ambient) return;

    const sync = () => {
      if (Math.abs(ambient.currentTime - main.currentTime) > 0.4) {
        ambient.currentTime = main.currentTime;
      }
    };
    main.addEventListener('timeupdate', sync, { passive: true });
    return () => main.removeEventListener('timeupdate', sync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const main = mainRef.current;
        const ambient = ambientRef.current;
        if (entry.isIntersecting) {
          if (hasLeftHeroRef.current && siteReady && hasStartedRef.current) {
            if (main) {
              main.currentTime = 0;
              main.muted = isMobileVideo;
              void main.play().catch(() => undefined);
            }
            if (ambient) {
              ambient.currentTime = 0;
              void ambient.play().catch(() => undefined);
            }
            hasLeftHeroRef.current = false;
          }
        } else {
          hasLeftHeroRef.current = true;
          main?.pause();
          ambient?.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [siteReady, isMobileVideo]);

  const handleVideoEnd = useCallback(() => {
    if (isMobileVideo) return;
    mainRef.current?.pause();
    ambientRef.current?.pause();
    setTimeout(() => {
      scrollToSection(lenis, 'about', { duration: 2.2 });
    }, 600);
  }, [lenis, isMobileVideo]);

  const handleScroll = useCallback(() => {
    scrollToSection(lenis, 'about', { duration: 1.8 });
  }, [lenis]);

  return (
    <section ref={sectionRef} id="video-intro" className={styles.section}>
      <div className={styles.mediaLayer} aria-hidden="true">
        <video
          ref={ambientRef}
          className={styles.ambientVideo}
          src={videoSrc}
          muted
          playsInline
          loop={isMobileVideo}
          preload={isMobileVideo ? 'metadata' : 'auto'}
          disablePictureInPicture
          tabIndex={-1}
          onError={handleVideoError}
        />

        <video
          ref={mainRef}
          className={styles.mainVideo}
          src={videoSrc}
          muted={isMobileVideo}
          playsInline
          loop={isMobileVideo}
          preload={isMobileVideo ? 'metadata' : 'auto'}
          disablePictureInPicture
          tabIndex={-1}
          aria-label="Introduction video"
          onEnded={handleVideoEnd}
          onError={handleVideoError}
        />
      </div>

      <div className={styles.gradBottom} aria-hidden="true" />
      <div className={styles.gradTop} aria-hidden="true" />
      <div className={styles.gradVignette} aria-hidden="true" />

      <CinematicLayer />

      <div className={styles.content}>
        <p className={styles.tagline}>Full Stack Developer &nbsp;·&nbsp; Creative Engineer</p>
        <h1 className={styles.nameBlock} aria-label="Nishit Parikh">
          <span className={styles.firstName}>Nishit</span>
          <span className={styles.lastName}>Parikh</span>
        </h1>
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.role}>
          Building immersive digital experiences<br />
          with clean code &amp; cinematic craft.
        </p>
      </div>

      <button
        id="vi-scroll-btn"
        className={styles.scrollIndicator}
        onClick={handleScroll}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollChevrons}>
          <IconChevronDown />
          <IconChevronDown />
        </span>
      </button>
    </section>
  );
}
