'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 429) { setStatus('rate-limited'); return; }
      if (!res.ok) throw new Error();
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch {
      setStatus('error');
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const inputClass =
    'bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-em transition-colors font-body w-full';

  return (
    <section id="contact" className="py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="flex items-end gap-6 mb-16">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-em/60 block mb-2">04 / Contact</span>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-none tracking-tight">
              Let&apos;s Talk<span className="text-em">.</span>
            </h2>
          </div>
          <div className="hidden md:block flex-1 h-px bg-white/[0.06] mb-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <div>
            <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-sm">
              Have a project, an internship opportunity, or just want to say hi?
              My inbox is always open — I read and reply to every message.
            </p>
            <div className="accent-rule mb-6" />
            <div className="space-y-4 font-mono text-xs text-white/30 tracking-widest uppercase">
              <div className="flex items-center gap-3">
                <span className="text-em">▸</span>
                <span>Response within 24h</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-em">▸</span>
                <span>Open to internships 2025</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-em">▸</span>
                <span>Remote & on-site</span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === 'sent' ? (
              <div className="card p-10 text-center">
                <span className="font-display text-5xl font-black text-em block mb-3">✓</span>
                <p className="font-display font-semibold text-white mb-1">Message sent.</p>
                <p className="font-mono text-xs text-white/30 tracking-widest uppercase">I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={set('honeypot')}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 h-0 w-0 pointer-events-none"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input required placeholder="Name" value={form.name} onChange={set('name')} className={inputClass} />
                  <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} className={inputClass} />
                </div>
                <input placeholder="Subject (optional)" value={form.subject} onChange={set('subject')} className={inputClass} />
                <textarea
                  required rows={5}
                  placeholder="Your message"
                  value={form.message}
                  onChange={set('message')}
                  className={`${inputClass} resize-none`}
                />

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="font-display text-xs font-semibold tracking-widest uppercase bg-em text-bg px-6 py-4 hover:bg-cyan transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                >
                  <Mail size={12} />
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                  {status !== 'sending' && <ArrowRight size={12} />}
                </button>

                {status === 'error' && (
                  <p className="text-red-400 font-mono text-[10px] tracking-widest uppercase text-center">
                    Something went wrong — try again.
                  </p>
                )}
                {status === 'rate-limited' && (
                  <p className="text-amber-400 font-mono text-[10px] tracking-widest uppercase text-center">
                    Too many messages — try later.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
