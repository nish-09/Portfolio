export type SkillCategory =
  | 'All'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'AI / ML'
  | 'Cloud / DevOps'
  | 'Tools'
  | 'Languages';

export interface SkillItem {
  name: string;
  category: Exclude<SkillCategory, 'All'>;
  color: string;
}

const CATEGORY_COLORS: Record<Exclude<SkillCategory, 'All'>, string> = {
  Frontend: '#61DAFB',
  Backend: '#68D391',
  Database: '#F6AD55',
  'AI / ML': '#B794F4',
  'Cloud / DevOps': '#63B3ED',
  Tools: '#F687B3',
  Languages: '#FBD38D',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  'All',
  'Frontend',
  'Backend',
  'Database',
  'AI / ML',
  'Cloud / DevOps',
  'Tools',
  'Languages',
];

const RAW_SKILLS: Record<Exclude<SkillCategory, 'All'>, string[]> = {
  Frontend: [
    'HTML5',
    'CSS3',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Tailwind CSS',
    'Vite',
    'Framer Motion',
    'React Router',
    'React Query',
    'Styled Components',
    'Sass',
    'AngularJS',
    'Three.js',
    'React Native',
  ],
  Backend: [
    'Node.js',
    'FastAPI',
    'Flask',
    'JWT',
    'Firebase',
    'Supabase',
    'WordPress',
  ],
  Database: ['MongoDB', 'MySQL', 'Firebase', 'Supabase'],
  'AI / ML': [
    'NumPy',
    'Pandas',
    'Matplotlib',
    'PyTorch',
    'TensorFlow',
    'Keras',
  ],
  'Cloud / DevOps': ['Docker', 'AWS', 'Render', 'Vercel'],
  Languages: ['Python', 'C', 'C++'],
  Tools: ['Git', 'GitHub', 'Figma', 'Canva', 'Arduino', 'Twilio'],
};

export const ALL_SKILLS: SkillItem[] = Object.entries(RAW_SKILLS).flatMap(
  ([category, names]) =>
    names.map((name) => ({
      name,
      category: category as Exclude<SkillCategory, 'All'>,
      color: CATEGORY_COLORS[category as Exclude<SkillCategory, 'All'>],
    })),
);

export function getSkillsForCategory(category: SkillCategory): SkillItem[] {
  if (category === 'All') return ALL_SKILLS;
  return ALL_SKILLS.filter((s) => s.category === category);
}

export function skillsToBallpitProps(skills: SkillItem[]) {
  const palette = skills.map((s) => {
    const hex = s.color.replace('#', '');
    return parseInt(hex, 16);
  });
  return {
    count: Math.max(skills.length + 1, 8),
    texts: skills.map((s) => s.name),
    textColors: skills.map((s) => s.color),
    colors: palette.length > 0 ? palette : [0x7928ca, 0x0070f3, 0x38bdf8],
  };
}
