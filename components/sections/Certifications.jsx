import { Award, ExternalLink } from 'lucide-react';

// Server component — renders nothing until certificates are added in admin Settings.
export default function Certifications({ settings }) {
  const certs = settings?.certificates || [];
  if (!certs.length) return null;

  return (
    <section id="certifications" className="py-28 bg-bg/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <span className="font-mono text-xs text-em/80">{'// certifications'}</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-10">
          Certificates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c, i) => {
            const Card = c.url ? 'a' : 'div';
            const linkProps = c.url ? { href: c.url, target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <Card
                key={i}
                {...linkProps}
                className={`group flex gap-3 bg-white/[0.04] border border-em/20 rounded-xl p-4 transition ${
                  c.url ? 'hover:border-em/50 hover:shadow-lg hover:shadow-em/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-em' : ''
                }`}
              >
                <span className="shrink-0 w-9 h-9 rounded-lg bg-em/10 border border-em/30 flex items-center justify-center text-em">
                  <Award size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white leading-snug">{c.title}</div>
                  {c.issuer && <div className="text-xs text-gray-400 mt-1">{c.issuer}</div>}
                  <div className="flex items-center justify-between mt-2">
                    {c.date ? <span className="font-mono text-[10px] text-green-300">{c.date}</span> : <span />}
                    {c.url && (
                      <span className="font-mono text-[10px] text-em flex items-center gap-1 opacity-70 group-hover:opacity-100">
                        verify <ExternalLink size={11} />
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
