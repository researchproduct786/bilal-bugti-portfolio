import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { Scene } from '@/components/visuals/Scene';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.about} — ${b.t.about.title}`, description: b.t.about.lede, alternates: { canonical: `/${locale}/about`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/about`])) } };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.about.kicker} title={t.about.title} lede={t.about.lede} />

      <section className="section tight">
        <div className="wrap about2-in">
          <figure className="about2-fig reveal">
            <img src="/img/portrait-bilal.webp" alt={t.ui.portraitNote} width={1024} height={1024} loading="lazy" decoding="async" />
            <figcaption className="mono muted">{t.ui.portraitNote}</figcaption>
          </figure>
          <div>
            <p className="kicker reveal">{t.about.inShort}</p>
            <p className="about-lead reveal">{t.home.introBody}</p>
            <dl className="spec reveal" style={{ marginTop: 30 }}>
              <dt>{t.about.focus}</dt><dd>{t.capabilities.shopify}, {t.capabilities.app}, {t.capabilities.web}</dd>
              <dt>{t.about.also}</dt><dd>{t.capabilities.ai}, {t.capabilities.automation}, {t.capabilities.crm}, {t.capabilities.marketing}, {t.capabilities.branding}</dd>
              <dt>{t.about.background}</dt><dd>{t.home.aboutBody}</dd>
            </dl>
            <p className="notice reveal" style={{ marginTop: 24 }}><b>{t.about.honest}</b>{t.about.honestBody}</p>
          </div>
        </div>
      </section>

      <section className="section tight rule alt" aria-labelledby="ch-h">
        <div className="wrap">
          <p className="kicker reveal">{t.about.journey}</p>
          <h2 id="ch-h" className="h2 reveal" style={{ margin: '16px 0 clamp(24px, 4vw, 48px)' }}>{c.pages.insights.title}</h2>
          <ol className="bigchapters">
            {c.story.map((s) => (
              <li key={s.n} className="reveal">
                <span className="mono muted">{s.n}</span>
                <h3 className="serif">{s.title}</h3>
                <p className="body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap split">
          <div><p className="kicker reveal">{t.about.lessons}</p><h2 className="h2 reveal" style={{ marginTop: 16 }}>{t.about.lessons}</h2></div>
          <ol className="notes">
            {c.lessons.map((l, i) => (
              <li key={l.title} className="reveal">
                <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{l.title}</h3><p className="body">{l.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tight rule alt2">
        <div className="wrap duo">
          <Scene name="testing" caption={t.process.step6Body} ratio="4 / 3" />
          <Scene name="build" caption={t.process.step5Body} ratio="4 / 3" />
        </div>
      </section>

      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
