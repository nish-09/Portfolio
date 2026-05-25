import { GITHUB_USERNAME } from './github-data';

export type ProjectCategory =
  | 'Full Stack'
  | 'Frontend'
  | 'Backend'
  | 'AI/ML'
  | 'Tools'
  | 'Experimental';

export type ProjectStatus = 'Completed' | 'In Progress' | 'Experimental';

export type ProjectFilterTab =
  | 'All'
  | 'Full Stack'
  | 'Frontend'
  | 'Backend'
  | 'AI/ML'
  | 'Tools'
  | 'Experimental';

export type ProjectSort = 'Featured' | 'Most Recent' | 'Most Popular';

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  challenge: string;
  outcome: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tech: string[];
  features: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  stars: number;
  updatedAt: string;
  featured: boolean;
  source: 'manual' | 'github';
}

const IGNORE_REPO = /^(test|tutorial|demo|config|\.|temp|sandbox|hello-world)/i;
const IGNORE_NAMES = new Set(['nish-09', 'nish-09.github.io']);

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function placeholderImage(title: string, accent = 'a855f7') {
  const text = encodeURIComponent(title.slice(0, 24));
  return `https://placehold.co/1400x900/0a0a0f/${accent}?text=${text}&font=roboto`;
}

function inferCategory(
  langs: string[],
  topics: string[],
  name: string,
): ProjectCategory {
  const blob = `${name} ${langs.join(' ')} ${topics.join(' ')}`.toLowerCase();
  if (/tensorflow|pytorch|keras|ml|ai|nlp|opencv|pandas|numpy/.test(blob)) return 'AI/ML';
  if (/next|react|vue|angular|tailwind|css|html|frontend|ui/.test(blob)) return 'Frontend';
  if (/node|express|fastapi|flask|django|api|backend|supabase/.test(blob)) return 'Backend';
  if (/docker|aws|devops|ci|tool|cli|script/.test(blob)) return 'Tools';
  if (/experiment|hack|prototype|playground/.test(blob)) return 'Experimental';
  if (/full|stack|app|platform|system/.test(blob)) return 'Full Stack';
  return 'Full Stack';
}

function inferStatus(name: string, description: string): ProjectStatus {
  const blob = `${name} ${description}`.toLowerCase();
  if (/wip|progress|building|ongoing/.test(blob)) return 'In Progress';
  if (/experiment|hack|prototype|playground|test/.test(blob)) return 'Experimental';
  return 'Completed';
}

const MANUAL_PROJECTS: Omit<PortfolioProject, 'id' | 'source'>[] = [
  {
    title: 'Nishit Portfolio',
    slug: 'nishit-portfolio',
    description: 'Cinematic interactive developer portfolio with live GitHub, LeetCode, and physics-driven UI.',
    longDescription:
      'A premium portfolio experience built with Next.js, Lenis smooth scroll, GSAP motion, and real-time integrations for GitHub and LeetCode stats.',
    challenge: 'Balancing cinematic motion with performance and accessibility across devices.',
    outcome: 'A cohesive personal brand site with modular sections and live data widgets.',
    category: 'Full Stack',
    status: 'In Progress',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Lenis'],
    features: ['Live stats', 'Scroll-stack projects', 'Physics skills pit', 'Enquiry form'],
    image: placeholderImage('Portfolio', 'a855f7'),
    githubUrl: 'https://github.com/nish-09/Nishit_Portfolio',
    liveUrl: undefined,
    stars: 0,
    updatedAt: new Date().toISOString(),
    featured: true,
  },
  {
    title: 'CineHunt',
    slug: 'cinehunt',
    description: 'Movie discovery platform with search, filters, and curated cinematic collections.',
    longDescription: 'Discover films through smart filters, trending lists, and a polished dark UI.',
    challenge: 'Aggregating metadata from multiple sources with fast client-side filtering.',
    outcome: 'Smooth browsing experience with responsive layouts.',
    category: 'Full Stack',
    status: 'Completed',
    tech: ['React', 'Node.js', 'REST API', 'Tailwind CSS'],
    features: ['Search', 'Collections', 'Responsive UI'],
    image: placeholderImage('CineHunt', 'e11d48'),
    githubUrl: 'https://github.com/nish-09',
    stars: 0,
    updatedAt: '2025-01-15T00:00:00Z',
    featured: true,
  },
  {
    title: 'CoverMe',
    slug: 'coverme',
    description: 'Utility app for generating polished cover letters tailored to job descriptions.',
    longDescription: 'Helps applicants craft role-specific cover letters with templates and export options.',
    challenge: 'Structuring prompts and templates for consistent, professional output.',
    outcome: 'Faster application workflows for users.',
    category: 'Full Stack',
    status: 'Completed',
    tech: ['Next.js', 'OpenAI API', 'Tailwind CSS'],
    features: ['Templates', 'Export PDF', 'Role matching'],
    image: placeholderImage('CoverMe', '38bdf8'),
    stars: 0,
    updatedAt: '2024-11-01T00:00:00Z',
    featured: true,
  },
  {
    title: 'DhobiDash',
    slug: 'dhobidash',
    description: 'Laundry service dashboard for orders, pickups, and delivery tracking.',
    longDescription: 'Operations dashboard connecting customers, riders, and shop owners.',
    challenge: 'Real-time order state sync across roles.',
    outcome: 'Streamlined laundry logistics for small businesses.',
    category: 'Full Stack',
    status: 'Completed',
    tech: ['React', 'Firebase', 'Maps API'],
    features: ['Order tracking', 'Role dashboards', 'Notifications'],
    image: placeholderImage('DhobiDash', '4ade80'),
    stars: 0,
    updatedAt: '2024-09-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'GNYATI Website',
    slug: 'gnyati-website',
    description: 'Marketing website for GNYATI with modern layouts and animation.',
    longDescription: 'Brand-forward marketing site with section storytelling and contact flows.',
    challenge: 'Translating brand guidelines into a performant web experience.',
    outcome: 'Professional web presence for the organization.',
    category: 'Frontend',
    status: 'Completed',
    tech: ['React', 'Tailwind CSS', 'Framer Motion'],
    features: ['Landing pages', 'Contact', 'Animations'],
    image: placeholderImage('GNYATI', 'f59e0b'),
    stars: 0,
    updatedAt: '2024-08-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'Graphical Solver for LPP',
    slug: 'graphical-solver-lpp',
    description: 'Visual solver for linear programming problems with interactive graphs.',
    longDescription: 'Plots feasible regions and optimal points for 2D LPP problems.',
    challenge: 'Accurate geometry rendering and step-by-step explanations.',
    outcome: 'Educational tool for operations research students.',
    category: 'Tools',
    status: 'Completed',
    tech: ['Python', 'Matplotlib', 'Flask'],
    features: ['2D plotting', 'Optimal point', 'Step solver'],
    image: placeholderImage('LPP Solver', '06b6d4'),
    stars: 0,
    updatedAt: '2024-06-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'Marvel Redesign',
    slug: 'marvel-redesign',
    description: 'UI/UX redesign concept for a Marvel streaming-style experience.',
    longDescription: 'Cinematic browsing UI with hero banners and character-driven discovery.',
    challenge: 'Creating immersive visuals without heavy assets.',
    outcome: 'Award-style concept portfolio piece.',
    category: 'Frontend',
    status: 'Experimental',
    tech: ['Figma', 'React', 'CSS'],
    features: ['Hero carousel', 'Character pages', 'Dark theme'],
    image: placeholderImage('Marvel UI', 'dc2626'),
    stars: 0,
    updatedAt: '2024-05-01T00:00:00Z',
    featured: true,
  },
  {
    title: 'Memory Scrapbook',
    slug: 'memory-scrapbook',
    description: 'Interactive digital scrapbook with drag-and-drop memories and animated reveals.',
    longDescription: 'Hackathon project for arranging photos and notes in a playful collage UI.',
    challenge: 'Shipping polished interactions within 24 hours.',
    outcome: 'Best UI/UX recognition at hackathon.',
    category: 'Frontend',
    status: 'Completed',
    tech: ['React', 'Tailwind CSS', 'Framer Motion'],
    features: ['Drag layout', 'Animated cards', 'Upload'],
    image: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=2000&auto=format&fit=crop',
    stars: 0,
    updatedAt: '2024-04-01T00:00:00Z',
    featured: true,
  },
  {
    title: 'Minithon',
    slug: 'minithon',
    description: 'Hackathon management mini-platform for teams, schedules, and submissions.',
    longDescription: 'Coordinates mini hackathon events with judging and team dashboards.',
    challenge: 'Lightweight admin tools with minimal setup time.',
    outcome: 'Used for campus mini-hackathon events.',
    category: 'Full Stack',
    status: 'Completed',
    tech: ['React', 'Node.js', 'MongoDB'],
    features: ['Team signup', 'Judging', 'Schedule'],
    image: placeholderImage('Minithon', '8b5cf6'),
    stars: 0,
    updatedAt: '2024-03-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'Netflix Clone',
    slug: 'netflix-clone',
    description: 'Streaming UI clone with rows, hover previews, and responsive layout.',
    longDescription: 'Front-end clone focusing on layout fidelity and smooth hover states.',
    challenge: 'Matching complex grid and carousel patterns.',
    outcome: 'Strong front-end portfolio demonstration.',
    category: 'Frontend',
    status: 'Completed',
    tech: ['React', 'TMDB API', 'CSS'],
    features: ['Rows', 'Hero banner', 'Hover preview'],
    image: placeholderImage('Netflix Clone', 'e50914'),
    stars: 0,
    updatedAt: '2024-02-01T00:00:00Z',
    featured: true,
  },
  {
    title: 'OS MPR',
    slug: 'os-mpr',
    description: 'Operating systems coursework project exploring process scheduling concepts.',
    longDescription: 'Simulations and visualizations for scheduling algorithms.',
    challenge: 'Making abstract OS concepts tangible through visuals.',
    outcome: 'Clear educational simulations for coursework.',
    category: 'Tools',
    status: 'Completed',
    tech: ['C', 'Python', 'CLI'],
    features: ['Scheduling viz', 'Reports', 'Benchmarks'],
    image: placeholderImage('OS MPR', '64748b'),
    stars: 0,
    updatedAt: '2023-12-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'PassCraft',
    slug: 'passcraft',
    description: 'Digital pass and ticket generator with QR codes and branding.',
    longDescription: 'Creates branded event passes with export and verification flows.',
    challenge: 'QR generation and printable layouts.',
    outcome: 'Used for small event ticketing.',
    category: 'Full Stack',
    status: 'Completed',
    tech: ['React', 'Node.js', 'QR'],
    features: ['QR passes', 'Branding', 'Export'],
    image: placeholderImage('PassCraft', '14b8a6'),
    stars: 0,
    updatedAt: '2023-11-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'Pomodoro',
    slug: 'pomodoro',
    description: 'Focus timer with sessions, stats, and ambient themes.',
    longDescription: 'Productivity timer with customizable work/break cycles.',
    challenge: 'Persistent stats and notification timing accuracy.',
    outcome: 'Daily driver for focused study sessions.',
    category: 'Frontend',
    status: 'Completed',
    tech: ['JavaScript', 'CSS', 'LocalStorage'],
    features: ['Timers', 'Stats', 'Themes'],
    image: placeholderImage('Pomodoro', 'f97316'),
    stars: 0,
    updatedAt: '2023-10-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'RangMandir',
    slug: 'rangmandir',
    description: 'Cultural event platform highlighting performances and venue booking.',
    longDescription: 'Showcases artists and events with rich media galleries.',
    challenge: 'Media-heavy pages with fast load times.',
    outcome: 'Vibrant event discovery for local culture.',
    category: 'Full Stack',
    status: 'Completed',
    tech: ['React', 'Firebase', 'Tailwind CSS'],
    features: ['Events', 'Gallery', 'Booking'],
    image: placeholderImage('RangMandir', 'ec4899'),
    stars: 0,
    updatedAt: '2023-09-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'Rock Paper Scissors',
    slug: 'rock-paper-scissors',
    description: 'Animated RPS game with score tracking and playful micro-interactions.',
    longDescription: 'Classic game with motion-rich feedback and mobile-friendly controls.',
    challenge: 'Snappy animations without layout shift.',
    outcome: 'Fun arcade-style browser game.',
    category: 'Frontend',
    status: 'Completed',
    tech: ['JavaScript', 'CSS', 'HTML'],
    features: ['Scoreboard', 'Animations', 'Mobile UI'],
    image: placeholderImage('RPS', '22c55e'),
    stars: 0,
    updatedAt: '2023-08-01T00:00:00Z',
    featured: false,
  },
  {
    title: "Tap n' Total",
    slug: 'tap-n-total',
    description: 'Quick bill splitting and tip calculator for groups.',
    longDescription: 'Split bills fairly with tax and tip rules per person.',
    challenge: 'Clear UX for fast entry in social settings.',
    outcome: 'Handy utility for dining groups.',
    category: 'Tools',
    status: 'Completed',
    tech: ['React', 'Tailwind CSS'],
    features: ['Split bill', 'Tip calc', 'Share'],
    image: placeholderImage('Tap n Total', '0ea5e9'),
    stars: 0,
    updatedAt: '2023-07-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'TuduVaut',
    slug: 'tuduvaut',
    description: 'Task vault with categories, priorities, and drag reordering.',
    longDescription: 'Todo system with vaults, filters, and keyboard-friendly flows.',
    challenge: 'Smooth list reordering with persisted state.',
    outcome: 'Personal productivity workflow tool.',
    category: 'Full Stack',
    status: 'In Progress',
    tech: ['Next.js', 'Supabase', 'Tailwind CSS'],
    features: ['Vaults', 'Drag sort', 'Filters'],
    image: placeholderImage('TuduVaut', '6366f1'),
    stars: 0,
    updatedAt: '2025-02-01T00:00:00Z',
    featured: false,
  },
  {
    title: 'Voice Assistant',
    slug: 'voice-assistant',
    description: 'Voice-controlled assistant prototype with speech recognition and commands.',
    longDescription: 'Experimental assistant wiring browser speech APIs to action handlers.',
    challenge: 'Latency and accuracy of speech recognition in browser.',
    outcome: 'Proof-of-concept for hands-free commands.',
    category: 'AI/ML',
    status: 'Experimental',
    tech: ['Python', 'SpeechRecognition', 'Flask'],
    features: ['Voice commands', 'Intent routing', 'Web UI'],
    image: placeholderImage('Voice AI', '10b981'),
    stars: 0,
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
  },
  {
    title: 'Darshika Birthday 2026',
    slug: 'darshika-birthday-2026',
    description: 'Personalized interactive birthday experience with animations and messages.',
    longDescription: 'A bespoke celebratory microsite with playful motion and music.',
    challenge: 'Emotional storytelling through motion design.',
    outcome: 'Memorable personalized gift experience.',
    category: 'Experimental',
    status: 'Completed',
    tech: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    features: ['Animations', 'Music', 'Messages'],
    image: placeholderImage('Birthday 2026', 'f472b6'),
    stars: 0,
    updatedAt: '2026-01-01T00:00:00Z',
    featured: false,
  },
];

function manualToPortfolio(m: Omit<PortfolioProject, 'id' | 'source'>): PortfolioProject {
  return {
    ...m,
    id: `manual-${m.slug}`,
    source: 'manual',
  };
}

export async function fetchGithubProjects(): Promise<PortfolioProject[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=public`,
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((repo: { name: string; description: string | null }) => {
        if (IGNORE_NAMES.has(repo.name)) return false;
        if (IGNORE_REPO.test(repo.name)) return false;
        if (!repo.description?.trim()) return false;
        return true;
      })
      .map(
        (repo: {
          id: number;
          name: string;
          description: string | null;
          html_url: string;
          stargazers_count: number;
          language: string | null;
          updated_at: string;
          topics?: string[];
        }) => {
          const langs = repo.language ? [repo.language] : [];
          const topics = repo.topics ?? [];
          const title = repo.name
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c: string) => c.toUpperCase());
          return {
            id: `gh-${repo.id}`,
            title,
            slug: slugify(repo.name),
            description: repo.description ?? '',
            longDescription: repo.description ?? '',
            challenge: 'Open-source iteration, documentation, and maintainable structure.',
            outcome: `Public repository with ${repo.stargazers_count} stars on GitHub.`,
            category: inferCategory(langs, topics, repo.name),
            status: inferStatus(repo.name, repo.description ?? ''),
            tech: [...new Set([...langs, ...topics.map((t) => t.replace(/-/g, ' '))])].slice(0, 8),
            features: topics.length ? topics.slice(0, 4) : ['Open source', 'GitHub'],
            image: placeholderImage(title, '7c3aed'),
            githubUrl: repo.html_url,
            liveUrl: undefined,
            stars: repo.stargazers_count,
            updatedAt: repo.updated_at,
            featured: repo.stargazers_count >= 2,
            source: 'github' as const,
          };
        },
      );
  } catch {
    return [];
  }
}

export async function loadAllProjects(): Promise<PortfolioProject[]> {
  const manual = MANUAL_PROJECTS.map(manualToPortfolio);
  const github = await fetchGithubProjects();
  const manualSlugs = new Set(manual.map((p) => p.slug));

  const merged = [
    ...manual,
    ...github.filter((g) => !manualSlugs.has(g.slug)),
  ];

  return merged.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function filterProjects(
  projects: PortfolioProject[],
  tab: ProjectFilterTab,
): PortfolioProject[] {
  if (tab === 'All') return projects;
  return projects.filter((p) => p.category === tab);
}

export function sortProjects(
  projects: PortfolioProject[],
  sort: ProjectSort,
): PortfolioProject[] {
  const list = [...projects];
  if (sort === 'Featured') {
    return list.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.stars - a.stars;
    });
  }
  if (sort === 'Most Popular') {
    return list.sort((a, b) => b.stars - a.stars);
  }
  return list.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export const PROJECT_FILTER_TABS: ProjectFilterTab[] = [
  'All',
  'Full Stack',
  'Frontend',
  'Backend',
  'AI/ML',
  'Tools',
  'Experimental',
];

export const PROJECT_SORT_OPTIONS: ProjectSort[] = ['Featured', 'Most Recent', 'Most Popular'];
