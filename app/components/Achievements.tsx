"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircularGallery from "./CircularGallery";

const ACHIEVEMENTS = [
  {
    icon: "🌟",
    title: "Open Source Contributor",
    description: "Contributed to multiple repositories across the ecosystem",
    image: "https://picsum.photos/seed/opensource/800/600?grayscale",
  },
  {
    icon: "🧠",
    title: "500+ LeetCode Problems",
    description: "Solved 500+ algorithm and data-structure challenges",
    image: "https://picsum.photos/seed/leetcode/800/600?grayscale",
  },
  {
    icon: "🏆",
    title: "Hackathon Winner",
    description: "1st place at a competitive hackathon build sprint",
    image: "https://picsum.photos/seed/hackathon/800/600?grayscale",
  },
  {
    icon: "⚔️",
    title: "GitHub Knight Badge",
    description: "Top 5% active contributor on competitive platforms",
    image: "https://picsum.photos/seed/github/800/600?grayscale",
  },
  {
    icon: "💻",
    title: "Full-Stack Developer",
    description: "Built end-to-end web applications from UI to deployment",
    image: "https://picsum.photos/seed/fullstack/800/600?grayscale",
  },
] as const;

const GALLERY_ITEMS = ACHIEVEMENTS.map((item) => ({
  image: item.image,
  text: item.title,
}));

const GALLERY_PROPS = {
  bend: 0,
  textColor: "#ffffff",
  borderRadius: 0.13,
  scrollSpeed: 5,
  scrollEase: 0.15,
  font: "bold 24px ui-monospace, monospace",
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Achievements() {
  const [lightbox, setLightbox] = useState<{
    image: string;
    title: string;
  } | null>(null);

  const handleGalleryClick = useCallback((index: number) => {
    const item = ACHIEVEMENTS[index];
    if (item) {
      setLightbox({ image: item.image, title: item.title });
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24 border-t border-white/8">
      <div className="text-center mb-10 sm:mb-14 px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] text-white/30 uppercase mb-3"
        >
          Milestones & Recognition
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white"
        >
          <span className="text-emerald-400">Achievements</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-white/50 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-xl mx-auto"
        >
          Highlights from open source, competitive programming, and shipped products
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -5% 0px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[100vw] max-w-[100vw] left-1/2 -translate-x-1/2 mb-12 sm:mb-16 md:mb-20 overflow-hidden"
        style={{ height: "min(420px, 52dvh)", minHeight: "280px" }}
      >
        <CircularGallery
          items={GALLERY_ITEMS}
          onItemClick={handleGalleryClick}
          {...GALLERY_PROPS}
        />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 px-4"
      >
        {ACHIEVEMENTS.map((item, i) => (
          <motion.article
            key={item.title}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`group relative flex flex-col gap-3 p-5 sm:p-6 rounded-2xl border border-white/10 bg-black hover:border-emerald-500/25 hover:bg-white/[0.03] transition-colors duration-300 ${
              i === ACHIEVEMENTS.length - 1 && ACHIEVEMENTS.length % 3 !== 0
                ? "sm:col-span-2 lg:col-span-1"
                : ""
            }`}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl"
              aria-hidden="true"
            >
              {item.icon}
            </div>
            <h3 className="text-sm sm:text-base font-mono font-bold text-white group-hover:text-emerald-300 transition-colors duration-200">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/45 leading-relaxed font-mono">
              {item.description}
            </p>
            <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-emerald-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.article>
        ))}
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <>
            <motion.button
              type="button"
              key="lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md cursor-pointer"
              aria-label="Close image"
              onClick={() => setLightbox(null)}
            />
            <motion.div
              key="lightbox"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[111] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
            >
              <div
                className="relative pointer-events-auto max-w-[min(96vw,56rem)] max-h-[min(88dvh,88svh)] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLightbox(null)}
                    className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white text-lg leading-none hover:bg-white/15 transition-colors"
                    aria-label="Close image"
                  >
                    ✕
                  </button>
                  <img
                    src={lightbox.image}
                    alt={lightbox.title}
                    className="w-full h-auto max-h-[min(82dvh,82svh)] object-contain rounded-lg"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-mono text-white/60">
                  {lightbox.title}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
