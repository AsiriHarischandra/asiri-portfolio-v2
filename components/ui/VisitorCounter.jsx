'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Only count once per browser session — avoids inflating on refreshes
    const alreadyCounted = sessionStorage.getItem('v_counted');

    if (alreadyCounted) {
      // Just read without incrementing
      fetch('/api/visitors')
        .then(r => r.json())
        .then(d => setCount(d.count))
        .catch(() => {});
    } else {
      // First visit this session — increment
      fetch('/api/visitors', { method: 'POST' })
        .then(r => r.json())
        .then(d => {
          setCount(d.count);
          sessionStorage.setItem('v_counted', '1');
        })
        .catch(() => {});
    }
  }, []);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-white/20">
      <Eye size={10} />
      {count.toLocaleString()} visitors
    </span>
  );
}
