import { DEFAULT_TECHSTACK } from '@/lib/defaults';

function Pill({ name }) {
  return (
    <span className="font-mono text-xs text-green-200 border border-em/30 rounded-full px-4 py-2 whitespace-nowrap">
      {name}
    </span>
  );
}

export default function TechStack({ settings }) {
  const stack = settings?.techStack?.length ? settings.techStack : DEFAULT_TECHSTACK;

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
          {[...stack, ...stack].map((s, i) => (
            <Pill key={`${s.name}-${i}`} name={s.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
