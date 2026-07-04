'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Github, Linkedin, Mail } from 'lucide-react';

const ROLES = ['Full-stack developer', 'AI/ML enthusiast', 'UoM undergraduate', 'Problem solver'];

const TYPE_COLORS = {
  progress:    'text-em',
  learning:    'text-lime',
  upcoming:    'text-blue-400',
  achievement: 'text-amber-300',
};

const TYPE_LABELS = {
  progress:    'in-progress',
  learning:    'learning',
  upcoming:    'upcoming',
  achievement: 'achievement',
};

function Typewriter() {
  const [roleIdx, setRoleIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      setCharIdx(prev => {
        if (deleting) {
          if (prev <= 0) {
            setDeleting(false);
            setRoleIdx(r => (r + 1) % ROLES.length);
            return 0;
          }
          return prev - 1;
        } else {
          if (prev >= ROLES[roleIdx].length) {
            setTimeout(() => setDeleting(true), 1500);
            return prev;
          }
          return prev + 1;
        }
      });
    }, 100);

    return () => clearInterval(timer);
  }, [roleIdx, deleting]);

  return (
    <span className="font-mono text-sm md:text-base text-em">
      {ROLES[roleIdx].slice(0, charIdx)}
      <span className="text-lime animate-blink">▌</span>
    </span>
  );
}

export default function Hero({ settings, updates }) {
  const s = settings || {};

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-14">
      <div className="max-w-5xl mx-auto px-6 md:px-8 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10 py-12 md:py-0">
          {/* Left — text */}
          <div className="flex-1 min-w-0">
            {/* Availability pill */}
            <span className="inline-flex items-center gap-2 font-mono text-xs text-green-400 border border-green-400/30 rounded-full px-3 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
              {s.availability || 'open to internships'}
            </span>

            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {(s.name || 'Asiri Harischandra').split(' ').map((word, i) => (
                <span key={i}>
                  {word}
                  {i === 0 ? <br /> : null}
                </span>
              ))}
              <span className="text-lime">.</span>
            </h1>

            <div className="mt-3 h-6">
              <Typewriter />
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mt-4 max-w-sm">
              {s.bio || 'CS undergraduate at University of Moratuwa, building fast web apps and exploring AI.'}
            </p>

            <div className="flex items-center gap-4 mt-5">
              <span className="font-mono text-xs text-green-300 flex items-center gap-1">
                <MapPin size={13} />
                {s.location || 'Moratuwa, LK'}
              </span>
              <div className="flex items-center gap-3 text-green-300">
                {s.githubUrl && (
                  <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github size={17} className="hover:text-em transition" />
                  </a>
                )}
                {s.linkedinUrl && (
                  <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={17} className="hover:text-em transition" />
                  </a>
                )}
                {s.email && (
                  <a href={`mailto:${s.email}`} aria-label="Email">
                    <Mail size={17} className="hover:text-em transition" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right — hex photo */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="relative w-40 h-44 md:w-48 md:h-52">
              {/* Outer ring */}
              <div
                className="absolute -inset-2 border border-lime/40"
                style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
              />
              {/* Inner hex */}
              <div
                className="absolute inset-0 bg-bg3 border border-em/60 flex items-center justify-center overflow-hidden"
                style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
              >
                {s.avatarUrl ? (
                  <Image
                    src={s.avatarUrl}
                    alt={s.name || 'Asiri'}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <span className="font-display text-4xl font-extrabold text-em">AH</span>
                )}
              </div>
              {/* Badge */}
              <span className="absolute -bottom-1 -right-3 font-mono text-[10px] text-lime bg-bg3 border border-lime/40 rounded-lg px-2 py-1">
                UoM · CS
              </span>
            </div>
          </div>
        </div>

        {/* Status terminal */}
        {updates && updates.length > 0 && (
          <div className="mt-8 mb-12 bg-white/[0.03] border border-em/20 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-em/15 bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-em/80" />
              <span className="font-mono text-xs text-gray-500 ml-2">status — live from admin</span>
            </div>
            <div className="px-4 py-3 font-mono text-xs leading-7">
              <div>
                <span className="text-lime">$</span>{' '}
                <span className="text-white">asiri --status</span>
              </div>
              {updates.slice(0, 4).map(u => (
                <div key={u._id}>
                  <span className={TYPE_COLORS[u.type] || 'text-em'}>
                    ▸ {TYPE_LABELS[u.type] || u.type}
                  </span>{' '}
                  <span className="text-gray-300">{u.title.toLowerCase()}</span>{' '}
                  <span className="text-gray-600">· {u.date}</span>
                </div>
              ))}
              <div>
                <span className="text-lime">$</span>{' '}
                <span className="text-green-400 animate-blink">▌</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
