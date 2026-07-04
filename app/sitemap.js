import { getAllBlogSlugs } from '@/lib/data';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asiri-portfolio.vercel.app';

  const slugs = await getAllBlogSlugs();
  const blogEntries = slugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...blogEntries,
  ];
}
