import Link from 'next/link';
import { nav, site } from '@/data/site';
import { services } from '@/data/services';
import { en } from '@/i18n/en';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="footer-word">Bilal<br />Bugti</p>
            <p className="muted" style={{ marginTop: 18, maxWidth: '26em', fontSize: 15 }}>{site.role} — {site.discipline}. Turning business problems into practical digital solutions.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>{nav.index.slice(1, 7).map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4>More</h4>
            <ul>{nav.index.slice(7).map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>)}</ul>
            {site.socials.length > 0 && (<>
              <h4 style={{ marginTop: 24 }}>Elsewhere</h4>
              <ul>{site.socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer me">{s.label}</a></li>)}</ul>
            </>)}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{en.footerNote}</span>
        </div>
      </div>
    </footer>
  );
}
