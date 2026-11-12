'use client';
import Link from '@/components/site/L';
import { nav, site } from '@/data/site';
import { services } from '@/data/services';
import { useT } from '@/i18n/client';

export function Footer() {
  const t = useT();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="footer-word">Bilal<br />Bugti</p>
            <p className="muted" style={{ marginTop: 18, maxWidth: '26em', fontSize: 15 }}>{t(site.role)} — {t(site.discipline)}. {t('Turning business problems into practical digital solutions.')}</p>
          </div>
          <div>
            <h4>{t('Explore')}</h4>
            <ul>{nav.index.slice(1, 7).map((l) => <li key={l.href}><Link href={l.href}>{t(l.label)}</Link></li>)}</ul>
          </div>
          <div>
            <h4>{t('More')}</h4>
            <ul>{nav.index.slice(7).map((l) => <li key={l.href}><Link href={l.href}>{t(l.label)}</Link></li>)}</ul>
          </div>
          <div>
            <h4>{t('Services')}</h4>
            <ul>{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{t(s.title)}</Link></li>)}</ul>
            {site.socials.length > 0 && (<>
              <h4 style={{ marginTop: 24 }}>{t('Elsewhere')}</h4>
              <ul>{site.socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer me">{s.label}</a></li>)}</ul>
            </>)}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{t('All projects shown are self-initiated concept work with fictional brands and sample data.')}</span>
        </div>
      </div>
    </footer>
  );
}
