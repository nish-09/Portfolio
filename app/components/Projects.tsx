"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircularGallery from "./CircularGallery";
import { StorySection } from "./StorySection";

interface Project {
  text: string;
  image: string;
  category: string;
  year: string;
  description: string;
  challenge: string;
  outcome: string;
  tech: string[];
  links?: { label: string; url: string }[];
}

const PROJECTS: Project[] = [
  {
    text: "Salon Mitra",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
    category: "Web Application",
    year: "2024",
    description:
      "A full-stack Barber Queue Management System that digitizes the traditional walk-in waitlist experience. Customers can join a virtual queue from their phone and receive real-time updates on their position, eliminating the need to physically wait in the salon.",
    challenge:
      "The core challenge was building a real-time sync system that accurately reflects queue position across multiple concurrent users without introducing race conditions or stale data.",
    outcome:
      "Reduced average customer wait-time perception by ~40%. The barber staff reported smoother workflow and fewer no-shows after the digital queue was introduced.",
    tech: ["React", "Node.js", "Supabase", "Tailwind CSS", "Realtime WebSockets"],
    links: [{ label: "View Live", url: "#" }, { label: "GitHub", url: "#" }],
  },
  {
    text: "Memory Scrapbook",
    image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=2000&auto=format&fit=crop",
    category: "Hackathon Project",
    year: "2024",
    description:
      "Built at a 24-hour hackathon, Memory Scrapbook is a dynamic digital memory page where users can upload, arrange, and relive their most treasured moments in an interactive, visually rich UI. Supports drag-and-drop card layout and animated reveals.",
    challenge:
      "Shipping a polished, interactive product within 24 hours while maintaining code quality and responsiveness across devices was the main constraint.",
    outcome:
      "Won the 'Best UI/UX' category at the hackathon. The project was praised for its creative use of CSS animations and intuitive drag-and-drop architecture.",
    tech: ["React", "Tailwind CSS", "Framer Motion", "HTML5 Drag API"],
    links: [{ label: "GitHub", url: "#" }],
  },
  {
    text: "Vehicle Rental",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop",
    category: "Python System",
    year: "2023",
    description:
      "A command-line vehicle rental management system built with strict Object-Oriented Programming principles. Supports car and bus rentals, customer records, billing calculation, and fleet availability tracking via a modular class hierarchy.",
    challenge:
      "Designing the inheritance chain correctly so Cars and Buses shared common Vehicle behaviour while independently managing their unique billing logic and capacity constraints.",
    outcome:
      "Demonstrated mastery of Python OOP including polymorphism, encapsulation, and inheritance. Served as the capstone project for a university software design module.",
    tech: ["Python", "OOP", "File I/O", "CLI"],
    links: [{ label: "GitHub", url: "#" }],
  },
];

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  const handleItemClick = useCallback(
    (index: number) => {
      setSelected(PROJECTS[index] ?? null);
    },
    []
  );

  return (
    <StorySection
      id="projects"
      className="relative z-20 w-full min-w-0 max-w-[100vw] py-12 sm:py-16 md:py-20 min-h-0 sm:min-h-screen overflow-hidden bg-transparent pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] sm:px-0"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-8 sm:pt-12 md:pt-20 text-center flex flex-col items-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold text-white mb-2 tracking-tight">
          MY Projects
        </h2>
        <p className="text-white/50 text-sm sm:text-base md:text-lg mb-2 max-w-2xl px-2">
          Tap or click a card to explore · Drag or scroll to browse
        </p>
      </div>

      <div
        className="relative z-10 w-full max-w-[100vw] mx-auto h-[min(50vh,420px)] sm:h-[min(55vh,520px)] md:h-[600px]"
      >
        <CircularGallery
          items={PROJECTS}
          bend={0}
          textColor="#ffffff"
          borderRadius={0.13}
          scrollSpeed={5}
          scrollEase={0.15}
          font="bold 24px ui-monospace, monospace"
          onItemClick={handleItemClick}
        />
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-4 md:p-8 pointer-events-none pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
            >
              <div
                className="relative w-full min-w-0 max-w-4xl max-h-[min(92dvh,92svh)] overflow-y-auto overscroll-contain rounded-xl sm:rounded-3xl bg-black border border-white/10 shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-44 sm:h-56 md:h-80 w-full min-w-0 overflow-hidden rounded-t-xl sm:rounded-t-3xl">
                  <img
                    src={selected.image}
                    alt={selected.text}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Close"
                  >
                    ✕
                  </button>

                  <div className="absolute bottom-4 left-6">
                    <span className="text-xs font-mono tracking-widest text-[#e6b17e] bg-black/40 border border-[#e6b17e]/30 px-3 py-1 rounded-full">
                      {selected.category} · {selected.year}
                    </span>
                  </div>
                </div>

                <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight break-words">
                    {selected.text}
                  </h3>

                  <div>
                    <h4 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-3">Overview</h4>
                    <p className="text-white/75 leading-relaxed text-base md:text-lg">{selected.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <h4 className="text-xs font-mono tracking-widest text-[#ca12a8]/80 uppercase mb-3">Challenge</h4>
                      <p className="text-white/65 leading-relaxed text-sm">{selected.challenge}</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <h4 className="text-xs font-mono tracking-widest text-[#4ade80]/80 uppercase mb-3">Outcome</h4>
                      <p className="text-white/65 leading-relaxed text-sm">{selected.outcome}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.tech.map((t) => (
                        <span
                          key={t}
                          className="text-sm font-mono text-white/80 bg-white/8 border border-white/15 px-3 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selected.links && selected.links.length > 0 && (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                      {selected.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          className="inline-flex justify-center px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-200 w-full sm:w-auto min-h-11 sm:min-h-0"
                        >
                          {link.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </StorySection>
  );
}
