import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { Hero } from '@/components/home/Hero';
import { uiLabels } from '@/i18n/ui-labels';
import { Capabilities, WorkGrid, ReferenceReel, IntroAndServices } from '@/components/home/HomeSections';
import { ProcessJourney } from '@/components/home/ProcessJourney';
import { ProblemSelector } from '@/components/home/ProblemSelector';
import { Scene } from '@/components/visuals/Scene';
import { KitchenUi } from '@/components/visuals/Ui';
import { SectionHead, FinalCTA } from '@/components/site/Blocks';
import { Btn } from '@/components/site/Btn';
import Link from 'next/link';

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);

  return (
    <Shell b={b}>
      <Hero t={t} projects={c.projects} portraitAlt={t.ui.portraitNote} ui={uiLabels[locale as LocaleCode]} />

      <IntroAndServices t={t} c={c} />

      {/* Capabilities — visual first */}
      <section className="section rule depth-section" aria-labelledby="cap-h">
        <div className="wrap">
          <SectionHead id="cap-h" kicker={t.home.capsKicker} title={t.home.capsTitle}>{t.home.capsBody}</SectionHead>
          <Capabilities t={t} L={L} />
        </div>
      </section>

      {/* Six products */}
      <section className="section rule alt2 depth-section" aria-labelledby="work-h">
        <div className="wrap">
          <SectionHead id="work-h" kicker={t.home.workKicker} title={t.home.workTitle}>{t.home.workBody}</SectionHead>
          <WorkGrid projects={c.projects} t={t} L={L} locale={locale as LocaleCode} />
          <div className="reveal" style={{ marginTop: 36 }}><Btn href={L('/work')} variant="ghost">{t.nav.work}</Btn></div>
        </div>
      </section>

      {/* Portfolio reference artwork, in a monitor frame */}
      <section className="section rule depth-section" aria-labelledby="reel-h">
        <div className="wrap">
          <SectionHead id="reel-h" kicker={t.nav.lab} title={c.pages.lab.title}>{c.pages.lab.lede}</SectionHead>
          <ReferenceReel
            title={t.nav.lab}
            body={c.pages.lab.note}
            caption={t.ui.reelCaption}
            alt={`${t.nav.lab} — ${c.pages.lab.title}`}
          />
        </div>
      </section>

      {/* Business problem selector */}
      <section className="section rule alt depth-section" aria-labelledby="ps-h">
        <div className="wrap">
          <SectionHead id="ps-h" kicker={t.home.problemsKicker} title={t.home.problemsTitle}>{t.home.problemsBody}</SectionHead>
          <ProblemSelector t={t} c={c} />
        </div>
      </section>

      {/* Seven-step visual journey */}
      <section className="section rule depth-section" aria-labelledby="proc-h">
        <div className="wrap">
          <SectionHead id="proc-h" kicker={t.home.processKicker} title={t.home.processTitle}>{t.home.processBody}</SectionHead>
          <ProcessJourney t={t} />
          <div className="reveal" style={{ marginTop: 44 }}><Link className="textlink" href={L('/process')}>{t.process.kicker} <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* Industries */}
      <section className="section rule alt2 depth-section" aria-labelledby="ind-h">
        <div className="wrap">
          <SectionHead id="ind-h" kicker={t.home.industriesKicker} title={t.home.industriesTitle}>{t.home.industriesBody}</SectionHead>
          <div className="indgrid reveal" data-stagger>
            {c.industries.map((i) => (
              <div key={i.name} className="indcard">
                <p className="indcard-n">{i.name}</p>
                <p className="indcard-d">{i.note}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ marginTop: 32 }}><Link className="textlink" href={L('/industries')}>{t.nav.industries} <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* About + portrait */}
      <section className="section rule about2 depth-section" aria-labelledby="ab-h">
        <div className="wrap about2-in">
          <div className="about2-fig reveal">
            <img src="/img/portrait-bilal.webp" alt={t.ui.portraitNote} width={1024} height={1024} loading="lazy" decoding="async" />
            <p className="mono muted">{t.ui.portraitNote}</p>
          </div>
          <div className="about2-copy">
            <p className="kicker reveal">{t.home.aboutKicker}</p>
            <h2 id="ab-h" className="h2 reveal" style={{ marginTop: 18 }}>{t.home.aboutTitle}</h2>
            <p className="body reveal" style={{ marginTop: 18 }}>{t.home.aboutBody}</p>
            <p className="notice reveal" style={{ marginTop: 22 }}><b>{t.about.honest}</b>{t.about.honestBody}</p>
            <div className="reveal" style={{ marginTop: 24 }}><Btn href={L('/about')} variant="ghost">{t.about.kicker}</Btn></div>
          </div>
        </div>
      </section>

      {/* Testimonials — honest about being empty */}
      <section className="section rule" aria-labelledby="test-h">
        <div className="wrap">
          <SectionHead id="test-h" kicker={t.home.testimonialKicker} title={t.home.testimonialTitle}>{t.home.testimonialBody}</SectionHead>
          <div className="twall reveal" data-stagger>
            <figure className="tcard demo">
              <span className="tag concept">{t.ui.sampleData}</span>
              <blockquote>“{t.home.testimonialBody}”</blockquote>
              <figcaption><b>{t.nav.testimonials}</b><span>{t.ui.concept}</span></figcaption>
            </figure>
            <div className="tcard empty"><span className="mono">01</span><p>{t.home.testimonialBody}</p></div>
            <div className="tcard empty"><span className="mono">02</span><p>{t.home.testimonialBody}</p></div>
          </div>
        </div>
      </section>

      {/* Working notes */}
      <section className="section rule alt depth-section" aria-labelledby="in-h">
        <div className="wrap split">
          <div>
            <p className="kicker reveal">{t.home.insightsKicker}</p>
            <h2 id="in-h" className="h2 reveal" style={{ marginTop: 18 }}>{t.home.insightsTitle}</h2>
            <p className="body reveal" style={{ marginTop: 16 }}>{t.home.insightsBody}</p>
            <div className="reveal" style={{ marginTop: 22 }}><Link className="textlink" href={L('/insights')}>{t.insights.kicker} <span aria-hidden="true">→</span></Link></div>
          </div>
          <ol className="notes">
            {c.lessons.map((l, i) => (
              <li key={l.title} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{l.title}</h3><p className="body">{l.body}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* A photograph with an interface, closing the loop */}
      <section className="section rule tight">
        <div className="wrap duo">
          <Scene name="kitchen" caption={c.projects[4].summary} ratio="4 / 3" />
          <div className="ui-frame reveal">
            <KitchenUi l={uiLabels[locale as LocaleCode]} />
          </div>
        </div>
      </section>

      <FinalCTA
        kicker={t.ui.next}
        q={t.home.finalQ}
        a={t.home.finalA}
        primaryHref={L('/contact')}
        primaryLabel={t.home.finalCta}
        secondaryHref={L('/process')}
        secondaryLabel={t.nav.process}
      />
    </Shell>
  );
}
