'use client';

import { useMemo } from 'react';
import BubbleMenu, { type BubbleMenuItem } from './BubbleMenu';

const NAV_ITEMS: BubbleMenuItem[] = [
  {
    label: 'Home',
    href: '#home',
    ariaLabel: 'Home — top of page',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' },
  },
  {
    label: 'About',
    href: '#about',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' },
  },
  {
    label: 'Projects',
    href: '#projects',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' },
  },
  {
    label: 'Skills',
    href: '#skills',
    ariaLabel: 'Skills',
    rotation: -6,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' },
  },
  {
    label: 'Contact',
    href: '#contact',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' },
  },
];

export default function PortfolioBubbleMenu() {
  const items = useMemo(() => NAV_ITEMS, []);

  return (
    <BubbleMenu
      className="bubble-menu--dock-right bubble-menu--floating"
      overlayClassName="bubble-menu-items--floating"
      items={items}
      menuAriaLabel="Toggle navigation"
      menuBg="rgba(255, 255, 255, 0.88)"
      menuContentColor="#fcfcfc"
      pillContentColor="#111111"
      useFixedPosition
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
      closeOnHashNavigate
    />
  );
}
