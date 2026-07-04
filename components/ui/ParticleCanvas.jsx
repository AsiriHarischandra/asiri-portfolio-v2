'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated neural-network background.
 * Full-viewport fixed canvas sitting behind all content. Nodes drift slowly and
 * link to nearby nodes with fading lines; the cursor pulls in and lights up
 * nearby nodes. Respects prefers-reduced-motion (renders a single static frame)
 * and pauses while the tab is hidden.
 *
 * Colors come from the design tokens: emerald #10B981 + lime #A3E635.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let rafId = null;

    const LINK_DIST = 130;       // px: link nodes closer than this
    const MOUSE_DIST = 180;      // px: cursor influence radius
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale node count with screen area, capped for performance.
      const count = Math.min(110, Math.floor((width * height) / 15000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        lime: Math.random() < 0.18, // a few lime accent nodes
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Move + wrap nodes.
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = width;
        else if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        else if (n.y > height) n.y = 0;
      }

      // Links between nearby nodes.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.4;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor links + gentle attraction.
      for (const n of nodes) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * 0.55;
          ctx.strokeStyle = `rgba(163, 230, 53, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          // Pull slightly toward the cursor.
          n.x -= (dx / dist) * 0.4;
          n.y -= (dy / dist) * 0.4;
        }
      }

      // Nodes on top.
      for (const n of nodes) {
        ctx.fillStyle = n.lime ? 'rgba(163, 230, 53, 0.9)' : 'rgba(16, 185, 129, 0.85)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.lime ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (rafId == null) loop();
    }
    function stop() {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduceMotion) {
      draw(); // single static frame, no animation
    } else {
      start();
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
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
