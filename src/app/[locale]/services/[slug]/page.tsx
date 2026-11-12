import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { ProjectCard } from '@/components/home/ProjectCard';
import { uiLabels } from '@/i18n/ui-labels';
import { Scene } from '@/components/visuals/Scene';
import { ServiceVisual } from '@/components/visuals/ServiceVisual';

export const dynamicParams = false;
export function generateStaticParams() {
  return localeCodes.flatMap((locale) => getBundle(locale).c.services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const b = getBundle(locale as LocaleCode);
  const s = b.c.services.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: `${s.title} — ${b.t.nav.services}`, description: s.short,
    alternates: { canonical: `/${locale}/services/${slug}`, languages: Object.fromEntries(localeCodes.map((c) => [c, `/${c}/services/${slug}`])) },
  };
}

const sceneFor: Record<string, Parameters<typeof Scene>[0]['name']> = {
  'digital-product-development': 'ecommerce',
  'ai-business-systems': 'operations',
  'digital-growth-creative': 'planning',
};

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const s = c.services.find((x) => x.slug === slug);
  if (!s) notFound();
  const L = (p: string) => href(locale as LocaleCode, p);
  const demos = s.demos.map((d) => c.projects.find((p) => p.slug === d)).filter(Boolean);

  return (
    <Shell b={b}>
      <PageHero
        crumbs={[{ href: L('/services'), label: t.nav.services }, { label: s.title }]}
        kicker={`${s.letter} — ${t.nav.services}`}
        title={s.headline}
        lede={s.short}
      />

      <section className="section tight">
        <div className="wrap">
          <ServiceVisual
            id={s.visual}
            ui={uiLabels[locale as LocaleCode]}
            captions={Object.fromEntries(['store', 'app', 'web', 'automation', 'crm', 'ai', 'marketing'].map((k, i) => [k, t.ui.svcCaption[i]])) as Record<'store' | 'app' | 'web' | 'automation' | 'crm' | 'ai' | 'marketing', string>}
          />
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap split">
          <div className="reveal">
            <p className="kicker">{t.services.problems}</p>
            <h2 className="h3" style={{ marginTop: 14 }}>{s.problemTitle}</h2>
            <p className="body" style={{ marginTop: 14 }}>{s.problemBody}</p>
          </div>
          <div className="reveal">
            <p className="kicker">{t.services.signs}</p>
            <ul className="ticks" style={{ marginTop: 16 }}>{s.signs.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section tight rule alt2">
        <div className="wrap split">
          <div className="reveal"><Scene name={sceneFor[s.slug] ?? 'build'} caption={s.solutionTitle} ratio="4 / 3" /></div>
          <div className="reveal">
            <p className="kicker">{t.services.solution}</p>
            <h2 className="h2" style={{ marginTop: 14 }}>{s.solutionTitle}</h2>
            <p className="body" style={{ marginTop: 16 }}>{s.solutionBody}</p>
          </div>
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap">
          <p className="kicker reveal">{t.services.included}</p>
          <div className="incgrid">
            {s.included.map((inc) => (
              <div key={inc.title} className="inccard reveal">
                <h3 className="h3">{inc.title}</h3>
                <ul className="ticks" style={{ marginTop: 14 }}>{inc.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <ol className="ledger" style={{ marginTop: 44 }}>
            {s.steps.map((st, i) => (
              <li key={st.title} className="reveal">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{st.title}</h3>
                <p className="body">{st.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tight rule alt">
        <div className="wrap">
          <p className="kicker reveal">{t.services.demos}</p>
          <ul className="workgrid2" style={{ marginTop: 24 }}>
            {demos.map((p) => p && <li key={p.slug}><ProjectCard project={p} t={t} L={L} ui={uiLabels[locale as LocaleCode]} /></li>)}
          </ul>
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap split">
          <div><p className="kicker reveal">{t.services.faqs}</p></div>
          <div className="reveal">
            {s.faqs.map((f) => <details className="faq" key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </div>
      </section>

      <FinalCTA kicker={t.ui.next} q={t.services.relatedCta} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.work.kicker} />
    </Shell>
  );
}
