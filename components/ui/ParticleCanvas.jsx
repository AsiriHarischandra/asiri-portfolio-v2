'use client';

import { useEffect, useRef } from 'react';

/**
 * Ultra-subtle floating particle background.
 * Very sparse nodes at low opacity — keeps the dark background ultra-clean
 * in line with the Amused Group minimalist aesthetic.
 * Mouse proximity gently brightens nearby nodes and draws a soft line to cursor.
 * Respects prefers-reduced-motion. Pauses when tab is hidden.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0, height = 0, dpr = 1;
    let nodes = [];
    let rafId = null;

    const LINK_DIST  = 100;   // shorter link radius — fewer visible connections
    const MOUSE_DIST = 150;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      width  = window.innerWidth;
      height = window.innerHeight;
      dpr    = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width        = width * dpr;
      canvas.height       = height * dpr;
      canvas.style.width  = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fewer nodes than before — sparser, cleaner
      const count = Math.min(60, Math.floor((width * height) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x:    Math.random() * width,
        y:    Math.random() * height,
        vx:   (Math.random() - 0.5) * 0.25,
        vy:   (Math.random() - 0.5) * 0.25,
        cyan: Math.random() < 0.2,  // 20% cyan accent nodes
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Move + wrap
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = width; else if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height; else if (n.y > height) n.y = 0;
      }

      // Node-to-node links — very faint
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.18;
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor links — emerald glow
      for (const n of nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * 0.3;
          ctx.strokeStyle = n.cyan
            ? `rgba(34,211,238,${alpha})`
            : `rgba(16,185,129,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          // gentle pull
          n.x -= (dx / dist) * 0.3;
          n.y -= (dy / dist) * 0.3;
        }
      }

      // Draw nodes — tiny, low opacity
      for (const n of nodes) {
        ctx.fillStyle = n.cyan
          ? 'rgba(34,211,238,0.5)'
          : 'rgba(16,185,129,0.45)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() { draw(); rafId = requestAnimationFrame(loop); }
    const start = () => { if (!rafId) loop(); };
    const stop  = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

    if (reduceMotion) draw(); else start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
