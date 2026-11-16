import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { PageHero, FinalCTA } from '@/components/site/Blocks';
import { Demo } from '@/components/demos';
import { ProjectVisual } from '@/components/visuals/ProjectVisual';
import { Scene } from '@/components/visuals/Scene';
import { uiLabels, demoNotes } from '@/i18n/ui-labels';

export const dynamicParams = false;
export function generateStaticParams() {
  return localeCodes.flatMap((locale) =>
    getBundle(locale).c.projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const b = getBundle(locale as LocaleCode);
  const p = b.c.projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.brand} — ${p.what}`;
  const languages = Object.fromEntries(localeCodes.map((c) => [c, `/${c}/work/${slug}`]));
  return {
    title, description: p.summary,
    alternates: { canonical: `/${locale}/work/${slug}`, languages },
    openGraph: { title, description: p.summary, url: `/${locale}/work/${slug}` },
  };
}

/** Photograph that belongs to each project's story. */
const sceneFor: Record<string, { name: Parameters<typeof Scene>[0]['name']; captionIndex: number }> = {
  'halden-objects': { name: 'ecommerce', captionIndex: 0 },
  tillo: { name: 'delivery', captionIndex: 1 },
  deskhand: { name: 'build', captionIndex: 2 },
  'linework-crm': { name: 'build', captionIndex: 3 },
  'ember-and-rye': { name: 'kitchen', captionIndex: 4 },
  slowtide: { name: 'design', captionIndex: 5 },
};

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const p = c.projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const L = (x: string) => href(locale as LocaleCode, x);
  const i = c.projects.indexOf(p);
  const next = c.projects[(i + 1) % c.projects.length];
  const service = c.services.find((s) => s.demos.includes(p.slug)) ?? c.services[0];
  const scene = sceneFor[p.slug] ?? { name: 'build', captionIndex: 0 };

  return (
    <Shell b={b}>
      <PageHero
        crumbs={[{ href: L('/work'), label: t.nav.work }, { label: p.brand }]}
        kicker={`${p.n} — ${p.brand}`}
        title={<>{p.what}</>}
        lede={p.summary}
      >
        <span className="tag concept">{t.ui.concept}</span>
        <span className="tag">{t.ui.fictional}</span>
      </PageHero>

      {/* The interface, before the words */}
      <section className="section tight" aria-labelledby="demo-h">
        <div className="wrap">
          <div className="demo-head">
            <h2 id="demo-h" className="h3">{t.work.demoTitle}</h2>
            <p className="mono muted">{t.ui.demoRuns}</p>
          </div>
          <div className="reveal"><ProjectVisual project={p} ui={uiLabels[locale as LocaleCode]} /></div>
          <div className="demo-wrap reveal" style={{ marginTop: 26 }}>
            <Demo slug={p.slug} chrome={{
              concept: t.ui.concept,
              loading: t.ui.loadingDemo,
              views: t.ui.views,
              notes: demoNotes,
              locale,
            }} />
          </div>
          <p className="notice" style={{ marginTop: 16 }}><b>{t.ui.concept}</b>{t.ui.demoNote}</p>
        </div>
      </section>

      {/* Five questions, answered plainly */}
      <section className="section tight rule" aria-labelledby="q-h">
        <div className="wrap">
          <h2 id="q-h" className="kicker">{t.work.kicker}</h2>
          <dl className="qlist">
            <div className="reveal"><dt>{t.work.whatItIs}</dt><dd>{p.what}</dd></div>
            <div className="reveal"><dt>{t.work.whoFor}</dt><dd>{p.who}</dd></div>
            <div className="reveal"><dt>{t.work.whatItSolves}</dt><dd>{p.problem}</dd></div>
            <div className="reveal"><dt>{t.work.whatBuilt}</dt><dd>{p.solution}</dd></div>
            <div className="reveal"><dt>{t.work.skills}</dt><dd><span className="chips">{p.skills.map((s) => <span className="chip" key={s}>{s}</span>)}</span></dd></div>
          </dl>
        </div>
      </section>

      <section className="section tight rule alt2">
        <div className="wrap split">
          <div className="reveal">
            <p className="kicker">{t.work.inside}</p>
            <ul className="ticks" style={{ marginTop: 18 }}>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
          <div className="reveal">
            <Scene name={scene.name} caption={p.summary} ratio="4 / 3" />
          </div>
        </div>
      </section>

      <section className="section tight rule" aria-labelledby="dec-h">
        <div className="wrap">
          <p className="kicker reveal">{t.work.decisions}</p>
          <h2 id="dec-h" className="h2 reveal" style={{ margin: '16px 0 30px', maxWidth: '18em' }}>{p.brand}</h2>
          <ol className="ledger">
            {p.decisions.map((d, k) => (
              <li key={d.title} className="reveal">
                <span className="n">{String(k + 1).padStart(2, '0')}</span>
                <h3 className="h3">{d.title}</h3>
                <p className="body">{d.body}</p>
              </li>
            ))}
          </ol>
          <div className="reveal" style={{ marginTop: 36 }}>
            <p className="kicker">{t.work.measure}</p>
            <p className="chips" style={{ marginTop: 14 }}>{p.measure.map((m) => <span className="chip" key={m}>{m}</span>)}</p>
          </div>
          <div className="reveal" style={{ marginTop: 28 }}>
            <span className="mono muted">{t.work.runsOn}: React · TypeScript · CSS · {t.ui.sampleData}</span>
          </div>
          <p className="notice reveal" style={{ marginTop: 18 }}><b>{t.ui.concept}</b>{t.work.status} {t.work.disclaimer}</p>
          <div className="reveal" style={{ marginTop: 22 }}>
            <Link className="textlink" href={L(`/services/${service.slug}`)}>{service.title} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap">
          <Link href={L(`/work/${next.slug}`)} className="nextproj" data-cursor>
            <span>
              <span className="mono muted">{t.work.nextProject} — {next.n}</span>
              <span className="h1">{next.brand} <span aria-hidden="true">→</span></span>
              <span className="muted">{next.what}</span>
            </span>
            <span className="nextproj-vis"><ProjectVisual project={next} compact ui={uiLabels[locale as LocaleCode]} /></span>
          </Link>
        </div>
      </section>

      <FinalCTA kicker={t.ui.next} q={t.home.finalQ} a={t.home.finalA} primaryHref={L('/contact')} primaryLabel={t.home.finalCta} secondaryHref={L('/work')} secondaryLabel={t.nav.work} />
    </Shell>
  );
}
