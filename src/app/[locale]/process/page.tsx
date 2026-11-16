import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { ProcessJourney } from '@/components/home/ProcessJourney';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: `${b.t.nav.process} — ${b.t.process.title}`, description: b.t.process.lede, alternates: { canonical: `/${locale}/process`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/process`])) } };
}

export default async function Process({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.process.kicker} title={t.process.title} lede={t.process.lede} />
      <section className="section tight">
        <div className="wrap"><ProcessJourney t={t} /></div>
      </section>
      <section className="section tight rule alt" aria-labelledby="pr-h">
        <div className="wrap split">
          <div>
            <p className="kicker reveal">{t.insights.kicker}</p>
            <h2 id="pr-h" className="h2 reveal" style={{ marginTop: 16 }}>{c.pages.insights.title}</h2>
            <p className="body reveal" style={{ marginTop: 14 }}>{c.pages.insights.lede}</p>
          </div>
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
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
