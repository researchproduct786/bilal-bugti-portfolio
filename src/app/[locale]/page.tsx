import { notFound } from 'next/navigation';
import { localeCodes, href, type LocaleCode } from '@/i18n/config';
import { getBundle } from '@/i18n/dictionaries';
import { Shell } from '@/components/site/Shell';
import { Hero } from '@/components/home/Hero';
import { uiLabels } from '@/i18n/ui-labels';
import { Capabilities, WorkGrid, IntroAndServices } from '@/components/home/HomeSections';
import { ProcessJourney } from '@/components/home/ProcessJourney';
import { ProblemSelector } from '@/components/home/ProblemSelector';
import { Chapter, FinalCTA } from '@/components/site/Blocks';
import { Btn } from '@/components/site/Btn';
import Link from 'next/link';

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

/**
 * The homepage is a sequence of chapters, in this order and no other:
 *
 *   01 Hero            the subject and the interfaces they build
 *   02 Introduction    one short paragraph about how I work
 *   03 Services        seven capabilities, each with its own composition
 *   04 Work            six concept products, each with its own interface
 *   05 Problems        eight business problems, as an interactive composition
 *   06 Process         seven steps, image locked to copy
 *   07 About           Bilal, last of the content chapters
 *   ── Final CTA       one question, then the minimal footer
 *
 * Nothing follows About except the closing question: no testimonials wall, no
 * working notes, no second gallery. Length is not the goal; sequence is.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(localeCodes as readonly string[]).includes(locale)) notFound();
  const b = getBundle(locale as LocaleCode);
  const { t, c } = b;
  const L = (p: string) => href(locale as LocaleCode, p);
  const ui = uiLabels[locale as LocaleCode];

  return (
    <Shell b={b} minimalFooter>
      <Hero t={t} projects={c.projects} portraitAlt={t.ui.portraitNote} ui={ui} />

      <IntroAndServices t={t} c={c} />

      {/* 03 — Services. Seven capabilities, seven different compositions. */}
      <section id="services" className="section chapter-sec depth-section" data-chapter="services" aria-labelledby="cap-h">
        <div className="wrap">
          <Chapter n="03" label={t.home.capsKicker} id="cap-h" title={t.home.capsTitle}>
            {t.home.capsBody}
          </Chapter>
          <Capabilities t={t} L={L} />
        </div>
      </section>

      {/* 04 — Work. Six concept products. */}
      <section id="work" className="section chapter-sec alt2 depth-section" data-chapter="work" aria-labelledby="work-h">
        <div className="wrap">
          <Chapter n="04" label={t.home.workKicker} id="work-h" title={t.home.workTitle}>
            {t.home.workBody}
          </Chapter>
          <WorkGrid projects={c.projects} t={t} L={L} locale={locale as LocaleCode} />
          <div className="reveal" style={{ marginTop: 36 }}><Btn href={L('/work')} variant="ghost">{t.nav.work}</Btn></div>
        </div>
      </section>

      {/* 05 — Problems. Eight cards that come out of depth, one answer at a time. */}
      <section id="problems" className="section chapter-sec depth-section" data-chapter="problems" aria-labelledby="ps-h">
        <div className="wrap">
          <Chapter n="05" label={t.home.problemsKicker} id="ps-h" title={t.home.problemsTitle}>
            {t.home.problemsBody}
          </Chapter>
          <ProblemSelector t={t} c={c} />
        </div>
      </section>

      {/* 06 — Process. Seven steps; the image and the words move as one. */}
      <section id="process" className="section chapter-sec alt depth-section" data-chapter="process" aria-labelledby="proc-h">
        <div className="wrap">
          <Chapter n="06" label={t.home.processKicker} id="proc-h" title={t.home.processTitle}>
            {t.home.processBody}
          </Chapter>
          <ProcessJourney t={t} />
          <div className="reveal" style={{ marginTop: 44 }}><Link className="textlink" href={L('/process')}>{t.process.kicker} <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* 07 — About. Deliberately the last thing before the closing question. */}
      <section id="about" className="section chapter-sec about2 depth-section" data-chapter="about" aria-labelledby="ab-h">
        <div className="wrap">
          <p className="chapter-tag reveal"><span className="mono">07</span><span className="mono">{t.home.aboutKicker}</span></p>
          <div className="about2-in">
            <div className="about2-fig reveal">
              <img
                src="/img/portrait-about.webp"
                alt={t.ui.portraitNote}
                width={1024}
                height={1280}
                loading="lazy"
                decoding="async"
              />
              <p className="mono muted">{t.ui.portraitNote}</p>
            </div>
            <div className="about2-copy">
              <h2 id="ab-h" className="h2 reveal">{t.home.aboutTitle}</h2>
              <p className="body reveal" style={{ marginTop: 18 }}>{t.home.aboutBody}</p>
              <p className="notice reveal" style={{ marginTop: 22 }}><b>{t.about.honest}</b>{t.about.honestBody}</p>
              <div className="reveal" style={{ marginTop: 24 }}><Btn href={L('/about')} variant="ghost">{t.about.kicker}</Btn></div>
            </div>
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
