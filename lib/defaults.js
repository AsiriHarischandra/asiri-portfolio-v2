// Fallback content for the editable About / Tech Stack / Education sections.
// Public components render these when the corresponding Settings array is empty
// or absent; the admin SettingsPanel seeds its form with them so the owner edits
// the real current content instead of a blank list.

export const DEFAULT_SKILLS = [
  { name: 'Problem solving', level: 90 },
  { name: 'Full-stack dev',  level: 85 },
  { name: 'AI / ML',         level: 70 },
];

export const DEFAULT_INTERESTS = ['Web Apps', 'Open Source', 'Machine Learning', 'Cloud', 'UI/UX'];

export const DEFAULT_TECHSTACK = [
  { name: 'React',      category: 'Frontend' },
  { name: 'Next.js',    category: 'Frontend' },
  { name: 'Tailwind',   category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'Node.js',    category: 'Backend' },
  { name: 'Express',    category: 'Backend' },
  { name: 'MongoDB',    category: 'Backend' },
  { name: 'Python',     category: 'AI/Data' },
  { name: 'Git',        category: 'DevOps' },
  { name: 'GitHub',     category: 'DevOps' },
  { name: 'Vercel',     category: 'DevOps' },
  { name: 'Docker',     category: 'DevOps' },
];

export const DEFAULT_EDUCATION = [
  { period: '2022 — 2024',    title: 'Diploma in Software Engineering', subtitle: 'Professional certification' },
  { period: '2024 — present', title: 'BSc (Hons) Computer Science',     subtitle: 'University of Moratuwa' },
];
