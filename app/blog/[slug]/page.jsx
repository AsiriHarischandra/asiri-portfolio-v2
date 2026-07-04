import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getBlogPost, getAllBlogSlugs, readingTime, serialize } from '@/lib/data';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: `${post.title} — Asiri Harischandra`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = serialize(await getBlogPost(slug));
  if (!post) notFound();

  const time = readingTime(post.content);

  return (
    <main className="min-h-screen bg-bg pt-20 pb-28">
      <article className="max-w-2xl mx-auto px-6 md:px-8">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-1 font-mono text-xs text-em hover:text-lime transition mb-8"
        >
          <ArrowLeft size={13} /> Back
        </Link>

        {post.category && (
          <span className="font-mono text-[10px] text-green-300 bg-em/10 rounded px-2 py-0.5">
            {post.category}
          </span>
        )}

        <h1 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-3">
          {post.title}
        </h1>

        <div className="font-mono text-xs text-gray-500 mb-10">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
          {' · '}
          {time} min read
        </div>

        {post.mediumUrl && (
          <a
            href={post.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-em border border-em/30 rounded-lg px-3 py-2 hover:bg-em/10 hover:text-lime transition mb-10"
          >
            <ExternalLink size={13} /> Read this on Medium
          </a>
        )}

        <div className="prose prose-invert prose-emerald prose-sm max-w-none
          prose-headings:font-display prose-headings:font-bold
          prose-a:text-em prose-a:no-underline hover:prose-a:underline
          prose-code:text-lime prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-code:py-0.5
          prose-pre:bg-bg3 prose-pre:border prose-pre:border-em/20
          prose-img:rounded-xl
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
