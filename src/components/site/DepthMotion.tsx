'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Depth motion.
 *
 * The brief asks for cinematic, continuous scroll motion rather than a single
 * repeated fade. This module provides that with GSAP + ScrollTrigger, but under
 * four strict conditions:
 *
 *   1. It is opt-in and additive. If GSAP fails to load, or the visitor prefers
 *      reduced motion, or the device reports few cores, the CSS reveal system in
 *      `Interactions` already handles entrances — nothing is lost.
 *   2. Every animation writes only `transform`, `opacity` and `filter`. No
 *      layout-triggering properties.
 *   3. Parallax is disabled below 900px and on touch-first devices, where the
 *      extra scroll work costs frames and the effect is invisible anyway.
 *   4. Nothing is pinned. There is no scroll hijacking, no forced scroll
 *      distance, and no entrance that delays reading the page.
 *
 * Declarative contract, read off data attributes:
 *   [data-depth="0.18"]  element drifts at that fraction of scroll distance
 *   [data-drift="x"]     element translates horizontally as it crosses the viewport
 *   [data-scale-in]      element settles from slightly larger as it enters
 *   [data-stagger]       direct children appear in sequence
 */
export function DepthMotion() {
  const pathname = usePathname();

  useEffect(() => {
    // One short diagnostic line so the effect can be verified from a browser console
    // or an automated check rather than assumed.
    const mark = (state: string) => {
      (window as unknown as { __depth?: string }).__depth = state;
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { mark('reduced-motion'); return; }

    // A cheap capability gate: very low-core devices get the CSS reveals only.
    const cores = navigator.hardwareConcurrency ?? 8;
    // `pointer: coarse` describes the primary pointing device more reliably than
    // `hover: none`, which also matches desktop browsers in some emulated or
    // touch-screen configurations and would silently switch the effect off.
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (cores <= 2) { mark('low-power'); return; }

    let killed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (killed) return;
      mark('gsap-ready');
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ ease: 'power3.out', duration: 1 });

      let created = 0;
      const ctx = gsap.context(() => {
        /* ── Vertical drift: the core parallax. Background layers move slower,
              foreground panels faster, so the page reads as having depth. */
        const allowParallax = window.innerWidth >= 900 && !coarse;
        if (allowParallax) {
          gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((el) => {
            const amount = parseFloat(el.dataset.depth || '0.2');
            created++;
            // 30 rather than 14: at 14 the drift was a few pixels and read as nothing.
            // 30 gives a clear speed difference between planes without visible wobble.
            const travel = amount * 30;
            gsap.fromTo(
              el,
              { yPercent: -travel },
              {
                yPercent: travel,
                ease: 'none',
                scrollTrigger: {
                  trigger: el.closest('section') || el,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          /* ── Horizontal drift for panels that should slide past the viewer. */
          gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
            const dist = parseFloat(el.dataset.drift || '40');
            gsap.fromTo(
              el,
              { x: -dist },
              {
                x: dist,
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        }

        /* ── Staggered entrances for lists of related things. Children keep
              their own content; only opacity/transform are touched. */
        gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((parent) => {
          const kids = Array.from(parent.children) as HTMLElement[];
          if (!kids.length) return;
          // Anything already on screen is never hidden: a visitor does not see a blank
          // block just because the trigger was created after the block had passed it.
          if (parent.getBoundingClientRect().top < window.innerHeight * 0.88) return;
          gsap.set(kids, { opacity: 0, y: 26 });
          ScrollTrigger.create({
            trigger: parent,
            start: 'top 88%',
            once: true,
            onEnter: () =>
              gsap.to(kids, { opacity: 1, y: 0, duration: 0.9, stagger: 0.075, ease: 'power3.out' }),
          });
        });

        /* ── Settle-from-larger, used sparingly on a few large panels. */
        gsap.utils.toArray<HTMLElement>('[data-scale-in]').forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
          gsap.fromTo(
            el,
            { scale: 1.045, opacity: 0.55 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            },
          );
        });

        /* ── The hero: as the page scrolls away, the subject rises slightly
              faster than the panels around it, which is what produces the
              cutout illusion persisting rather than flattening. */
        const subject = document.querySelector<HTMLElement>('[data-hero-subject]');
        if (subject) created++;
        const back = document.querySelector<HTMLElement>('[data-hero-back]');
        const front = document.querySelector<HTMLElement>('[data-hero-front]');
        if (subject && window.innerWidth >= 900 && !coarse) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: subject.closest('section') as HTMLElement,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
            },
          });
          tl.to(subject, { yPercent: -9, scale: 1.05, ease: 'none' }, 0);
          if (back) tl.to(back, { yPercent: 6, scale: 0.97, ease: 'none' }, 0);
          if (front) tl.to(front, { yPercent: 14, ease: 'none' }, 0);
        }

        /* ── Defocus: sections that are two screens away lose a little focus.
              Applied only to marked decoration, never to body copy. */
        gsap.utils.toArray<HTMLElement>('[data-dof]').forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 12%',
            end: 'bottom 8%',
            onLeave: () => el.classList.add('is-back'),
            onEnterBack: () => el.classList.remove('is-back'),
          });
        });

        ScrollTrigger.refresh();
      });

      mark(`gsap-ready:${created}:parallax=${window.innerWidth >= 900 && !coarse}`);
      cleanup = () => ctx.revert();
    })().catch((err: unknown) => {
      /* GSAP unavailable: the CSS reveals remain, nothing breaks. */
      mark('fallback: ' + String(err).slice(0, 80));
    });

    return () => {
      killed = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
