"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FiBarChart2,
  FiBriefcase,
  FiHome,
  FiMail,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { useLenis, scrollToSection } from "./SmoothScroll";
import PillNav, { type PillNavItem } from "./PillNav";

const NAV_ITEMS: PillNavItem[] = [
  { label: "Home", href: "#home", icon: <FiHome />, ariaLabel: "Home — top of page" },
  { label: "About", href: "#about", icon: <FiUser />, ariaLabel: "About" },
  { label: "Projects", href: "#projects", icon: <FiBriefcase />, ariaLabel: "Projects" },
  { label: "Skills", href: "#skills", icon: <FiZap />, ariaLabel: "Skills" },
  { label: "Stats", href: "#stats", icon: <FiBarChart2 />, ariaLabel: "Stats & Achievements" },
  { label: "Contact", href: "#contact", icon: <FiMail />, ariaLabel: "Contact" },
];

/** Show navbar once the About section enters the viewport (past hero / scrolly canvas). */
function shouldShowNav(): boolean {
  const about = document.getElementById("about");
  if (!about) return false;
  return about.getBoundingClientRect().top <= window.innerHeight * 0.82;
}

export default function PortfolioPillNav() {
  const lenis = useLenis();
  const [activeHref, setActiveHref] = useState("#home");
  const [isNavVisible, setIsNavVisible] = useState(false);

  const items = useMemo(() => NAV_ITEMS, []);

  // Hide navbar during hero / scrolly canvas; reveal from About onward
  useEffect(() => {
    const update = () => setIsNavVisible(shouldShowNav());

    update();

    if (lenis) {
      lenis.on("scroll", update);
      return () => lenis.off("scroll", update);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lenis]);

  // IntersectionObserver to set active navigation item based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -40% 0px", // Trigger when section occupies the active viewing zone
      threshold: 0,
    };

    const observers = items.map((item) => {
      if (!item.href.startsWith("#")) return null;
      const id = item.href.slice(1);
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveHref(item.href);
        }
      }, observerOptions);

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
          obs.observer.disconnect();
        }
      });
    };
  }, [items]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: PillNavItem) => {
    if (item.href.startsWith("#")) {
      const id = item.href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        scrollToSection(lenis, id, { duration: 1.55, offset: 0 });
        setActiveHref(item.href);
      }
    }
  };

  return (
    <PillNav
      containerClassName={isNavVisible ? "" : "is-nav-hidden"}
      logo="/assets/images/mypic.png"
      logoAlt="Nishit Parikh Logo"
      items={items}
      activeHref={activeHref}
      onItemClick={handleItemClick}
      baseColor="#ffffff"
      pillColor="rgba(255, 255, 255, 0.05)"
      hoveredPillTextColor="#000000"
      pillTextColor="#ffffff"
      ease="power3.easeOut"
      initialLoadAnimation={true}
    />
  );
}
