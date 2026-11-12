'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { locales, stripLocale } from '@/i18n/config';
import { useL, useLocale } from '@/i18n/client';
import type { Dict } from '@/i18n/en';
import { Btn } from './Btn';

interface NavLabels {
  t: Pick<Dict['ui'], 'menu' | 'close' | 'language' | 'changeLanguage' | 'start' | 'siteIndex' | 'primaryNav'>;
  nav: Dict['nav'];
  primary: { href: string; label: string }[];
  index: { href: string; label: string; note: string }[];
}

export function Nav({ labels, name }: { labels: NavLabels; name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const L = useL();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const current = stripLocale(pathname);
  const isCurrent = (h: string) => (h === '/' ? current === '/' : current.startsWith(h));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); }
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [open]);

  /** Switching language keeps the visitor on the same page. */
  const switchTo = (code: string) => {
    setOpen(false);
    router.push(`/${code}${current === '/' ? '' : current}`);
  };

  return (
    <>
      <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
        <div className="wrap nav-in">
          <Link href={L('/')} className="brand" aria-label={`${name} — ${labels.nav.work}`}>
            <span className="brand-mark" aria-hidden="true">BB</span>
            <span>{name}</span>
          </Link>
          <nav className="nav-links" aria-label={labels.t.primaryNav}>
            {labels.primary.map((l) => (
              <Link key={l.href} href={L(l.href)} className="nl" aria-current={isCurrent(l.href) ? 'page' : undefined}>{l.label}</Link>
            ))}
            <button
              className="lang-btn"
              aria-haspopup="listbox"
              onClick={() => setOpen(true)}
              aria-label={labels.t.changeLanguage}
            >
              <span aria-hidden="true">{locales.find((x) => x.code === locale)?.code.toUpperCase()}</span>
            </button>
            <Btn href={L('/contact')} small>{labels.t.start}</Btn>
            <button ref={btn} className="menu-btn" aria-expanded={open} aria-controls="site-index" onClick={() => setOpen((o) => !o)}>
              <span>{open ? labels.t.close : labels.t.menu}</span><i aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      <div id="site-index" className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <div className="wrap overlay-in">
          <nav aria-label={labels.t.siteIndex}>
            <ol className="index-list">
              {labels.index.map((l, i) => (
                <li key={l.href}>
                  <Link href={L(l.href)} aria-current={isCurrent(l.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
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
              <h3>{labels.t.language}</h3>
              <div className="langs" role="listbox" aria-label={labels.t.language}>
                {locales.map((l) => (
                  <button
                    key={l.code}
                    className="lang"
                    role="option"
                    aria-selected={l.code === locale}
                    aria-pressed={l.code === locale}
                    onClick={() => switchTo(l.code)}
                    lang={l.code}
                    dir={l.dir}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="mono muted" style={{ marginTop: 14, fontSize: 11 }}>{labels.t.language}</p>
            </div>
            <div>
              <Btn href={L('/contact')} onClick={() => setOpen(false)}>{labels.t.start}</Btn>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
