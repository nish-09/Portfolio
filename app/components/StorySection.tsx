'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

const defaultViewport = {
  once: true,
  amount: 0.08 as const,
  margin: '0px 0px -4% 0px',
};

const storytellingTransition = {
  duration: 1.05,
  ease,
};

type StorySectionProps = Omit<HTMLMotionProps<'section'>, 'children'> & {
  children: ReactNode;
};

export function StorySection({ children, className, ...rest }: StorySectionProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ ...storytellingTransition, duration: 1.12 }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

type StoryBlockProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
};

export function StoryBlock({ children, className, ...rest }: StoryBlockProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ ...storytellingTransition, duration: 1 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
