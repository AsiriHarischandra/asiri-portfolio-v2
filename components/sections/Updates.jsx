import UpdateCard from '@/components/ui/UpdateCard';

export default function Updates({ updates }) {
  if (!updates || updates.length === 0) return null;

  return (
    <section id="updates" className="py-28 bg-bg2/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <span className="font-mono text-xs text-em/80">{'// updates'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-10">
          What I&apos;m up to
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {updates.map(u => (
            <UpdateCard key={u._id} update={u} />
          ))}
        </div>
      </div>
    </section>
  );
}
