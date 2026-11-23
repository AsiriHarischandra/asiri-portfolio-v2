import ProjectCard from '@/components/ui/ProjectCard';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="flex items-end gap-6 mb-16">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-em/60 block mb-2">02 / Work</span>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-none tracking-tight">
              Selected<span className="text-em">.</span>
            </h2>
          </div>
          <div className="hidden md:block flex-1 h-px bg-white/[0.06] mb-3" />
        </div>

        {/* Uniform grid — every card same size */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <ProjectCard key={p._id} project={p} featured={p.featured} />
          ))}
        </div>

      </div>
    </section>
  );
}
