/**
 * Seed script — populates the database with sample data.
 * Run once: npm run seed
 * Loads env via `node --env-file=.env.local` (see package.json), so MONGODB_URI
 * must be set there. Self-contained schemas (no app-model imports) so it runs
 * as a plain ESM script without the project's build pipeline.
 */

import mongoose from 'mongoose';
import slugify from 'slugify';
import dns from 'node:dns';

// Same local-dev DNS workaround as lib/db.js — route SRV lookups for
// mongodb+srv:// to public resolvers when the local resolver is broken.
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch { /* ignore */ }

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Set MONGODB_URI in .env.local');
  process.exit(1);
}

// --- Schemas (kept in sync with models/*.js) ------------------------------
const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  tags:        [String],
  thumbnail:   String,
  githubUrl:   String,
  demoUrl:     String,
  featured:    { type: Boolean, default: false },
  published:   { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

const UpdateSchema = new mongoose.Schema({
  type:        { type: String, enum: ['progress', 'learning', 'upcoming', 'achievement'], required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  date:        { type: String, required: true },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  content:    { type: String, required: true },
  category:   String,
  excerpt:    String,
  coverImage: String,
  published:  { type: Boolean, default: false },
  slug:       { type: String, unique: true },
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  name:         { type: String, default: 'Asiri Harischandra' },
  tagline:      { type: String, default: 'Never Give Up' },
  university:   { type: String, default: 'University of Moratuwa' },
  location:     { type: String, default: 'Moratuwa, Sri Lanka' },
  bio:          { type: String, default: '' },
  githubUrl:    { type: String, default: '' },
  linkedinUrl:  { type: String, default: '' },
  email:        { type: String, default: '' },
  avatarUrl:    { type: String, default: '' },
  availability: { type: String, default: 'open to internships' },
}, { timestamps: true });

const Project  = mongoose.model('Project', ProjectSchema);
const Update   = mongoose.model('Update', UpdateSchema);
const Blog     = mongoose.model('Blog', BlogSchema);
const Settings = mongoose.model('Settings', SettingsSchema);

// --- Seed -----------------------------------------------------------------
await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

await Promise.all([
  Project.deleteMany({}),
  Update.deleteMany({}),
  Blog.deleteMany({}),
  Settings.deleteMany({}),
]);

await Settings.create({
  name: 'Asiri Harischandra',
  tagline: 'Never Give Up',
  university: 'University of Moratuwa',
  location: 'Moratuwa, Sri Lanka',
  bio: 'CS undergraduate at University of Moratuwa, building clean and fast web applications. Passionate about full-stack development and exploring AI.',
  githubUrl: 'https://github.com/asiri',
  linkedinUrl: 'https://linkedin.com/in/asiri',
  email: 'asiri@example.com',
  availability: 'open to internships',
});

await Project.insertMany([
  {
    title: 'ShopLane',
    description: 'Full-stack e-commerce platform with cart, checkout, and an admin dashboard for product management.',
    tags: ['Next.js', 'MongoDB', 'Stripe', 'Tailwind'],
    githubUrl: 'https://github.com/asiri/shoplane',
    demoUrl: 'https://shoplane.vercel.app',
    featured: true,
    published: true,
    order: 0,
  },
  {
    title: 'StudyBot',
    description: 'AI-powered study assistant that answers questions from course materials using LLM APIs.',
    tags: ['Python', 'LangChain', 'React'],
    githubUrl: 'https://github.com/asiri/studybot',
    published: true,
    order: 1,
  },
  {
    title: 'DataViz Lab',
    description: 'Interactive dashboards for visualizing exam analytics and student performance data.',
    tags: ['React', 'D3.js', 'Node.js'],
    githubUrl: 'https://github.com/asiri/dataviz-lab',
    published: true,
    order: 2,
  },
]);

await Update.insertMany([
  { type: 'progress', title: 'Portfolio v2 build', description: 'Rebuilding portfolio with Next.js and server components.', date: 'Jul 2026', active: true },
  { type: 'learning', title: 'Machine learning basics', description: 'Working through Andrew Ng courses and building small models.', date: 'Jul 2026', active: true },
  { type: 'achievement', title: 'Hackathon finalist — CodeFest', description: 'Reached the finals at university hackathon with team project.', date: 'Jun 2026', active: true },
]);

const blogTitle = 'Why I moved my portfolio to one Next.js app';
await Blog.create({
  title: blogTitle,
  content: `# Why I moved my portfolio to one Next.js app\n\nWhen I first built my portfolio, I used a separate Express backend on Render. It worked — until a recruiter visited and hit a 30-second cold start.\n\n## The problem\n\nRender's free tier sleeps your server after 15 minutes of inactivity. For a portfolio that gets occasional visits, that means almost every visitor hits the cold start.\n\n## The fix\n\nNext.js Route Handlers replace Express routes 1:1, and Vercel runs them as serverless functions with no cold start penalty. One codebase, one deploy, zero CORS issues.\n\n## Results\n\n- Load time went from 30s (cold) to under 2s\n- One git push deploys everything\n- Still completely free`,
  category: 'Web dev',
  excerpt: 'Cold starts, SEO, and the case against a separate backend for a portfolio site.',
  published: true,
  slug: slugify(blogTitle, { lower: true, strict: true }),
});

console.log('Seed complete!');
await mongoose.disconnect();
