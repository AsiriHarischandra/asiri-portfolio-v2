'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: '~/home',    href: '#hero' },
  { label: 'about',     href: '#about' },
  { label: 'projects',  href: '#projects' },
  { label: 'blog',      href: '#blog' },
  { label: 'contact',   href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-em/10">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <a href="#hero" className="font-display font-extrabold text-lg text-em">
          asiri<span className="text-lime">/</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="font-mono text-xs text-gray-400 hover:text-em transition">
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-em/30 transition"
          >
            Contact me
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-em"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-bg2 border-t border-em/10 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-gray-400 hover:text-em transition"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
