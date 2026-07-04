'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.status === 429) {
        setError('Too many attempts. Try again in 15 minutes.');
        return;
      }

      if (!res.ok) {
        setError('Wrong password.');
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <form
        onSubmit={login}
        className="bg-white/[0.04] border border-em/20 rounded-2xl p-10 w-full max-w-sm flex flex-col gap-4"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-em/10 mx-auto mb-2">
          <Lock size={20} className="text-em" />
        </div>
        <h1 className="font-display text-xl font-bold text-center">Admin</h1>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/5 border border-em/20 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-em transition"
        />

        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-em text-bg font-mono text-sm font-medium py-3 rounded-lg hover:shadow-lg hover:shadow-em/30 transition disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
