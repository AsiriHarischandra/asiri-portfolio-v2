'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog',     href: '#blog' },
  { label: 'Contact',  href: '#contact' },
];

export default function Navbar({ cvUrl = '' }) {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">

        {/* Logo — Amused Group style: spaced caps */}
        <a
          href="#hero"
          className="font-display font-black text-sm tracking-widest2 uppercase text-white hover:text-em transition-colors"
        >
          A<span className="text-cyan">H</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-display text-xs font-medium tracking-widest uppercase text-white/50 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-xs font-medium tracking-widest uppercase text-white/50 hover:text-em transition-colors"
            >
              Résumé
            </a>
          )}
          <a
            href="#contact"
            className="font-display text-xs font-semibold tracking-widest uppercase bg-em text-bg px-5 py-2.5 hover:bg-cyan transition-colors duration-200"
          >
            Hire me
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/70 hover:text-white transition"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-bg border-t border-white/[0.06] px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-xs font-medium tracking-widest uppercase text-white/60 hover:text-white transition"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="font-display text-xs font-semibold tracking-widest uppercase bg-em text-bg px-5 py-3 text-center hover:bg-cyan transition-colors"
          >
            Hire me
          </a>
        </div>
      )}
    </nav>
  );
}
