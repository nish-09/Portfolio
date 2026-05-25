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
  label: string;
  category: Exclude<SkillCategory, 'All'>;
  color: string;
}

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

export const ALL_SKILLS: SkillItem[] = [
  { label: 'HTML5', category: 'Frontend', color: '#E34F26' },
  { label: 'CSS3', category: 'Frontend', color: '#1572B6' },
  { label: 'JavaScript', category: 'Frontend', color: '#F7DF1E' },
  { label: 'TypeScript', category: 'Frontend', color: '#3178C6' },
  { label: 'React', category: 'Frontend', color: '#61DAFB' },
  { label: 'Next.js', category: 'Frontend', color: '#ffffff' },
  { label: 'Tailwind CSS', category: 'Frontend', color: '#38BDF8' },
  { label: 'Vite', category: 'Frontend', color: '#646CFF' },
  { label: 'Framer Motion', category: 'Frontend', color: '#a855f7' },
  { label: 'React Router', category: 'Frontend', color: '#CA4245' },
  { label: 'React Query', category: 'Frontend', color: '#FF4154' },
  { label: 'Styled Components', category: 'Frontend', color: '#DB7093' },
  { label: 'Sass', category: 'Frontend', color: '#CC6699' },
  { label: 'AngularJS', category: 'Frontend', color: '#DD0031' },
  { label: 'Three.js', category: 'Frontend', color: '#049EF4' },
  { label: 'React Native', category: 'Frontend', color: '#61DAFB' },

  { label: 'Node.js', category: 'Backend', color: '#339933' },
  { label: 'FastAPI', category: 'Backend', color: '#009688' },
  { label: 'Flask', category: 'Backend', color: '#ffffff' },
  { label: 'JWT', category: 'Backend', color: '#d63aff' },
  { label: 'Firebase', category: 'Backend', color: '#FFCA28' },
  { label: 'Supabase', category: 'Backend', color: '#3ECF8E' },
  { label: 'WordPress', category: 'Backend', color: '#21759B' },

  { label: 'MongoDB', category: 'Database', color: '#47A248' },
  { label: 'MySQL', category: 'Database', color: '#4479A1' },

  { label: 'NumPy', category: 'AI / ML', color: '#4DABCF' },
  { label: 'Pandas', category: 'AI / ML', color: '#150458' },
  { label: 'Matplotlib', category: 'AI / ML', color: '#11557C' },
  { label: 'PyTorch', category: 'AI / ML', color: '#EE4C2C' },
  { label: 'TensorFlow', category: 'AI / ML', color: '#FF6F00' },
  { label: 'Keras', category: 'AI / ML', color: '#D00000' },

  { label: 'Docker', category: 'Cloud / DevOps', color: '#2496ED' },
  { label: 'AWS', category: 'Cloud / DevOps', color: '#FF9900' },
  { label: 'Render', category: 'Cloud / DevOps', color: '#46E3B7' },
  { label: 'Vercel', category: 'Cloud / DevOps', color: '#ffffff' },

  { label: 'Python', category: 'Languages', color: '#3776AB' },
  { label: 'C', category: 'Languages', color: '#A8B9CC' },
  { label: 'C++', category: 'Languages', color: '#00599C' },
  { label: 'Java', category: 'Languages', color: '#ED8B00' },

  { label: 'Git', category: 'Tools', color: '#F05032' },
  { label: 'GitHub', category: 'Tools', color: '#ffffff' },
  { label: 'Figma', category: 'Tools', color: '#F24E1E' },
  { label: 'Canva', category: 'Tools', color: '#00C4CC' },
  { label: 'Arduino', category: 'Tools', color: '#00979D' },
  { label: 'Twilio', category: 'Tools', color: '#F22F46' },
];

export function skillsForCategory(category: SkillCategory): SkillItem[] {
  if (category === 'All') return ALL_SKILLS;
  return ALL_SKILLS.filter((s) => s.category === category);
}
