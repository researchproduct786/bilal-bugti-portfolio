import Link from 'next/link';
import { en } from '@/i18n/en';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="nf">
      <div className="wrap">
        <p className="nf-code" aria-hidden="true">404</p>
        <h1 className="h1" style={{ marginTop: 18 }}>{en.notFound.title}</h1>
        <p className="lede" style={{ marginTop: 16 }}>{en.notFound.body}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
          <Link className="btn" href="/en"><span>{en.notFound.cta}</span><span className="arr" aria-hidden="true" /></Link>
          <Link className="btn ghost" href="/en/work"><span>{en.nav.work}</span><span className="arr" aria-hidden="true" /></Link>
        </div>
        <ul className="langs" style={{ marginTop: 28 }}>
          {[['en','English'],['ar','العربية'],['es','Español'],['de','Deutsch'],['fr','Français'],['zh','简体中文']].map(([code,label]) => (
            <li key={code}><Link className="lang" href={`/${code}`} lang={code}>{label}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
