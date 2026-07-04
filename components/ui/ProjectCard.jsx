import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';

export default function ProjectCard({ project, featured }) {
  const p = project;

  return (
    <div
      className={`bg-white/[0.04] border border-em/20 rounded-xl p-5 flex flex-col hover:border-em/40 hover:shadow-lg hover:shadow-em/10 transition group ${
        featured ? 'h-full' : ''
      }`}
    >
      {featured && (
        <span className="font-mono text-[10px] text-lime tracking-widest uppercase mb-2">
          Featured
        </span>
      )}

      {/* Thumbnail */}
      {p.thumbnail ? (
        <div className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden mb-4 bg-bg3">
          <Image
            src={p.thumbnail}
            alt={p.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-20 md:h-28 rounded-lg bg-bg3 border border-em/15 flex items-center justify-center mb-4">
          <span className="font-display text-2xl text-em/40">
            {p.title?.charAt(0)}
          </span>
        </div>
      )}

      <h3 className="text-base font-medium mb-1">{p.title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed mb-3 flex-1">
        {p.description}
      </p>

      {/* Tags */}
      {p.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {p.tags.map(tag => (
            <span key={tag} className="font-mono text-[10px] text-green-300 bg-em/10 rounded px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex items-center gap-4 font-mono text-xs text-green-300 mt-auto">
        {p.githubUrl && (
          <a
            href={p.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-em transition"
          >
            <Github size={13} /> Code
          </a>
        )}
        {p.demoUrl && (
          <a
            href={p.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-em transition"
          >
            <ExternalLink size={13} /> Demo
          </a>
        )}
      </div>
    </div>
  );
}
