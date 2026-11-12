'use client';
import { useEffect, useRef, useState } from 'react';
import { industries } from '@/data/content';

interface P3 { x: number; y: number; z: number }
const fib = (n: number): P3[] => Array.from({ length: n }, (_, i) => {
  const y = 1 - ((i + 0.5) / n) * 2, r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
});

/**
 * An abstract sphere of industries (not a map — no geography is implied).
 * Canvas 2D, ~700 points: cheap enough to run on any phone. Draws only while visible.
 */
export function IndustryGlobe() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [sel, setSel] = useState(0);
  const selRef = useRef(0);
  const goto = useRef<((i: number) => void) | null>(null);

  useEffect(() => {
    const canvas = cv.current!, ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = fib(720), nodes = fib(industries.length).map((p) => { const y = p.y * 0.78, r = Math.sqrt(1 - y * y), a = Math.atan2(p.z, p.x); return { x: Math.cos(a) * r, y, z: Math.sin(a) * r }; });
    let ry = 0.4, rx = -0.25, ty = ry, tx = rx, auto = !reduce, raf = 0, visible = false, size = 0, dpr = 1, dirty = true;
    let drag: { x: number; y: number; moved: number } | null = null;
    let projected: { x: number; y: number; z: number }[] = [];

    const rot = (p: P3) => {
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      const x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy;
      return { x, y: p.y * cx - z * sx, z: p.y * sx + z * cx };
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2); size = canvas.clientWidth;
      canvas.width = canvas.height = Math.round(size * dpr); dirty = true;
    };
    const draw = () => {
      const R = size * 0.4, c = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size);
      const g = ctx.createRadialGradient(c - R * 0.3, c - R * 0.35, R * 0.1, c, c, R * 1.15);
      g.addColorStop(0, 'rgba(70,120,220,.16)'); g.addColorStop(1, 'rgba(70,120,220,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, R * 1.15, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(236,232,224,.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.stroke();
      for (const d of dots) { const p = rot(d); const a = p.z > 0 ? 0.16 + p.z * 0.5 : 0.06; ctx.fillStyle = `rgba(185,196,214,${a})`; const s = p.z > 0 ? 1.5 : 1; ctx.fillRect(c + p.x * R - s / 2, c - p.y * R - s / 2, s, s); }
      projected = nodes.map(rot);
      const s0 = projected[selRef.current];
      ctx.lineWidth = 1;
      projected.forEach((p, i) => {
        if (i === selRef.current || p.z < -0.1 || s0.z < -0.1) return;
        ctx.strokeStyle = `rgba(106,163,255,${0.1 + Math.max(0, p.z) * 0.16})`; ctx.beginPath(); ctx.moveTo(c + s0.x * R, c - s0.y * R);
        ctx.quadraticCurveTo(c + (s0.x + p.x) * R * 0.62, c - (s0.y + p.y) * R * 0.62, c + p.x * R, c - p.y * R); ctx.stroke();
      });
      ctx.font = `${size < 420 ? 10 : 11}px "IBM Plex Mono", monospace`; ctx.textBaseline = 'middle';
      projected.forEach((p, i) => {
        const on = i === selRef.current, x = c + p.x * R, y = c - p.y * R, front = p.z > 0;
        ctx.globalAlpha = front ? 1 : 0.22;
        ctx.fillStyle = on ? '#6aa3ff' : '#efece6'; ctx.beginPath(); ctx.arc(x, y, on ? 5 : 2.6, 0, 7); ctx.fill();
        if (on) { ctx.strokeStyle = 'rgba(106,163,255,.5)'; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.stroke(); }
        if (front && (on || p.z > 0.45)) { ctx.fillStyle = on ? '#efece6' : 'rgba(185,188,194,.75)'; const right = p.x >= 0; ctx.textAlign = right ? 'left' : 'right'; ctx.fillText(industries[i].name.toUpperCase(), x + (right ? 14 : -14), y); }
        ctx.globalAlpha = 1;
      });
    };
    const frame = () => {
      raf = 0; if (!visible) return;
      if (auto && !drag) { ty += 0.0016; }
      const dy = ty - ry, dx = tx - rx;
      if (Math.abs(dy) + Math.abs(dx) > 0.0004 || dirty) { ry += dy * 0.09; rx += dx * 0.09; dirty = false; draw(); }
      if (auto || drag || Math.abs(ty - ry) + Math.abs(tx - rx) > 0.0004) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
    goto.current = (i: number) => {
      selRef.current = i; auto = false; const n = nodes[i];
      let target = Math.atan2(n.x, n.z) * -1; // bring node to face the viewer
      while (target - ry > Math.PI) target -= Math.PI * 2; while (target - ry < -Math.PI) target += Math.PI * 2;
      ty = target; tx = Math.asin(n.y) * 0.75; dirty = true; kick();
    };
    const down = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY, moved: 0 }; canvas.setPointerCapture(e.pointerId); auto = false; kick(); };
    const move = (e: PointerEvent) => {
      if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY;
      ty += dx * 0.008; tx = Math.max(-1.1, Math.min(1.1, tx + dy * 0.008)); kick();
    };
    const up = (e: PointerEvent) => {
      const wasClick = drag && drag.moved < 6; drag = null;
      if (!wasClick) return;
      const b = canvas.getBoundingClientRect(), R = size * 0.4, c = size / 2, mx = e.clientX - b.left, my = e.clientY - b.top;
      let best = -1, bd = 26;
      projected.forEach((p, i) => { if (p.z < 0) return; const d = Math.hypot(c + p.x * R - mx, c - p.y * R - my); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { setSel(best); goto.current?.(best); }
    };
    const ro = new ResizeObserver(() => { resize(); kick(); }); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { dirty = true; kick(); } }, { threshold: 0.05 }); io.observe(canvas);
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    resize();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); };
  }, []);

  const pick = (i: number) => { setSel(i); goto.current?.(i); };
  return (
    <div className="globe">
      <div className="globe-view">
        <canvas ref={cv} aria-hidden="true" data-cursor />
        <p className="mono muted globe-hint">Drag to rotate · select a point</p>
      </div>
      <div className="globe-side">
        <ul className="globe-list" aria-label="Industries">
          {industries.map((ind, i) => (
            <li key={ind.name}><button aria-pressed={i === sel} onClick={() => pick(i)}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{ind.name}</button></li>
          ))}
        </ul>
        <div className="globe-note" aria-live="polite">
          <p className="mono muted">Typical problems in</p>
          <p className="h3" style={{ marginTop: 6 }}>{industries[sel].name}</p>
          <p className="body" style={{ marginTop: 10 }}>{industries[sel].note}</p>
        </div>
      </div>
    </div>
  );
}
