import Image from 'next/image';
import { Github, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project, featured }) {
  const p = project;

  return (
    <div className="card flex flex-col h-full group overflow-hidden">

      {/* Thumbnail — fixed height so all cards align */}
      <div className="relative w-full overflow-hidden bg-bg3 flex-shrink-0" style={{ height: '180px' }}>
        {p.thumbnail ? (
          <>
            <Image
              src={p.thumbnail}
              alt={p.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                   className="font-mono text-[10px] tracking-widest uppercase text-white border border-white/30 px-4 py-2 hover:bg-em hover:border-em hover:text-bg transition-colors">
                  Code
                </a>
              )}
              {p.demoUrl && (
                <a href={p.demoUrl} target="_blank" rel="noopener noreferrer"
                   className="font-mono text-[10px] tracking-widest uppercase text-white border border-white/30 px-4 py-2 hover:bg-em hover:border-em hover:text-bg transition-colors">
                  Demo
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl font-black text-em/15">
              {p.title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <span className="absolute top-3 left-3 font-mono text-[9px] tracking-widest uppercase text-bg bg-em px-2 py-1">
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">

        {/* Tags */}
        {p.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.tags.map(tag => (
              <span key={tag}
                className="font-mono text-[9px] tracking-wide uppercase text-cyan/70 border border-cyan/15 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display font-semibold text-sm text-white mb-2 group-hover:text-em transition-colors">
          {p.title}
        </h3>

        {/* Description — clamped to 3 lines so cards stay uniform */}
        <p className="text-xs text-white/35 leading-relaxed flex-1 line-clamp-3">
          {p.description}
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 font-mono text-[10px] text-white/30 mt-4 pt-3 border-t border-white/[0.05]">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 hover:text-em transition-colors tracking-widest uppercase">
              <Github size={11} /> Source
            </a>
          )}
          {p.demoUrl && (
            <a href={p.demoUrl} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 hover:text-em transition-colors tracking-widest uppercase ml-auto">
              Live <ArrowUpRight size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
