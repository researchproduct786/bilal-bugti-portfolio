import { getT, type PageProps } from '@/i18n/server';
import { i18n } from '@/i18n/core';
import Link from '@/components/site/L';
import { Hero } from '@/components/home/Hero';
import { ProblemSelector } from '@/components/home/ProblemSelector';
import { ProcessJourney } from '@/components/home/ProcessJourney';
import { rich } from '@/i18n/rich';
import { IndustryGlobe } from '@/components/home/IndustryGlobe';
import { Cover } from '@/components/demos/Cover';
import { TestimonialWall } from '@/components/site/TestimonialWall';
import { FinalCTA } from '@/components/site/Blocks';
import { Btn } from '@/components/site/Btn';
import { services as servicesEn } from '@/data/services';
import { projects as projectsEn } from '@/data/projects';
import { lessons as lessonsEn, story as storyEn } from '@/data/content';
import { site } from '@/data/site';

export default async function Home({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale); const services = t.x(servicesEn); const projects = t.x(projectsEn); const lessons = t.x(lessonsEn); const story = t.x(storyEn);
  return (
    <>
      <Hero />

      {/* 02 — Introduction */}
      <section id="intro" className="section intro" aria-labelledby="intro-h">
        <div className="wrap">
          <p className="kicker reveal"><b>01</b> {t('Introduction')}</p>
          <h2 id="intro-h" className="intro-statement reveal">
            {rich(t('I’m Bilal — a digital entrepreneur working where *technology*, *creativity* and *business* meet. I look for the real problem first, then build the thing that solves it.'))}
          </h2>
          <div className="intro-grid">
            <p className="lede reveal">{t(site.statement)}</p>
            <ul className="intersect reveal">
              <li><span className="mono">{t('Technology')}</span><span>{t('How it gets built — stores, apps, systems, automation.')}</span></li>
              <li><span className="mono">{t('Creativity')}</span><span>{t('How it looks, reads and feels to the person using it.')}</span></li>
              <li><span className="mono">{t('Business')}</span><span>{t('Why it is worth building, and what it should change.')}</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 03 — Capabilities */}
      <section className="section rule" aria-labelledby="cap-h">
        <div className="wrap">
          <div className="cap-head">
            <p className="kicker reveal"><b>02</b> {t('What I do')}</p>
            <h2 id="cap-h" className="h2 reveal">{t('Three areas of practice.')}<br /><span className="muted">{t('One way of working.')}</span></h2>
          </div>
          <div className="strong reveal" aria-label={t('Strongest capabilities')}>
            <span className="mono muted">{t('Strongest in')}</span>
            <ol>
              <li><Link href="/services/digital-product-development">{rich(t('Shopify *&* E-commerce'), (x, i) => <span key={i} className="serif">{x}</span>)}</Link></li>
              <li><Link href="/services/digital-product-development">{t('Mobile Apps')}</Link></li>
              <li><Link href="/services/digital-product-development">{t('Web Development')}</Link></li>
            </ol>
          </div>
          <ul className="pillars">
            {services.map((s) => (
              <li key={s.slug} className="reveal">
                <Link href={`/services/${s.slug}`} className="pillar">
                  <span className="pillar-l">{s.letter}</span>
                  <span className="pillar-t"><span className="h3">{s.title}</span><span className="pillar-s">{s.short}</span></span>
                  <span className="pillar-c">{[...s.lead, ...s.supporting].map((c, i) => <span key={c} className={i < s.lead.length ? 'lead' : ''}>{c}</span>)}</span>
                  <span className="pillar-a" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Selected work */}
      <section className="section rule" aria-labelledby="work-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(40px, 6vw, 84px)' }}>
            <div><p className="kicker reveal"><b>03</b> {t('Selected work')}</p></div>
            <div>
              <h2 id="work-h" className="h2 reveal">{t('Six products, built to show how I think.')}</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>{t('Each is an original concept project made for this portfolio — fictional brands, sample data, working screens. No client work is reused or disclosed.')}</p>
            </div>
          </div>
          <ul className="workgrid">
            {projects.map((p) => (
              <li key={p.slug} className="reveal">
                <Link href={`/work/${p.slug}`} className="workcard" data-cursor>
                  <Cover project={p} />
                  <span className="workcard-meta"><span className="mono muted">{p.n} — {p.category}</span><span className="h3">{p.brand}</span><span className="muted">{p.title}</span></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="reveal" style={{ marginTop: 56 }}><Btn href="/work" variant="ghost">{t('All work')}</Btn></div>
        </div>
      </section>

      {/* 05 — Problem selector */}
      <section className="section rule alt" aria-labelledby="ps-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
            <div><p className="kicker reveal"><b>04</b> {t('Start from the problem')}</p></div>
            <div><h2 id="ps-h" className="h2 reveal">{t('What is getting in the way of your business?')}</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>{t('Pick the statement closest to yours. You’ll get a plain outline of why it matters and how it could be solved.')}</p></div>
          </div>
          <div className="reveal"><ProblemSelector /></div>
        </div>
      </section>

      {/* 06 — Industries */}
      <section className="section rule" aria-labelledby="ind-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>
            <div><p className="kicker reveal"><b>05</b> {t('Industries')}</p></div>
            <div><h2 id="ind-h" className="h2 reveal">{t('Different businesses. Familiar problems.')}</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>{t('These are the business environments I’m interested in working with and the problems I’d want to help solve there — not a list of claimed specialisms.')}</p></div>
          </div>
          <div className="reveal"><IndustryGlobe /></div>
          <div className="reveal" style={{ marginTop: 40 }}><Link className="textlink" href="/industries">{t('Industries in detail')} <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* 07 — Story */}
      <section className="section rule story" aria-labelledby="story-h">
        <div className="wrap">
          <p className="kicker reveal"><b>06</b> {t('The journey')}</p>
          <h2 id="story-h" className="h1 reveal" style={{ marginTop: 22, maxWidth: '13em' }}>{t('Curiosity first.')} <span className="serif">{t('Everything else followed.')}</span></h2>
          <ol className="chapters">
            {story.map((c) => (
              <li key={c.n} className="reveal"><span className="mono muted">{c.n}</span><h3 className="serif">{c.title}</h3><p className="body">{c.body}</p></li>
            ))}
          </ol>
          <div className="reveal" style={{ marginTop: 48 }}><Link className="textlink" href="/about">{t('Read the full story')} <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* 08 — Process */}
      <section className="rule alt" aria-labelledby="proc-h">
        <div className="wrap" style={{ paddingTop: 'clamp(72px, 10vw, 150px)', paddingBottom: 28 }}>
          <div className="split">
            <div><p className="kicker reveal"><b>07</b> {t('Process')}</p></div>
            <div><h2 id="proc-h" className="h2 reveal">{t('Seven steps. The first two matter most.')}</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>{t('Scroll through one project from the first conversation to handover.')}</p></div>
          </div>
        </div>
        <ProcessJourney />
        <div className="wrap reveal" style={{ paddingBlock: '40px clamp(64px, 8vw, 120px)' }}><Link className="textlink" href="/process">{t('The process in detail')} <span aria-hidden="true">→</span></Link></div>
      </section>

      {/* 09 — Testimonials */}
      <section className="section rule" aria-labelledby="t-h">
        <div className="wrap">
          <div className="split" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
            <div><p className="kicker reveal"><b>08</b> {t('Testimonials')}</p></div>
            <div><h2 id="t-h" className="h2 reveal">{t('Nothing here is invented — so for now, it’s mostly empty.')}</h2>
              <p className="lede reveal" style={{ marginTop: 22 }}>{t('Real reviews will be published only with the client’s words, permission and a link to the source.')}</p></div>
          </div>
          <div className="reveal"><TestimonialWall compact /></div>
        </div>
      </section>

      {/* 10 — Insights */}
      <section className="section rule" aria-labelledby="in-h">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="kicker reveal"><b>09</b> {t('Insights')}</p>
              <h2 id="in-h" className="h2 reveal" style={{ marginTop: 22 }}>{t('Working notes.')}</h2>
              <p className="body reveal" style={{ marginTop: 20 }}>{t('A few principles learned the slow way. Longer articles are in draft and will be published here when they are ready — not before.')}</p>
              <div className="reveal" style={{ marginTop: 28 }}><Link className="textlink" href="/insights">{t('Open the notebook')} <span aria-hidden="true">→</span></Link></div>
            </div>
            <ol className="notes">
              {lessons.map((l, i) => (<li key={l.title} className="reveal"><span className="mono muted">{t('Note')} {String(i + 1).padStart(2, '0')}</span><h3 className="h3">{l.title}</h3><p className="body">{l.body}</p></li>))}
            </ol>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
