'use client';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

import { useLenis, scrollToSection } from './SmoothScroll';
import './BubbleMenu.css';

export type BubbleMenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor: string; textColor: string };
};

const DEFAULT_ITEMS: BubbleMenuItem[] = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' },
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' },
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' },
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' },
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' },
  },
];

export type BubbleMenuProps = {
  logo?: ReactNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  overlayClassName?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  pillContentColor?: string;
  useFixedPosition?: boolean;
  items?: BubbleMenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  closeOnHashNavigate?: boolean;
};

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  overlayClassName,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  pillContentColor = '#111111',
  useFixedPosition = false,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12,
  closeOnHashNavigate = false,
}: BubbleMenuProps) {
  const lenis = useLenis();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const menuItems = useMemo(
    () => (items?.length ? items : DEFAULT_ITEMS),
    [items]
  );

  const containerClassName = ['bubble-menu', useFixedPosition ? 'fixed' : 'absolute', className]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const handlePillClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!closeOnHashNavigate || !href.startsWith('#')) return;
      const id = href.slice(1);
      if (!id) return;
      e.preventDefault();
      scrollToSection(lenis, id, { duration: 1.55, offset: 0 });
      setIsMenuOpen(false);
    },
    [closeOnHashNavigate, lenis]
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out',
            },
            `-=${animationDuration * 0.9}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in',
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean) as HTMLAnchorElement[];
        const isDesktop = window.innerWidth >= 900;

        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  const overlayClasses = [
    'bubble-menu-items',
    useFixedPosition ? 'fixed' : 'absolute',
    overlayClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <nav className={containerClassName} style={style} aria-label="Main navigation">
        {logo != null ? (
          <div className="bubble bubble--glass logo-bubble" aria-label="Logo">
            <span className="logo-content">
              {typeof logo === 'string' ? (
                <img src={logo} alt="Logo" className="bubble-logo" />
              ) : (
                logo
              )}
            </span>
          </div>
        ) : null}

        <button
          type="button"
          className={`bubble bubble--glass toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ color: menuContentColor }}
        >
          <span className="menu-btn-label">{isMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </nav>
      {showOverlay ? (
        <div
          ref={overlayRef}
          className={overlayClasses}
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={`${item.href}-${item.label}-${idx}`} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  style={
                    {
                      '--item-rot': `${item.rotation ?? 0}deg`,
                      '--pill-bg': menuBg,
                      '--pill-color': pillContentColor,
                      '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
                      '--hover-color': item.hoverStyles?.textColor || pillContentColor,
                    } as CSSProperties
                  }
                  ref={(el) => {
                    bubblesRef.current[idx] = el;
                  }}
                  onClick={(e) => handlePillClick(e, item.href)}
                >
                  <span
                    className="pill-label"
                    ref={(el) => {
                      labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
