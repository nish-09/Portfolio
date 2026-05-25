import type { GithubRepo } from './github-data';

export type ProjectStatus = 'Completed' | 'In Progress' | 'Experimental';

export interface PortfolioProject {
  id: string;
  slug: string;
  name: string;
  status: ProjectStatus;
  date: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  highlights: string[];
  tech: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
}

const PLACEHOLDER_IMAGES: Record<string, string> = {
  cinehunt: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80&auto=format&fit=crop',
  coverme: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&q=80&auto=format&fit=crop',
  'darshika-birthday-2026': 'https://images.unsplash.com/photo-1513885535751-8b923f09dc51?w=1600&q=80&auto=format&fit=crop',
  dhobidash: 'https://images.unsplash.com/photo-1582735689369-4fe340db2bed?w=1600&q=80&auto=format&fit=crop',
  'gnyati-website': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80&auto=format&fit=crop',
  'graphical-solver-for-lpp': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&q=80&auto=format&fit=crop',
  'marvel-redesign': 'https://images.unsplash.com/photo-1635805737707-575885ab0827?w=1600&q=80&auto=format&fit=crop',
  'memory-scrapbook': 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=1600&q=80&auto=format&fit=crop',
  minithon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80&auto=format&fit=crop',
  'netflix-clone': 'https://images.unsplash.com/photo-1616530940355-da1a6067d8cb?w=1600&q=80&auto=format&fit=crop',
  'nishit-portfolio': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80&auto=format&fit=crop',
  'os-mpr': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80&auto=format&fit=crop',
  passcraft: 'https://images.unsplash.com/photo-1611162617474-5b21e939e966?w=1600&q=80&auto=format&fit=crop',
  pomodoro: 'https://images.unsplash.com/photo-1484480974693-6ca0a63fb827?w=1600&q=80&auto=format&fit=crop',
  rangmandir: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80&auto=format&fit=crop',
  'rock-paper-scissors': 'https://images.unsplash.com/photo-1511512578047-dfb890d7043b?w=1600&q=80&auto=format&fit=crop',
  'tap-n-total': 'https://images.unsplash.com/photo-1556742049-0cfed4f06a59?w=1600&q=80&auto=format&fit=crop',
  tuduvaut: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80&auto=format&fit=crop',
  'voice-assistant': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80&auto=format&fit=crop',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80&auto=format&fit=crop';

export function normalizeProjectSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function projectHeroImage(slug: string): string {
  return PLACEHOLDER_IMAGES[slug] ?? DEFAULT_IMAGE;
}

const IGNORE_NAME_PATTERNS = [
  /^test/i,
  /tutorial/i,
  /config/i,
  /^\.env/i,
  /^demo-test/i,
  /^temp-/i,
];

export function shouldIgnoreGithubRepo(repo: GithubRepo): boolean {
  const name = repo.name.toLowerCase();
  if (IGNORE_NAME_PATTERNS.some((p) => p.test(name))) return true;
  if (!repo.description?.trim()) return true;
  return false;
}

/** Manual portfolio entries — always shown; GitHub data merges in when available. */
export const MANUAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'cinehunt',
    slug: 'cinehunt',
    name: 'CineHunt',
    status: 'Completed',
    date: '2024',
    category: 'Web Application',
    description: 'A cinematic movie discovery platform with curated lists, search, and immersive browsing.',
    problem: 'Finding quality films across fragmented streaming catalogs is slow and uninspiring.',
    solution: 'Built a unified discovery experience with rich visuals, filters, and a premium UI.',
    highlights: ['Curated collections', 'Fast search', 'Responsive layouts'],
    tech: ['React', 'Next.js', 'Tailwind CSS', 'TMDB API'],
    image: projectHeroImage('cinehunt'),
    githubUrl: 'https://github.com/nish-09/cinehunt',
  },
  {
    id: 'coverme',
    slug: 'coverme',
    name: 'CoverMe',
    status: 'Completed',
    date: '2024',
    category: 'Full Stack',
    description: 'Insurance and coverage companion app simplifying plan comparison and onboarding.',
    problem: 'Users struggle to compare coverage options across providers in one place.',
    solution: 'Delivered guided flows, plan cards, and clear comparison tables with modern UX.',
    highlights: ['Plan comparison', 'Guided onboarding', 'Mobile-friendly'],
    tech: ['React', 'Node.js', 'MongoDB'],
    image: projectHeroImage('coverme'),
    githubUrl: 'https://github.com/nish-09/coverme',
  },
  {
    id: 'darshika-birthday-2026',
    slug: 'darshika-birthday-2026',
    name: 'Darshika Birthday 2026',
    status: 'Experimental',
    date: '2026',
    category: 'Interactive Experience',
    description: 'A personalized celebratory microsite with animations, memories, and interactive surprises.',
    problem: 'Create a memorable one-off experience without a generic greeting card template.',
    solution: 'Crafted a custom interactive story with motion design and playful interactions.',
    highlights: ['Custom animations', 'Personal narrative', 'Shareable link'],
    tech: ['React', 'Framer Motion', 'Tailwind CSS'],
    image: projectHeroImage('darshika-birthday-2026'),
  },
  {
    id: 'dhobidash',
    slug: 'dhobidash',
    name: 'DhobiDash',
    status: 'Completed',
    date: '2024',
    category: 'Web Application',
    description: 'Laundry service dashboard for orders, pickups, and delivery tracking.',
    problem: 'Local laundry businesses lacked a simple digital order and status system.',
    solution: 'Shipped an admin + customer flow with order timelines and notifications.',
    highlights: ['Order tracking', 'Admin dashboard', 'Status updates'],
    tech: ['React', 'Firebase', 'Tailwind CSS'],
    image: projectHeroImage('dhobidash'),
    githubUrl: 'https://github.com/nish-09/DhobiDash',
  },
  {
    id: 'gnyati-website',
    slug: 'gnyati-website',
    name: 'Gnyati Website',
    status: 'Completed',
    date: '2023',
    category: 'Business Website',
    description: 'Corporate marketing site with service pages, contact flows, and brand storytelling.',
    problem: 'The brand needed a credible web presence that converts visitors into leads.',
    solution: 'Designed and developed a polished multi-page site with SEO-friendly structure.',
    highlights: ['Brand storytelling', 'Lead capture', 'SEO structure'],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'WordPress'],
    image: projectHeroImage('gnyati-website'),
    githubUrl: 'https://github.com/nish-09/gnyati-website',
  },
  {
    id: 'graphical-solver-for-lpp',
    slug: 'graphical-solver-for-lpp',
    name: 'Graphical Solver for LPP',
    status: 'Experimental',
    date: '2023',
    category: 'Academic Tool',
    description: 'Visual linear programming problem solver with feasible region plotting.',
    problem: 'Students needed an intuitive way to visualize constraints and optimal points.',
    solution: 'Implemented interactive graphs, constraint input, and step-by-step visualization.',
    highlights: ['2D plotting', 'Constraint editor', 'Optimal point highlight'],
    tech: ['Python', 'Matplotlib', 'Flask'],
    image: projectHeroImage('graphical-solver-for-lpp'),
    githubUrl: 'https://github.com/nish-09/Graphical-Solver-for-LPP',
  },
  {
    id: 'marvel-redesign',
    slug: 'marvel-redesign',
    name: 'Marvel Redesign',
    status: 'Completed',
    date: '2024',
    category: 'UI / UX',
    description: 'Concept redesign of a Marvel entertainment experience with cinematic layouts.',
    problem: 'Explore how franchise branding could feel more immersive on the web.',
    solution: 'Produced high-fidelity screens, motion concepts, and component-driven UI.',
    highlights: ['Cinematic UI', 'Character showcases', 'Design system'],
    tech: ['Figma', 'React', 'Tailwind CSS'],
    image: projectHeroImage('marvel-redesign'),
    githubUrl: 'https://github.com/nish-09/Marvel-Redesign',
  },
  {
    id: 'memory-scrapbook',
    slug: 'memory-scrapbook',
    name: 'Memory Scrapbook',
    status: 'Completed',
    date: '2024',
    category: 'Hackathon Project',
    description: 'Interactive digital scrapbook for arranging photos, notes, and animated memory cards.',
    problem: 'Static albums fail to capture the playful feeling of flipping through memories.',
    solution: 'Built drag-and-drop layouts with motion reveals and shareable collections.',
    highlights: ['Drag-and-drop', 'Animated reveals', 'Best UI/UX award'],
    tech: ['React', 'Tailwind CSS', 'Framer Motion'],
    image: projectHeroImage('memory-scrapbook'),
    githubUrl: 'https://github.com/nish-09/Memory-Scrapbook',
  },
  {
    id: 'minithon',
    slug: 'minithon',
    name: 'Minithon',
    status: 'Completed',
    date: '2024',
    category: 'Event Platform',
    description: 'Hackathon event hub with schedules, team registration, and judging workflows.',
    problem: 'Organizers needed one place to manage participants and timelines during the event.',
    solution: 'Created registration, schedule views, and admin tooling for fast-paced hackathons.',
    highlights: ['Registration', 'Live schedule', 'Admin tools'],
    tech: ['React', 'Node.js', 'MongoDB'],
    image: projectHeroImage('minithon'),
    githubUrl: 'https://github.com/nish-09/Minithon',
  },
  {
    id: 'netflix-clone',
    slug: 'netflix-clone',
    name: 'Netflix Clone',
    status: 'Completed',
    date: '2023',
    category: 'Streaming UI',
    description: 'Netflix-inspired browsing UI with rows, hero banners, and responsive video cards.',
    problem: 'Practice building a production-grade streaming interface with real API data.',
    solution: 'Recreated core browsing patterns with TMDB integration and smooth interactions.',
    highlights: ['Hero banner', 'Category rows', 'TMDB integration'],
    tech: ['React', 'Tailwind CSS', 'TMDB API'],
    image: projectHeroImage('netflix-clone'),
    githubUrl: 'https://github.com/nish-09/Netflix-Clone',
  },
  {
    id: 'nishit-portfolio',
    slug: 'nishit-portfolio',
    name: 'Nishit Portfolio',
    status: 'In Progress',
    date: '2026',
    category: 'Portfolio',
    description: 'This cinematic developer portfolio with physics skills, live stats, and project storytelling.',
    problem: 'Showcase full-stack ability with motion, interactivity, and real project depth.',
    solution: 'Engineered a premium experience using Next.js, Lenis, Matter.js, and live APIs.',
    highlights: ['Cinematic hero', 'Live GitHub stats', 'Interactive skills'],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Lenis'],
    image: projectHeroImage('nishit-portfolio'),
    githubUrl: 'https://github.com/nish-09/Nishit_Portfolio',
    liveUrl: 'https://nishitparikh.dev',
  },
  {
    id: 'os-mpr',
    slug: 'os-mpr',
    name: 'OS MPR',
    status: 'Experimental',
    date: '2023',
    category: 'Systems',
    description: 'Operating systems coursework project exploring process management concepts.',
    problem: 'Demonstrate scheduling and resource management in a controlled environment.',
    solution: 'Implemented simulations and reports for OS scheduling algorithms.',
    highlights: ['Process scheduling', 'Simulation', 'Documentation'],
    tech: ['C', 'C++', 'Linux'],
    image: projectHeroImage('os-mpr'),
    githubUrl: 'https://github.com/nish-09/OS-MPR',
  },
  {
    id: 'passcraft',
    slug: 'passcraft',
    name: 'PassCraft',
    status: 'Completed',
    date: '2024',
    category: 'Security Tool',
    description: 'Password generator and vault-style utility with strength analysis.',
    problem: 'Users need memorable yet secure passwords without compromising safety.',
    solution: 'Built generation rules, strength meters, and copy-safe UX patterns.',
    highlights: ['Strength analysis', 'Custom rules', 'Secure UX'],
    tech: ['JavaScript', 'React', 'Web Crypto API'],
    image: projectHeroImage('passcraft'),
    githubUrl: 'https://github.com/nish-09/PassCraft',
  },
  {
    id: 'pomodoro',
    slug: 'pomodoro',
    name: 'Pomodoro',
    status: 'Completed',
    date: '2023',
    category: 'Productivity',
    description: 'Focus timer app with sessions, breaks, and session history tracking.',
    problem: 'Developers need a distraction-free timer that fits a dark premium aesthetic.',
    solution: 'Shipped interval timers, notifications, and persistent session stats.',
    highlights: ['Focus intervals', 'Session history', 'Minimal UI'],
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    image: projectHeroImage('pomodoro'),
    githubUrl: 'https://github.com/nish-09/Pomodoro',
  },
  {
    id: 'rangmandir',
    slug: 'rangmandir',
    name: 'RangMandir',
    status: 'Completed',
    date: '2024',
    category: 'Cultural Platform',
    description: 'Platform celebrating art and culture with events, galleries, and community features.',
    problem: 'Cultural organizations lacked a vibrant digital home for events and artists.',
    solution: 'Designed rich galleries, event listings, and community submission flows.',
    highlights: ['Event listings', 'Art galleries', 'Community posts'],
    tech: ['React', 'Next.js', 'Supabase'],
    image: projectHeroImage('rangmandir'),
    githubUrl: 'https://github.com/nish-09/RangMandir',
  },
  {
    id: 'rock-paper-scissors',
    slug: 'rock-paper-scissors',
    name: 'Rock Paper Scissors',
    status: 'Completed',
    date: '2023',
    category: 'Game',
    description: 'Classic rock-paper-scissors game with score tracking and animated outcomes.',
    problem: 'Build a polished mini-game demonstrating state management and motion.',
    solution: 'Added animated throws, scoreboard, and responsive touch-friendly controls.',
    highlights: ['Score tracking', 'Animations', 'Mobile play'],
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    image: projectHeroImage('rock-paper-scissors'),
    githubUrl: 'https://github.com/nish-09/Rock-Paper-Scissors',
  },
  {
    id: 'tap-n-total',
    slug: 'tap-n-total',
    name: "Tap n' Total",
    status: 'Completed',
    date: '2024',
    category: 'Utility App',
    description: 'Quick bill splitting and tip calculator for groups and restaurants.',
    problem: 'Splitting bills fairly in groups is awkward without a fast shared tool.',
    solution: 'Built per-person breakdowns, tip presets, and shareable summaries.',
    highlights: ['Bill split', 'Tip presets', 'Share summary'],
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    image: projectHeroImage('tap-n-total'),
    githubUrl: 'https://github.com/nish-09/Tap-n-Total',
  },
  {
    id: 'tuduvaut',
    slug: 'tuduvaut',
    name: 'TuduVaut',
    status: 'In Progress',
    date: '2025',
    category: 'Productivity',
    description: 'Task and habit tracker with vault-style organization and progress insights.',
    problem: 'Todo apps often feel generic and fail to motivate consistent habits.',
    solution: 'Designed categorized tasks, streaks, and a premium dark interface.',
    highlights: ['Habit streaks', 'Categories', 'Progress insights'],
    tech: ['React', 'Next.js', 'Supabase'],
    image: projectHeroImage('tuduvaut'),
    githubUrl: 'https://github.com/nish-09/TuduVaut',
  },
  {
    id: 'voice-assistant',
    slug: 'voice-assistant',
    name: 'Voice Assistant',
    status: 'Experimental',
    date: '2024',
    category: 'AI / ML',
    description: 'Voice-controlled assistant prototype with speech recognition and command routing.',
    problem: 'Explore hands-free interaction for common developer and productivity commands.',
    solution: 'Integrated speech APIs with intent parsing and feedback loops.',
    highlights: ['Speech input', 'Intent routing', 'Voice feedback'],
    tech: ['Python', 'JavaScript', 'Web Speech API'],
    image: projectHeroImage('voice-assistant'),
    githubUrl: 'https://github.com/nish-09/voice-assistant',
  },
];

export function mergeWithGithubRepos(repos: GithubRepo[]): PortfolioProject[] {
  const bySlug = new Map<string, PortfolioProject>();

  for (const manual of MANUAL_PROJECTS) {
    bySlug.set(manual.slug, { ...manual });
  }

  for (const repo of repos) {
    if (shouldIgnoreGithubRepo(repo)) continue;
    const slug = normalizeProjectSlug(repo.name);
    const year = new Date(repo.updated_at).getFullYear().toString();
    const existing = bySlug.get(slug);

    if (existing) {
      bySlug.set(slug, {
        ...existing,
        stars: repo.stargazers_count,
        githubUrl: repo.html_url,
        tech:
          existing.tech.length > 0
            ? existing.tech
            : [repo.language, ...repo.topics].filter(Boolean) as string[],
      });
      continue;
    }

    bySlug.set(slug, {
      id: slug,
      slug,
      name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      status: 'Completed',
      date: year,
      category: repo.topics[0] ?? 'Open Source',
      description: repo.description ?? 'Open-source project from GitHub.',
      problem: 'Ship a maintainable solution for a real-world use case.',
      solution: repo.description ?? 'Implemented core features and published the repository.',
      highlights: repo.topics.slice(0, 3).length
        ? repo.topics.slice(0, 3)
        : ['Open source', 'Documented codebase'],
      tech: [repo.language, ...repo.topics].filter(Boolean) as string[],
      image: projectHeroImage(slug),
      githubUrl: repo.html_url,
      stars: repo.stargazers_count,
    });
  }

  const statusOrder: Record<ProjectStatus, number> = {
    'In Progress': 0,
    Completed: 1,
    Experimental: 2,
  };

  return Array.from(bySlug.values()).sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return (b.stars ?? 0) - (a.stars ?? 0);
  });
}

/** Shape used by CircularGallery */
export function toGalleryItem(project: PortfolioProject) {
  const links: { label: string; url: string }[] = [];
  if (project.liveUrl) links.push({ label: 'Live Demo', url: project.liveUrl });
  if (project.githubUrl) links.push({ label: 'GitHub', url: project.githubUrl });

  return {
    project,
    text: project.name,
    image: project.image,
    category: project.category,
    year: project.date,
    description: project.description,
    challenge: project.problem,
    outcome: project.solution,
    tech: project.tech,
    links,
  };
}
