import SkillBar from '@/components/ui/SkillBar';

const SKILLS = [
  { name: 'Problem solving', level: 90 },
  { name: 'Full-stack dev',  level: 85 },
  { name: 'AI / ML',         level: 70 },
];

const INTERESTS = ['Web Apps', 'Open Source', 'Machine Learning', 'Cloud', 'UI/UX'];

export default function About({ settings }) {
  const s = settings || {};

  return (
    <section id="about" className="py-28 bg-bg/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <span className="font-mono text-xs text-em/80">{'// about'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-10">
          Who I am
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bio + skills */}
          <div>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              {s.bio ||
                'CS undergraduate at University of Moratuwa, building clean and fast web applications. Passionate about full-stack development and exploring the intersection of AI and practical engineering.'}
            </p>

            <div className="space-y-5">
              {SKILLS.map(skill => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>

          {/* Interest chips + value cards */}
          <div>
            <h3 className="font-mono text-xs text-em/80 mb-3">interests</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {INTERESTS.map(i => (
                <span
                  key={i}
                  className="font-mono text-xs text-green-200 bg-em/10 border border-em/25 rounded-full px-3 py-1.5"
                >
                  {i}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.04] border border-em/20 rounded-xl p-4">
                <div className="font-display text-2xl font-extrabold text-em">10+</div>
                <div className="font-mono text-[10px] text-gray-400 tracking-wider uppercase mt-1">
                  Projects
                </div>
              </div>
              <div className="bg-white/[0.04] border border-em/20 rounded-xl p-4">
                <div className="font-display text-2xl font-extrabold text-em">8+</div>
                <div className="font-mono text-[10px] text-gray-400 tracking-wider uppercase mt-1">
                  Technologies
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
