'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '@/data/site';
import { locales } from '@/i18n/config';
import { en } from '@/i18n/en';
import { setSound } from './sound';
import { Btn } from './Btn';

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sound, setSoundState] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
        <div className="wrap nav-in">
          <Link href="/" className="brand" aria-label={`${site.name} — home`}>
            <span className="brand-mark" aria-hidden="true">BB</span>
            <span>{site.name}</span>
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {nav.primary.map((l) => (
              <Link key={l.href} href={l.href} className="nl" aria-current={isCurrent(l.href) ? 'page' : undefined}>{l.label}</Link>
            ))}
            <Btn href="/contact" small>{en.startProject}</Btn>
            <button ref={btn} className="menu-btn" aria-expanded={open} aria-controls="site-index" onClick={() => setOpen((o) => !o)}>
              <span>{open ? en.close : en.menu}</span><i aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      <div id="site-index" className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <div className="wrap overlay-in">
          <nav aria-label="Site index">
            <ol className="index-list">
              {nav.index.map((l, i) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={isCurrent(l.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="t">{l.label}</span>
                    <span className="d">{l.note}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <aside className="overlay-side">
            <div>
              <h3>{en.language}</h3>
              <div className="langs" role="group" aria-label="Language">
                {locales.map((l) => (
                  <button key={l.code} className="lang" lang={l.code} aria-pressed={l.status === 'live'} disabled={l.status !== 'live'} title={l.status === 'live' ? l.english : `${l.english} — planned, not yet available`}>
                    {l.label}{l.status !== 'live' && <small>{en.planned}</small>}
                  </button>
                ))}
              </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 12, maxWidth: '30em' }}>
                English is the complete, reviewed edition. Other languages will be published only after professional review.
              </p>
            </div>
            <div>
              <h3>Interface sound</h3>
              <button className="toggle" aria-pressed={sound} onClick={() => { const v = !sound; setSoundState(v); setSound(v); }}>
                <span className="sw" aria-hidden="true" />{sound ? en.soundOn : en.soundOff}
              </button>
            </div>
            <div>
              <h3>Start</h3>
              <Btn href="/contact">{en.startProject}</Btn>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
