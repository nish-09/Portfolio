"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import "./PillNav.css";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  icon?: ReactNode;
};

function PillLabelContent({ item }: { item: PillNavItem }) {
  return (
    <>
      {item.icon ? (
        <span className="pill-glass-icon" aria-hidden="true">
          {item.icon}
        </span>
      ) : null}
      {item.label}
    </>
  );
}

export type PillNavProps = {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  onItemClick?: (e: React.MouseEvent<HTMLAnchorElement>, item: PillNavItem) => void;
  initialLoadAnimation?: boolean;
  containerClassName?: string;
};

export default function PillNav({
  logo,
  logoAlt = "Logo",
  items = [],
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#120F17",
  hoveredPillTextColor = "#120F17",
  pillTextColor,
  onMobileMenuClick,
  onItemClick,
  initialLoadAnimation = true,
  containerClassName = "",
}: PillNavProps) {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1 });
    }

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItems = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, {
          scale: 1,
          duration: 0.6,
          ease,
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, {
          width: "auto",
          duration: 0.6,
          ease,
        });
      }
    }

    return () => {
      logoTweenRef.current?.kill();
    };
  }, [ease, initialLoadAnimation]);

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.6,
      ease,
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: -10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: "top center",
          },
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: -10,
          scaleY: 1,
          duration: 0.25,
          ease,
          transformOrigin: "top center",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }

    onMobileMenuClick?.();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
    }

    if (menu) {
      gsap.to(menu, {
        opacity: 0,
        y: -10,
        scaleY: 1,
        duration: 0.2,
        ease,
        transformOrigin: "top center",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
        },
      });
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: PillNavItem) => {
    onItemClick?.(e, item);
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const isRouterLink = (href: string) => href && !isExternalLink(href);

  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor,
  } as React.CSSProperties;

  const renderPillLink = (item: PillNavItem) => {
    const className = `pill${activeHref === item.href ? " is-active" : ""}`;
    const label = (
      <span className="label-stack">
        <span className="pill-label">
          <PillLabelContent item={item} />
        </span>
      </span>
    );

    if (isRouterLink(item.href)) {
      return (
        <Link
          role="menuitem"
          href={item.href}
          className={className}
          aria-label={item.ariaLabel || item.label}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, item)}
        >
          {label}
        </Link>
      );
    }

    return (
      <a
        role="menuitem"
        href={item.href}
        className={className}
        aria-label={item.ariaLabel || item.label}
        onClick={(e) => handleLinkClick(e, item)}
      >
        {label}
      </a>
    );
  };

  return (
    <div
      className={`pill-nav-container${containerClassName ? ` ${containerClassName}` : ""}`}
    >
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            className="pill-logo"
            href={items[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={logoRef}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} />
          </Link>
        ) : (
          <a
            className="pill-logo"
            href={items?.[0]?.href || "#"}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            onClick={(e) => items?.[0] && handleLinkClick(e, items[0])}
            ref={logoRef}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} />
          </a>
        )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href || `item-${i}`} role="none">
                {renderPillLink(item)}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {items.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`}>
              {isRouterLink(item.href) ? (
                <Link
                  href={item.href}
                  className={`mobile-menu-link${activeHref === item.href ? " is-active" : ""}`}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, item)}
                >
                  <PillLabelContent item={item} />
                </Link>
              ) : (
                <a
                  href={item.href}
                  className={`mobile-menu-link${activeHref === item.href ? " is-active" : ""}`}
                  onClick={(e) => handleLinkClick(e, item)}
                >
                  <PillLabelContent item={item} />
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
