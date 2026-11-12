import Link from 'next/link';
import type { ReactNode } from 'react';
import { Btn } from './Btn';

export function PageHero({
  crumbs, kicker, title, lede, children,
}: {
  crumbs?: { href?: string; label: string }[];
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="phero">
      <div className="wrap">
        {crumbs && (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={i}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true">&nbsp;&nbsp;/</span>}
              </span>
            ))}
          </nav>
        )}
        <p className="kicker" style={{ marginTop: crumbs ? 24 : 0 }}>{kicker}</p>
        <h1 className="h1">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children && <div className="phero-meta">{children}</div>}
      </div>
    </header>
  );
}

/** Final call to action. Copy always comes from the locale dictionary. */
export function FinalCTA({
  kicker, q, a, primaryHref, primaryLabel, secondaryHref, secondaryLabel,
}: {
  kicker: string;
  q: string;
  a: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="final" aria-labelledby="final-q">
      <div className="wrap">
        <p className="kicker reveal">{kicker}</p>
        <h2 id="final-q" className="q reveal" style={{ marginTop: 22 }}>{q}</h2>
        <p className="a reveal">{a}</p>
        <div className="row reveal">
          <Btn href={primaryHref}>{primaryLabel}</Btn>
          {secondaryHref && secondaryLabel && <Btn href={secondaryHref} variant="ghost">{secondaryLabel}</Btn>}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ kicker, title, children, id }: { kicker: string; title: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="split" style={{ marginBottom: 'clamp(28px, 5vw, 72px)' }}>
      <div><p className="kicker reveal">{kicker}</p></div>
      <div>
        <h2 id={id} className="h2 reveal">{title}</h2>
        {children && <div className="lede reveal" style={{ marginTop: 18 }}>{children}</div>}
      </div>
    </div>
  );
}
