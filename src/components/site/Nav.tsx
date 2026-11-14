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
  primary: { href: string; label: string; chapter?: string }[];
  index: { href: string; label: string; note: string }[];
}

/**
 * Sections the homepage navigation points at, and the heading each one reads as.
 * On any other page these resolve to that page's own route instead.
 */
const SECTION_IDS = ['work', 'services', 'process', 'about'] as const;

export function Nav({ labels, name }: { labels: NavLabels; name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const L = useL();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const btn = useRef<HTMLButtonElement>(null);
  const current = stripLocale(pathname);
  const isHome = current === '/';

  /**
   * Active-section indication while the homepage scrolls. The menu on the left is
   * the only persistent wayfinding on a long page, so it has to say where you are:
   * the dot next to a link is driven by which chapter is currently in the upper
   * half of the viewport, not by which route is loaded.
   */
  useEffect(() => {
    if (!isHome) { setActive(''); return; }
    const els = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const inOrder = SECTION_IDS.filter((id) => seen.has(id));
        setActive(inOrder[0] ?? '');
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

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

  /** On the homepage a primary link jumps to its chapter; elsewhere it navigates. */
  const hrefFor = (item: { href: string; chapter?: string }) =>
    isHome && item.chapter ? `#${item.chapter}` : L(item.href);

  return (
    <>
      {/* `is-stuck` is the glass-density state: the pill thickens its blur and border
          once the page moves, the way a physical surface catching more light. */}
      <header className={`nav ${scrolled || open ? 'scrolled is-stuck' : ''}`}>
        <span className="nav-glass" aria-hidden="true" />
        <div className="wrap nav-in">
          {/* Everything left of centre is wayfinding: identity, the menu, and the four
              chapters. It is deliberately the first thing the eye meets, on every
              breakpoint, which is why it is not tucked away on the right. */}
          <div className="nav-left">
            <Link href={L('/')} className="brand" aria-label={`${name} — ${labels.nav.work}`}>
              <span className="brand-mark" aria-hidden="true">BB</span>
              <span>{name}</span>
            </Link>
            <button
              ref={btn}
              className="menu-btn"
              aria-expanded={open}
              aria-controls="site-index"
              /* The word is hidden on phones to keep the bar on one line, so the
                 button carries its own accessible name at every width. */
              aria-label={open ? labels.t.close : labels.t.menu}
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? labels.t.close : labels.t.menu}</span><i aria-hidden="true" />
            </button>
            <nav className="nav-links" aria-label={labels.t.primaryNav}>
              {labels.primary.map((l) => {
                const on = isHome && l.chapter ? active === l.chapter : isCurrentHref(current, l.href);
                return (
                  <Link
                    key={l.href}
                    href={hrefFor(l)}
                    className={`nl ${on ? 'is-active' : ''}`}
                    aria-current={on ? (isHome && l.chapter ? 'true' : 'page') : undefined}
                  >
                    <i className="nl-dot" aria-hidden="true" />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="nav-right">
            <button
              className="lang-btn"
              aria-haspopup="listbox"
              onClick={() => setOpen(true)}
              aria-label={labels.t.changeLanguage}
            >
              <span aria-hidden="true">{locales.find((x) => x.code === locale)?.code.toUpperCase()}</span>
            </button>
            <Btn href={L('/contact')} small>{labels.t.start}</Btn>
          </div>
        </div>
      </header>

      <div id="site-index" className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <div className="wrap overlay-in">
          <nav aria-label={labels.t.siteIndex}>
            <ol className="index-list">
              {labels.index.map((l, i) => (
                <li key={l.href}>
                  <Link href={L(l.href)} aria-current={isCurrentHref(current, l.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
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

function isCurrentHref(current: string, h: string) {
  return h === '/' ? current === '/' : current.startsWith(h);
}
