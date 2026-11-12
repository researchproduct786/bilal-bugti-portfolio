'use client';
import Link from '@/components/site/L';
import type { ReactNode } from 'react';
import { Btn } from './Btn';
import { useT } from '@/i18n/client';

export function PageHero({ crumbs, kicker, title, lede, children }: { crumbs?: { href?: string; label: string }[]; kicker: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  const t = useT();
  return (
    <header className="phero">
      <div className="wrap">
        {crumbs && (
          <nav className="crumbs" aria-label={t('Breadcrumb')}>
            {crumbs.map((c, i) => (
              <span key={i}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}{i < crumbs.length - 1 && <span aria-hidden="true">&nbsp;&nbsp;/</span>}</span>
            ))}
          </nav>
        )}
        <p className="kicker" style={{ marginTop: crumbs ? 28 : 0 }}>{kicker}</p>
        <h1 className="h1">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children && <div className="phero-meta">{children}</div>}
      </div>
    </header>
  );
}

export function FinalCTA({ q, a }: { q?: string; a?: string }) {
  const t = useT();
  q = q ?? t('Have a problem worth solving?'); a = a ?? t('Let’s turn your idea into something real.');
  return (
    <section className="final" aria-labelledby="final-q">
      <div className="wrap">
        <p className="kicker reveal">{t('Next step')}</p>
        <h2 id="final-q" className="q reveal" style={{ marginTop: 26 }}>{q}</h2>
        <p className="a reveal">{a}</p>
        <div className="row reveal">
          <Btn href="/contact">{t('Start a project')}</Btn>
          <Btn href="/process" variant="ghost">{t('See how I work')}</Btn>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ kicker, title, children, id }: { kicker: string; title: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="split" style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}>
      <div><p className="kicker reveal">{kicker}</p></div>
      <div>
        <h2 id={id} className="h2 reveal">{title}</h2>
        {children && <div className="lede reveal" style={{ marginTop: 24 }}>{children}</div>}
      </div>
    </div>
  );
}
