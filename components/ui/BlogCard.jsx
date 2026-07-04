import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BlogCard({ post }) {
  const p = post;

  // Estimate reading time from excerpt or content length
  const wordCount = (p.excerpt || '').split(/\s+/).length;
  const readTime  = Math.max(1, Math.round(wordCount / 40)); // rough estimate from excerpt

  return (
    <Link
      href={`/blog/${p.slug}`}
      className="bg-white/[0.04] border border-em/20 rounded-xl p-5 hover:border-em/40 hover:shadow-lg hover:shadow-em/10 transition group block"
    >
      <div className="flex items-center justify-between mb-3">
        {p.category && (
          <span className="font-mono text-[10px] text-green-300 bg-em/10 rounded px-2 py-0.5">
            {p.category}
          </span>
        )}
        <span className="font-mono text-[10px] text-gray-600">
          {readTime} min read
        </span>
      </div>

      <h3 className="text-sm font-medium mb-2 group-hover:text-em transition">
        {p.title}
      </h3>

      {p.excerpt && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {p.excerpt}
        </p>
      )}

      <div className="font-mono text-xs text-em mt-4 flex items-center gap-1">
        Read <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
