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
  return { title: `${b.t.nav.insights} — ${b.c.pages.insights.title}`, description: b.c.pages.insights.lede, alternates: { canonical: `/${locale}/insights`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/insights`])) } };
}

export default async function Insights({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.insights.kicker} title={c.pages.insights.title} lede={c.pages.insights.lede} />
      <section className="section tight">
        <div className="wrap split">
          <ol className="notes big">
            {c.lessons.map((l, i) => (
              <li key={l.title} className="reveal">
                <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="h3">{l.title}</h2><p className="body">{l.body}</p>
              </li>
            ))}
          </ol>
          <div className="reveal"><Scene name="planning" caption={c.pages.insights.draft} ratio="4 / 5" /></div>
        </div>
      </section>
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/about')} secondaryLabel={t.nav.about} />
    </Shell>
  );
}
