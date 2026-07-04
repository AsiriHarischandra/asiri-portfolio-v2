import BlogCard from '@/components/ui/BlogCard';

export default function Blog({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="py-28 bg-bg2/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <span className="font-mono text-xs text-em/80">{'// writing'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-10">
          Blog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
