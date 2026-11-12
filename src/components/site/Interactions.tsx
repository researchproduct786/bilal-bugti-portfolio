'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Site-wide progressive enhancements, mounted once:
 *  - scroll reveal (one IntersectionObserver for every `.reveal`)
 *  - custom cursor + magnetic buttons (fine pointers only, never with reduced motion)
 * Everything is cleaned up on unmount and nothing here is required for the site to work.
 */
export function Interactions() {
  const pathname = usePathname();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  // Reveal on scroll — re-scan after each navigation.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'));
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    let x = -100, y = -100, rx = x, ry = y, raf = 0, running = false;
    let magnet: HTMLElement | null = null;
    const r = ring.current!, d = dot.current!;

    const loop = () => {
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(x - rx) + Math.abs(y - ry) > 0.2) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      r.classList.add('on'); d.classList.add('on');
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
      const t = e.target as HTMLElement;
      r.classList.toggle('hot', !!t.closest?.('a, button, summary, [data-cursor]'));
      const m = t.closest?.('[data-magnetic]') as HTMLElement | null;
      if (magnet && magnet !== m) { magnet.style.transform = ''; magnet = null; }
      if (m) {
        magnet = m;
        const b = m.getBoundingClientRect();
        m.style.transform = `translate(${(x - (b.left + b.width / 2)) * 0.18}px, ${(y - (b.top + b.height / 2)) * 0.28}px)`;
      }
    };
    const leave = () => { r.classList.remove('on'); d.classList.remove('on'); if (magnet) { magnet.style.transform = ''; magnet = null; } };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (<><div ref={ring} className="cursor" aria-hidden="true" /><div ref={dot} className="cursor-dot" aria-hidden="true" /></>);
}
