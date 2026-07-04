import ProjectCard from '@/components/ui/ProjectCard';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  const featured = projects.find(p => p.featured);
  const others   = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-28 bg-bg/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <span className="font-mono text-xs text-em/80">{'// projects'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-10">
          Selected work
        </h2>

        {featured ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-3">
              <ProjectCard project={featured} featured />
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
              {others.slice(0, 2).map(p => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Remaining projects */}
        {(featured ? others.slice(2) : others).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {(featured ? others.slice(2) : others).map(p => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
