const STACK = [
  { name: 'React',      category: 'Frontend' },
  { name: 'Next.js',    category: 'Frontend' },
  { name: 'Tailwind',   category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'Node.js',    category: 'Backend' },
  { name: 'Express',    category: 'Backend' },
  { name: 'MongoDB',    category: 'Backend' },
  { name: 'Python',     category: 'AI/Data' },
  { name: 'Git',        category: 'DevOps' },
  { name: 'GitHub',     category: 'DevOps' },
  { name: 'Vercel',     category: 'DevOps' },
  { name: 'Docker',     category: 'DevOps' },
];

function Pill({ name }) {
  return (
    <span className="font-mono text-xs text-green-200 border border-em/30 rounded-full px-4 py-2 whitespace-nowrap">
      {name}
    </span>
  );
}

export default function TechStack() {
  return (
    <section id="techstack" className="py-20 bg-bg/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8 mb-8">
        <span className="font-mono text-xs text-em/80">{'// tech stack'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
          Tools I use
        </h2>
      </div>

      {/* Marquee — duplicate track for seamless loop */}
      <div className="border-y border-em/10 py-4 overflow-hidden">
        <div className="flex gap-3 w-max motion-safe:animate-marquee motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:max-w-5xl motion-reduce:mx-auto">
          {[...STACK, ...STACK].map((s, i) => (
            <Pill key={`${s.name}-${i}`} name={s.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
