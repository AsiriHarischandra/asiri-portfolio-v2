'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

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
      if (res.status === 429) {
        setStatus('rate-limited');
        return;
      }
      if (!res.ok) throw new Error();
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch {
      setStatus('error');
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <section id="contact" className="py-28 bg-bg/80">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="bg-white/[0.04] border border-lime/25 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs text-lime/80">{'// contact'}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-2">
            Let&apos;s build something
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Have a project or an internship in mind? My inbox is open.
          </p>

          {status === 'sent' ? (
            <div className="text-em font-mono text-sm py-8">
              Message sent. I&apos;ll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
              {/* Honeypot — hidden from humans */}
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
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={set('name')}
                  className="bg-white/5 border border-em/20 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-em transition"
                />
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={set('email')}
                  className="bg-white/5 border border-em/20 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-em transition"
                />
              </div>
              <input
                placeholder="Subject (optional)"
                value={form.subject}
                onChange={set('subject')}
                className="bg-white/5 border border-em/20 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-em transition"
              />
              <textarea
                required
                rows={4}
                placeholder="Your message"
                value={form.message}
                onChange={set('message')}
                className="bg-white/5 border border-em/20 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-em transition resize-none"
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-em text-bg font-mono text-sm font-medium py-3 rounded-lg hover:shadow-lg hover:shadow-em/30 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Mail size={14} />
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-xs text-center">Something went wrong. Try again.</p>
              )}
              {status === 'rate-limited' && (
                <p className="text-amber-400 text-xs text-center">Too many messages. Try again later.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
