import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import Link from '@/components/site/L';
import { notFound } from 'next/navigation';
import { DEMO_NOTE, getProject, projects as projectsEn } from '@/data/projects';
import { getService } from '@/data/services';
import { Demo } from '@/components/demos';
import { Cover } from '@/components/demos/Cover';
import { Btn } from '@/components/site/Btn';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export const dynamicParams = false;
export function generateStaticParams() { return projectsEn.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { locale, slug } = await params; const t = getT(locale);
  const p = t.x(getProject(slug)); if (!p) return {};
  return pageMeta(locale, `/work/${p.slug}`, `${p.brand} — ${p.title} (${t('Concept Project')})`, p.summary);
}

export default async function ProjectPage({ params }: PageProps<{ slug: string }>) {
  const { locale } = await params; const t = getT(locale); const projects = t.x(projectsEn);
  const p = t.x(getProject((await params).slug)); if (!p) notFound();
  const service = t.x(getService(p.service)!);
  const i = projects.findIndex((x) => x.slug === p.slug), next = projects[(i + 1) % projects.length];
  return (
    <>
      <PageHero crumbs={[{ href: '/work', label: t('Work') }, { label: p.brand }]} kicker={`${p.n} — ${p.category}`} title={<>{p.brand}<br /><span className="serif muted">{p.title}</span></>} lede={p.summary}>
        <span className="tag concept">{t('Concept Project')}</span><span className="tag">{t('Self-initiated demonstration')}</span><span className="tag">{t('Fictional brand & data')}</span>
      </PageHero>

      {/* 1 — cover + plain explanation */}
      <section className="section tight pstory-cover" aria-labelledby="plain-h">
        <div className="wrap">
          <div className="pstory-hero reveal"><Cover project={p} label={false} /></div>
          <div className="split" style={{ marginTop: 'clamp(28px, 4vw, 56px)' }}>
            <div className="reveal"><p className="kicker">{t('In plain words')}</p></div>
            <div className="reveal"><h2 id="plain-h" className="pstory-plain">{p.plain}</h2>
              <p style={{ marginTop: 26 }}><a className="textlink" href="#demo">{t('Try the live demo')} <span aria-hidden="true">↓</span></a></p></div>
          </div>
        </div>
      </section>

      {/* 2 — business problem → visual solution */}
      <section className="section tight rule" aria-labelledby="flow-h">
        <div className="wrap">
          <div className="split">
            <div className="reveal"><p className="kicker">{t('The business problem')}</p><p className="proj-lead" style={{ marginTop: 20 }}>{p.problem}</p></div>
            <div className="reveal"><p className="kicker">{t('The solution')}</p><p className="proj-lead" style={{ marginTop: 20 }}>{p.solution}</p></div>
          </div>
          <h2 id="flow-h" className="sr-only">{t('Before and after')}</h2>
          <div className="flow reveal" style={{ ['--ac' as string]: p.accent }}>
            <div className="flow-col before"><p className="mono">{t('Before')}</p><ol>{p.before.map((x) => <li key={x}>{x}</li>)}</ol></div>
            <div className="flow-mid" aria-hidden="true"><span>{p.brand}</span><i /></div>
            <div className="flow-col after"><p className="mono">{t('After')}</p><ol>{p.after.map((x) => <li key={x}>{x}</li>)}</ol></div>
          </div>
        </div>
      </section>

      {/* 3 — live demo */}
      <section id="demo" className="section tight rule alt" aria-labelledby="demo-h">
        <div className="wrap">
          <div className="demo-head"><h2 id="demo-h" className="h3">{t('Try the working demonstration')}</h2><p className="mono muted">{t('Runs in your browser · nothing is saved or sent')}</p></div>
          <Demo slug={p.slug} />
          <p className="notice" style={{ marginTop: 18 }}><b>{t('About this demonstration')}</b>{t(DEMO_NOTE)} {t('Any resemblance to a real business is coincidental.')}{p.slug === 'deskhand' && <> {t('The assistant’s answers are pre-written and matched by keyword — no AI model is running.')}</>}</p>
        </div>
      </section>

      {/* 4 — features, value, technology */}
      <section className="section tight rule">
        <div className="wrap split">
          <div className="reveal"><p className="kicker">{t('Key features')}</p><ul className="ticks" style={{ marginTop: 20 }}>{p.features.map((f) => <li key={f}>{f}</li>)}</ul></div>
          <div className="reveal"><p className="kicker">{t('What the business gains')}</p><ol className="gains" style={{ marginTop: 20 }}>{p.value.map((f, k) => <li key={f}><span className="mono">{String(k + 1).padStart(2, '0')}</span>{f}</li>)}</ol></div>
        </div>
      </section>

      <section className="section tight rule alt">
        <div className="wrap split">
          <div className="reveal"><p className="kicker">{t('Technical details')}</p><p className="body" style={{ marginTop: 20, maxWidth: '26em' }}>{t('What this demonstration runs on, and what a real client build would most likely use instead.')}</p></div>
          <div className="reveal">
            <dl className="spec">
              <dt>{t('This demo runs on')}</dt><dd><span className="chips">{p.builtWith.map((x) => <span className="chip" key={x}>{x}</span>)}</span></dd>
              <dt>{t('A client build would likely use')}</dt><dd><span className="chips">{p.productionStack.map((x) => <span className="chip" key={x}>{x}</span>)}</span></dd>
              <dt>{t('Related service')}</dt><dd><Link className="link" href={`/services/${service.slug}`}>{service.title}</Link></dd>
              <dt>{t('Status')}</dt><dd>{t('Concept project — not built for, or commissioned by, a client.')}</dd>
            </dl>
            <div style={{ marginTop: 30 }}><Btn href={`/contact?service=${p.service}`}>{t('Start a project like this')}</Btn></div>
          </div>
        </div>
      </section>

      <section className="section tight rule" aria-labelledby="dec-h">
        <div className="wrap">
          <p className="kicker reveal">{t('Design decisions')}</p>
          <h2 id="dec-h" className="h2 reveal" style={{ margin: '20px 0 40px', maxWidth: '16em' }}>{t('Three choices that shaped it.')}</h2>
          <ol className="ledger">{p.decisions.map((d, k) => <li key={d.title} className="reveal"><span className="n">{String(k + 1).padStart(2, '0')}</span><h3 className="h3">{d.title}</h3><p className="body">{d.body}</p></li>)}</ol>
          <div className="reveal" style={{ marginTop: 48 }}><p className="kicker">{t('In a real engagement, I’d measure')}</p><p className="chips" style={{ marginTop: 16 }}>{p.measure.map((m) => <span className="chip" key={m}>{m}</span>)}</p></div>
        </div>
      </section>

      <section className="section tight rule">
        <div className="wrap">
          <Link href={`/work/${next.slug}`} className="nextproj" data-cursor>
            <span><span className="mono muted">{t('Next concept project —')} {next.n}</span><span className="h1">{next.brand} <span aria-hidden="true">→</span></span><span className="muted">{next.title}</span></span>
            <Cover project={next} label={false} />
          </Link>
        </div>
      </section>
      <FinalCTA q={t('Need something like this, for real?')} a={t('Tell me about the business and the problem. I’ll tell you honestly how I’d approach it.')} />
    </>
  );
}
