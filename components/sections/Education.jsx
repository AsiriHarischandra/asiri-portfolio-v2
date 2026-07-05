import { DEFAULT_EDUCATION } from '@/lib/defaults';

export default function Education({ settings }) {
  const items = settings?.education?.length ? settings.education : DEFAULT_EDUCATION;

  return (
    <section id="education" className="py-28 bg-bg2/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <span className="font-mono text-xs text-em/80">{'// education'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-14">
          Background
        </h2>

        {/* Vertical timeline — left rail with glowing nodes, one row per entry */}
        <div className="relative pl-8">
          {/* Trace line */}
          <div className="absolute top-2 bottom-2 left-[5px] w-px bg-em/30" />

          <div className="space-y-10">
            {items.map((item, i) => (
              <div key={i} className="relative">
                <span
                  className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full ${
                    i === items.length - 1
                      ? 'bg-lime shadow-[0_0_10px_rgba(163,230,53,0.8)] animate-pulse-dot'
                      : 'bg-em shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                  }`}
                />
                <div className="font-mono text-[10px] text-green-300 mb-1">{item.period}</div>
                <div className="text-sm font-medium">{item.title}</div>
                {item.subtitle && (
                  <div className="text-xs text-gray-500 mt-1">{item.subtitle}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
