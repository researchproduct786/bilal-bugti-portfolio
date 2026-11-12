import Link from 'next/link';
import { href } from '@/i18n/config';
import type { LocaleBundle } from '@/i18n/dictionaries';

/** Footer is a server component: the whole label set is passed in, so nothing is left in English. */
export function Footer({ b, name }: { b: LocaleBundle; name: string }) {
  const { locale, t, c } = b;
  const L = (p: string) => href(locale, p);
  const explore = [
    { href: '/work', label: t.nav.work },
    { href: '/services', label: t.nav.services },
    { href: '/process', label: t.nav.process },
    { href: '/industries', label: t.nav.industries },
  ];
  const more = [
    { href: '/about', label: t.nav.about },
    { href: '/case-studies', label: t.nav.caseStudies },
    { href: '/insights', label: t.nav.insights },
    { href: '/lab', label: t.nav.lab },
    { href: '/contact', label: t.nav.contact },
  ];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="footer-word">Bilal<br />Bugti</p>
            <p className="muted" style={{ marginTop: 18, maxWidth: '26em', fontSize: 15 }}>{t.meta.role} — {t.meta.discipline}.</p>
          </div>
          <div>
            <h4>{t.ui.explore}</h4>
            <ul>{explore.map((l) => <li key={l.href}><Link href={L(l.href)}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4>{t.nav.about}</h4>
            <ul>{more.map((l) => <li key={l.href}><Link href={L(l.href)}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4>{t.nav.services}</h4>
            <ul>{c.services.map((s) => <li key={s.slug}><Link href={L(`/services/${s.slug}`)}>{s.title}</Link></li>)}</ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>{t.ui.footerNote}</span>
        </div>
      </div>
    </footer>
  );
}
