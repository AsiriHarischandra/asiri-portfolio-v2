import { dbConnect } from './db';
import Project  from '@/models/Project';
import Update   from '@/models/Update';
import Blog     from '@/models/Blog';
import Settings from '@/models/Settings';

export async function getProjects() {
  await dbConnect();
  return Project.find({ published: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
}

export async function getFeaturedProject() {
  await dbConnect();
  return Project.findOne({ published: true, featured: true })
    .lean();
}

export async function getUpdates() {
  await dbConnect();
  return Update.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
}

export async function getBlogPosts() {
  await dbConnect();
  return Blog.find({ published: true })
    .sort({ createdAt: -1 })
    .select('-content') // list view doesn't need full markdown
    .lean();
}

export async function getBlogPost(slug) {
  await dbConnect();
  return Blog.findOne({ slug, published: true }).lean();
}

export async function getAllBlogSlugs() {
  await dbConnect();
  const posts = await Blog.find({ published: true }).select('slug').lean();
  return posts.map(p => p.slug);
}

export async function getSettings() {
  await dbConnect();
  let settings = await Settings.findOne().lean();
  if (!settings) {
    settings = await Settings.create({});
    settings = settings.toObject();
  }
  return settings;
}

export async function getStats() {
  await dbConnect();
  const [projectsCount, updatesCount, messagesUnread] = await Promise.all([
    Project.countDocuments({ published: true }),
    Update.countDocuments({ active: true }),
    (await import('@/models/Message')).default.countDocuments({ read: false }),
  ]);
  return { projectsCount, updatesCount, messagesUnread };
}

// Estimate reading time from word count
export function readingTime(content) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Serialize Mongoose lean docs for client components (convert _id, dates)
export function serialize(doc) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export function serializeMany(docs) {
  return JSON.parse(JSON.stringify(docs));
}
