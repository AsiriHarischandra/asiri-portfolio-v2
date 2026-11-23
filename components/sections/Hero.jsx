'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Github, Linkedin, Mail, Download, ArrowRight, GraduationCap } from 'lucide-react';

const ROLES = ['Full-Stack Developer', 'AI/ML Enthusiast', 'UoM Undergraduate', 'Problem Solver'];

const TYPE_COLORS = {
  progress:    'text-em',
  learning:    'text-cyan',
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
          if (prev <= 0) { setDeleting(false); setRoleIdx(r => (r + 1) % ROLES.length); return 0; }
          return prev - 1;
        } else {
          if (prev >= ROLES[roleIdx].length) { setTimeout(() => setDeleting(true), 1600); return prev; }
          return prev + 1;
        }
      });
    }, 90);
    return () => clearInterval(timer);
  }, [roleIdx, deleting]);

  return (
    <span className="font-mono text-xs md:text-sm text-em tracking-widest uppercase">
      {ROLES[roleIdx].slice(0, charIdx)}
      <span className="text-cyan animate-blink">▌</span>
    </span>
  );
}

export default function Hero({ settings, updates }) {
  const s = settings || {};

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 w-full">

        {/* ── Main two-column ── */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20 py-16 md:py-0 md:min-h-[85vh]">

          {/* LEFT — text */}
          <div className="flex-1 min-w-0">

            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-em border border-em/25 px-3 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-em animate-pulse-dot" />
              {s.availability || 'Open to internships'}
            </div>

            {/* Name — full editorial scale */}
            <h1 className="font-display font-black leading-[0.88] tracking-tight text-white mb-6"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}>
              {s.name
                ? s.name.split(' ').map((word, i, arr) => (
                    <span key={i} className="block">
                      {i === arr.length - 1
                        ? <>{word}<span className="text-em">.</span></>
                        : word}
                    </span>
                  ))
                : (
                  <>
                    <span className="block">Asiri</span>
                    <span className="block">Haris<span className="text-gradient">chan</span>dra<span className="text-em">.</span></span>
                  </>
                )
              }
            </h1>

            {/* Typewriter role */}
            <div className="h-5 mb-5">
              <Typewriter />
            </div>

            {/* University */}
            <p className="font-mono text-xs text-white/30 flex items-center gap-2 mb-5 tracking-wide">
              <GraduationCap size={12} className="text-em flex-shrink-0" />
              <span>{s.university || 'University of Moratuwa'}</span>
              {s.cgpa && (
                <><span className="text-white/15">·</span><span className="text-cyan">{s.cgpa} GPA</span></>
              )}
            </p>

            {/* Bio */}
            <p className="text-sm text-white/40 leading-relaxed max-w-sm mb-8">
              {s.bio || 'CS undergraduate building clean, fast web apps and exploring AI/ML. Based in Sri Lanka.'}
            </p>

            {/* Thin rule */}
            <div className="accent-rule mb-8" />

            {/* CTAs — sharp, no radius */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 font-display text-xs font-semibold tracking-widest uppercase bg-em text-bg px-6 py-3.5 hover:bg-cyan transition-colors duration-200"
              >
                View Work <ArrowRight size={12} />
              </a>
              {s.cvUrl ? (
                <a
                  href={s.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display text-xs font-medium tracking-widest uppercase text-white/40 border border-white/[0.1] px-6 py-3.5 hover:border-white/25 hover:text-white transition-colors duration-200"
                >
                  <Download size={12} /> Résumé
                </a>
              ) : null}
            </div>

            {/* Social row */}
            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] text-white/25 flex items-center gap-1.5 tracking-wide">
                <MapPin size={10} />
                {s.location || 'Moratuwa, LK'}
              </span>
              <div className="flex items-center gap-4 text-white/25">
                {s.githubUrl && (
                  <a href={s.githubUrl} target="_blank" rel="noopener noreferrer"
                     aria-label="GitHub" className="hover:text-em transition-colors">
                    <Github size={15} />
                  </a>
                )}
                {s.linkedinUrl && (
                  <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer"
                     aria-label="LinkedIn" className="hover:text-em transition-colors">
                    <Linkedin size={15} />
                  </a>
                )}
                {s.email && (
                  <a href={`mailto:${s.email}`} aria-label="Email"
                     className="hover:text-em transition-colors">
                    <Mail size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — frameless photo */}
          <div className="flex-shrink-0 relative w-52 md:w-64 lg:w-80">
            {/* Glow behind photo */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 60%, rgba(16,185,129,0.12) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)',
                transform: 'scale(1.5)',
              }}
            />

            {s.avatarUrl ? (
              <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={s.avatarUrl}
                  alt={s.name || 'Asiri'}
                  fill
                  className="object-cover object-top photo-fade"
                  priority
                />
              </div>
            ) : (
              <div
                className="relative w-full flex flex-col items-center justify-center select-none"
                style={{ aspectRatio: '3/4' }}
              >
                <span
                  className="font-display font-black leading-none"
                  style={{ fontSize: 'clamp(5rem, 14vw, 9rem)', letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.04)' }}
                >
                  A<span style={{ color: 'rgba(16,185,129,0.15)' }}>H</span>
                </span>
                <p className="font-mono text-[10px] tracking-widest uppercase text-white/15 mt-2">
                  set avatar in admin
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Status terminal ── */}
        {updates && updates.length > 0 && (
          <div className="mt-0 mb-16 border border-white/[0.07] bg-white/[0.02] overflow-hidden max-w-lg">
            {/* Terminal bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
              <span className="w-2 h-2 rounded-full bg-red-500/50" />
              <span className="w-2 h-2 rounded-full bg-amber-400/50" />
              <span className="w-2 h-2 rounded-full bg-em/60" />
              <span className="font-mono text-[10px] text-white/20 ml-3 tracking-widest uppercase">
                status.log — live
              </span>
            </div>
            <div className="px-4 py-4 font-mono text-xs leading-7">
              <div className="mb-1">
                <span className="text-em">$</span>{' '}
                <span className="text-white/60">asiri --status --verbose</span>
              </div>
              {updates.slice(0, 4).map(u => (
                <div key={u._id}>
                  <span className={TYPE_COLORS[u.type] || 'text-em'}>
                    ▸ {TYPE_LABELS[u.type] || u.type}
                  </span>{' '}
                  <span className="text-white/50">{u.title.toLowerCase()}</span>{' '}
                  <span className="text-white/20">· {u.date}</span>
                </div>
              ))}
              <div className="mt-1">
                <span className="text-em">$</span>{' '}
                <span className="text-cyan animate-blink">▌</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
