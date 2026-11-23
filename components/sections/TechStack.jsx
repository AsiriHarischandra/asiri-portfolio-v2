import { DEFAULT_TECHSTACK } from '@/lib/defaults';

function Pill({ name }) {
  return (
    <span className="font-mono text-[10px] tracking-widest uppercase text-em/60 border border-em/15 px-4 py-2.5 whitespace-nowrap hover:text-em hover:border-em/40 transition-colors">
      {name}
    </span>
  );
}

export default function TechStack({ settings }) {
  const stack = settings?.techStack?.length ? settings.techStack : DEFAULT_TECHSTACK;

  return (
    <section id="techstack" className="py-24 border-y border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 mb-10">
        <span className="font-mono text-[10px] tracking-widest uppercase text-em/60 block mb-2">Stack</span>
        <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
          Tools I work with<span className="text-em">.</span>
        </h2>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden py-2">
        <div className="flex gap-3 w-max motion-safe:animate-marquee motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:max-w-6xl motion-reduce:mx-auto motion-reduce:px-10">
          {[...stack, ...stack].map((s, i) => (
            <Pill key={`${s.name}-${i}`} name={s.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
