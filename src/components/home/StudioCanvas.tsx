'use client';
import { useEffect, useRef } from 'react';
import type { StudioScene } from '@/three/studio';

interface Props { onScene?: (s: StudioScene | null) => void; onReady?: () => void; parallax?: boolean; className?: string }

/**
 * Mounts the studio scene. The Three.js bundle is imported only here, at runtime,
 * so pages that never show the canvas never download it. Rendering pauses whenever
 * the canvas is off-screen or the tab is hidden, and every GPU resource is released on unmount.
 */
export default function StudioCanvas({ onScene, onReady, parallax = true, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef({ onScene, onReady });
  cb.current = { onScene, onReady };

  useEffect(() => {
    const canvas = ref.current!;
    let scene: StudioScene | null = null;
    let dead = false, inView = false;
    const cleanups: (() => void)[] = [];
    const sync = () => scene?.setActive(inView && !document.hidden);

    import('@/three/studio').then(({ StudioScene }) => {
      if (dead) return;
      try { scene = new StudioScene(canvas, { onReady: () => cb.current.onReady?.() }); } catch (e) { console.warn('3D scene unavailable', e); return; }
      cb.current.onScene?.(scene);
      const ro = new ResizeObserver(() => scene?.resize()); ro.observe(canvas);
      const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.01 }); io.observe(canvas);
      document.addEventListener('visibilitychange', sync);
      const move = (e: PointerEvent) => scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      if (parallax) window.addEventListener('pointermove', move, { passive: true });
      const lost = (e: Event) => { e.preventDefault(); scene?.setActive(false); };
      canvas.addEventListener('webglcontextlost', lost);
      cleanups.push(() => ro.disconnect(), () => io.disconnect(), () => document.removeEventListener('visibilitychange', sync), () => window.removeEventListener('pointermove', move), () => canvas.removeEventListener('webglcontextlost', lost));
    });
    return () => { dead = true; cleanups.forEach((c) => c()); cb.current.onScene?.(null); scene?.dispose(); };
  }, [parallax]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
