import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';

export const dynamicParams = false;
export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const b = getBundle(locale as LocaleCode);
  return { title: b.c.pages.results.title, description: b.c.pages.results.lede, alternates: { canonical: `/${locale}/results`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/results`])) }, robots: { index: false, follow: true } };
}

export default async function Results({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.insights.kicker} title={c.pages.results.title} lede={c.pages.results.lede} />
      <section className="section tight">
        <div className="wrap">
          <ol className="ledger">
            {c.projects.map((p) => (
              <li key={p.slug} className="reveal">
                <span className="n">{p.n}</span>
                <h2 className="h3">{p.brand}</h2>
                <p className="chips">{p.measure.map((m) => <span className="chip" key={m}>{m}</span>)}</p>
              </li>
            ))}
          </ol>
          <p className="notice" style={{ marginTop: 30 }}><b>{t.ui.sampleData}</b>{c.pages.results.note}</p>
        </div>
      </section>
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/process')} secondaryLabel={t.nav.process} />
    </Shell>
  );
}
