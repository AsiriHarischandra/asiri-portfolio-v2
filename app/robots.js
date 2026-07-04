export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asiri-portfolio.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
