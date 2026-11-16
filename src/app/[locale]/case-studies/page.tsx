import type { Metadata } from 'next';
import Link from 'next/link';
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
  return { title: `${b.t.nav.caseStudies} — ${b.c.pages.caseStudies.title}`, description: b.c.pages.caseStudies.lede, alternates: { canonical: `/${locale}/case-studies`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/case-studies`])) } };
}

export default async function CaseStudies({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <PageHero kicker={t.nav.caseStudies} title={c.pages.caseStudies.title} lede={c.pages.caseStudies.lede} />
      <section className="section tight">
        <div className="wrap">
          {c.projects.map((p) => (
            <article key={p.slug} className="csblock reveal">
              <div className="cshead">
                <span className="mono muted">{p.n}</span>
                <h2 className="h3">{p.brand}</h2>
                <Link className="textlink" href={L(`/work/${p.slug}`)}>{t.work.openDemo} <span aria-hidden="true">→</span></Link>
              </div>
              <ol className="ledger">
                {p.decisions.map((d, k) => (
                  <li key={d.title}><span className="n">{String(k + 1).padStart(2, '0')}</span><h3 className="h3">{d.title}</h3><p className="body">{d.body}</p></li>
                ))}
              </ol>
            </article>
          ))}
          <p className="notice" style={{ marginTop: 32 }}><b>{t.ui.concept}</b>{c.pages.caseStudies.note}</p>
        </div>
      </section>
      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
