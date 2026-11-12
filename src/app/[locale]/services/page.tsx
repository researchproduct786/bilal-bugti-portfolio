import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { CapabilityVisual } from '@/components/visuals/Capability';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.services} — ${b.t.services.title}`, description: b.t.services.lede, alternates: { canonical: `/${locale}/services`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/services`])) } };
}

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  const capLabel: Record<string, [string, string]> = {
    shopify: [t.capabilities.shopify, t.capabilities.shopifyLine],
    app: [t.capabilities.app, t.capabilities.appLine],
    web: [t.capabilities.web, t.capabilities.webLine],
    automation: [t.capabilities.automation, t.capabilities.automationLine],
    crm: [t.capabilities.crm, t.capabilities.crmLine],
    ai: [t.capabilities.ai, t.capabilities.aiLine],
    marketing: [t.capabilities.marketing, t.capabilities.marketingLine],
    branding: [t.capabilities.branding, t.capabilities.brandingLine],
  };

  return (
    <Shell b={b}>
      <PageHero kicker={t.services.kicker} title={t.services.title} lede={t.services.lede} />

      <section className="section tight">
        <div className="wrap svc-list">
          {c.services.map((s) => (
            <article key={s.slug} className="svc-block reveal">
              <div className="svc-head">
                <span className="svc-letter">{s.letter}</span>
                <div>
                  <h2 className="h2">{s.title}</h2>
                  <p className="lede" style={{ marginTop: 12 }}>{s.headline}</p>
                </div>
              </div>
              <div className="svc-caps">
                {s.capabilities.map((k) => (
                  <div key={k} className="svc-cap">
                    <div className="capcard-media"><CapabilityVisual id={k} /></div>
                    <p className="capcard-t">{capLabel[k][0]}</p>
                    <p className="capcard-l">{capLabel[k][1]}</p>
                  </div>
                ))}
              </div>
              <div className="svc-foot">
                <Link className="btn" href={L(`/services/${s.slug}`)} data-magnetic><span>{t.services.viewService}</span><span className="arr" aria-hidden="true" /></Link>
                <Link className="textlink" href={L(`/work/${s.demos[0]}`)}>{t.services.seeDemo} <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FinalCTA kicker={t.ui.next} q={t.services.relatedCta} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
