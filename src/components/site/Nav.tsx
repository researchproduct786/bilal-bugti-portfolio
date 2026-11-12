'use client';
import Link from '@/components/site/L';
import { usePathname } from 'next/navigation';
import { useT } from '@/i18n/client';
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '@/data/site';
import { locales, localePath, stripLocale, LOCALE_COOKIE } from '@/i18n/config';
import { setSound } from './sound';
import { Btn } from './Btn';

export function Nav() {
  const t = useT();
  const pathname = stripLocale(usePathname() || '/');
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
          <Link href="/" className="brand" aria-label={`${site.name} — ${t('Home')}`}>
            <span className="brand-mark" aria-hidden="true">BB</span>
            <span>{site.name}</span>
          </Link>
          <nav className="nav-links" aria-label={t('Primary')}>
            {nav.primary.map((l) => (
              <Link key={l.href} href={l.href} className="nl" aria-current={isCurrent(l.href) ? 'page' : undefined}>{t(l.label)}</Link>
            ))}
            <Btn href="/contact" small>{t('Start a project')}</Btn>
            <details className="langpick">
              <summary aria-label={t('Language')}><span aria-hidden="true">{t.locale === 'zh-Hans' ? '中文' : t.locale.toUpperCase()}</span></summary>
              <div className="langpick-menu">
                {locales.map((l) => (
                  <a key={l.code} lang={l.code} hrefLang={l.code} href={localePath(l.code, pathname)} aria-current={l.code === t.locale ? 'true' : undefined} onClick={() => { document.cookie = `${LOCALE_COOKIE}=${l.code}; path=/; max-age=31536000; samesite=lax`; }}>{l.label}</a>
                ))}
              </div>
            </details>
            <button ref={btn} className="menu-btn" aria-expanded={open} aria-controls="site-index" onClick={() => setOpen((o) => !o)}>
              <span>{open ? t('Close') : t('Menu')}</span><i aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      <div id="site-index" className={`overlay ${open ? 'open' : ''}`} aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <div className="wrap overlay-in">
          <nav aria-label={t('Site index')}>
            <ol className="index-list">
              {nav.index.map((l, i) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={isCurrent(l.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="t">{t(l.label)}</span>
                    <span className="d">{t(l.note)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <aside className="overlay-side">
            <div>
              <h3>{t('Language')}</h3>
              <div className="langs" role="group" aria-label={t('Language')}>
                {locales.map((l) => (
                  <a key={l.code} className="lang" lang={l.code} hrefLang={l.code} dir={l.dir} href={localePath(l.code, pathname)} aria-current={l.code === t.locale ? 'true' : undefined} title={l.english}
                    onClick={() => { document.cookie = `${LOCALE_COOKIE}=${l.code}; path=/; max-age=31536000; samesite=lax`; }}>
                    {l.label}
                  </a>
                ))}
              </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 12, maxWidth: '30em' }}>
                {t('The whole site is available in six languages. English is the original; the other editions have not been reviewed by professional translators.')}
              </p>
            </div>
            <div>
              <h3>{t('Interface sound')}</h3>
              <button className="toggle" aria-pressed={sound} onClick={() => { const v = !sound; setSoundState(v); setSound(v); }}>
                <span className="sw" aria-hidden="true" />{sound ? t('Sound on') : t('Sound off')}
              </button>
            </div>
            <div>
              <h3>{t('Start')}</h3>
              <Btn href="/contact">{t('Start a project')}</Btn>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
