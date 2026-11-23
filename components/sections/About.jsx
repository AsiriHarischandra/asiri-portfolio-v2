import SkillBar from '@/components/ui/SkillBar';
import { DEFAULT_SKILLS, DEFAULT_INTERESTS, DEFAULT_TECHSTACK } from '@/lib/defaults';

export default function About({ settings, projectsCount }) {
  const s = settings || {};
  const skills    = s.skills?.length    ? s.skills    : DEFAULT_SKILLS;
  const interests = s.interests?.length ? s.interests : DEFAULT_INTERESTS;
  const techCount = s.techStack?.length || DEFAULT_TECHSTACK.length;
  const projCount = typeof projectsCount === 'number' ? projectsCount : 0;

  return (
    <section id="about" className="py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="flex items-end gap-6 mb-16">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-em/60 block mb-2">01 / About</span>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-none tracking-tight">
              Who I Am<span className="text-em">.</span>
            </h2>
          </div>
          <div className="hidden md:block flex-1 h-px bg-white/[0.06] mb-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Left — bio + skills */}
          <div>
            <p className="text-sm text-white/40 leading-relaxed mb-10 max-w-sm">
              {s.bio ||
                'CS undergraduate at University of Moratuwa building clean, fast web applications. Passionate about full-stack engineering and the intersection of AI with practical software.'}
            </p>

            <div className="space-y-5">
              {skills.map(skill => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>

          {/* Right — interests + stats */}
          <div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="card p-6">
                <div className="font-display text-5xl font-black text-em leading-none mb-2">{projCount}</div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-white/30">
                  Projects Built
                </div>
              </div>
              <div className="card p-6">
                <div className="font-display text-5xl font-black text-cyan leading-none mb-2">{techCount}</div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-white/30">
                  Technologies
                </div>
              </div>
            </div>

            {/* Interests */}
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/30 block mb-4">
              Interests
            </span>
            <div className="flex flex-wrap gap-2">
              {interests.map(i => (
                <span
                  key={i}
                  className="font-mono text-[10px] tracking-wide uppercase text-em border border-em/20 px-3 py-1.5 hover:border-em/50 hover:text-white transition-colors"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
