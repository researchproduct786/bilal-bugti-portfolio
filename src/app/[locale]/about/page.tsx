import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import { lessons as lessonsEn, story as storyEn } from '@/data/content';
import { site } from '@/data/site';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  return pageMeta(locale, '/about', t('About — the journey so far'), t('How Bilal Bugti came to work at the intersection of technology, creativity and business: six to seven years of curiosity, self-directed learning and building under real constraints.'));
}

const detailEn: Record<string, string> = i18n({
  Curiosity: 'There was no single moment — just a habit of opening things up to see what was inside, and asking why something was built the way it was. That habit has not gone away.',
  Learning: 'These years were exploration and self-directed learning rather than a formal career: following questions wherever they led, across development, design, marketing and how online businesses actually operate.',
  Building: 'The useful part of learning is the part that gets applied. Working on real ideas, and with real people trying to improve their businesses, is where the lessons stuck.',
  Challenges: 'When a laptop takes minutes to do what should take seconds, you learn to plan before you click. When the connection drops, you learn to work offline and waste nothing. Those habits are now part of how every project is built.',
  Vision: 'This is an ambition, not an achievement — a direction to work towards. The hope is that the things built along the way are useful to people who are usually last in line for them, including those in economically disadvantaged regions.',
});

export default async function About({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale); const lessons = t.x(lessonsEn); const story = t.x(storyEn); const detail = t.x(detailEn);
  return (
    <>
      <PageHero kicker={t('About')} title={<>{t('Curiosity first.')} <span className="serif muted">{t('Everything else followed.')}</span></>} lede={site.statement} />

      <section className="section tight">
        <div className="wrap split">
          <div className="about-fig reveal">
            <img src="/scene/m6.webp" alt={t('3D portrait of Bilal built from his own photograph: a human face with machine plating along the jaw and neck, in a dark studio.')} width={720} height={1100} loading="lazy" decoding="async" />
            <p className="mono muted">{t('A 3D portrait modelled from one photograph of Bilal — a likeness, not an exact scan.')}</p>
          </div>
          <div>
            <p className="kicker reveal">{t('In short')}</p>
            <p className="about-lead reveal">{t('I’m Bilal Bugti, a digital entrepreneur. I work across software, AI, business systems, e-commerce, automation, marketing and creative work — with one aim: understand what a business is really struggling with, and build something practical that fixes it.')}</p>
            <p className="body reveal" style={{ marginTop: 24 }}>{t('I don’t think of technology, design and business as separate jobs. A store that looks beautiful and cannot be run is a failure. So is a system that works and nobody wants to use. The interesting work is where all three have to be right at once.')}</p>
            <dl className="spec reveal" style={{ marginTop: 40 }}>
              <dt>{t('Focus')}</dt><dd>{t('Shopify & e-commerce, mobile apps, web development')}</dd>
              <dt>{t('Also')}</dt><dd>{t('AI & automation, CRM and business systems, digital marketing, branding and creative')}</dd>
              <dt>{t('Background')}</dt><dd>{t('Roughly six to seven years exploring and learning the digital world, largely self-taught')}</dd>
              <dt>{t('Working language')}</dt><dd>{t('English')}</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="section tight rule alt" aria-labelledby="ch-h">
        <div className="wrap">
          <p className="kicker reveal">{t('The journey')}</p>
          <h2 id="ch-h" className="h2 reveal" style={{ margin: '20px 0 clamp(32px, 5vw, 64px)' }}>{t('Five chapters.')}</h2>
          <ol className="bigchapters">
            {story.map((c) => (
              <li key={c.n} className="reveal">
                <span className="mono muted">{c.n}</span>
                <h3 className="serif">{c.title}</h3>
                <div><p className="proj-lead">{c.body}</p><p className="body" style={{ marginTop: 16 }}>{detail[c.title]}</p>{c.title === 'Vision' && <p className="tag" style={{ marginTop: 18 }}>{t('Future ambition — not a current claim')}</p>}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tight rule" aria-labelledby="les-h">
        <div className="wrap split">
          <div><p className="kicker reveal">{t('What it taught')}</p><h2 id="les-h" className="h2 reveal" style={{ marginTop: 20 }}>{t('Lessons that now shape the work.')}</h2></div>
          <ol className="notes">{lessons.map((l, i) => <li key={l.title} className="reveal"><span className="mono muted">{String(i + 1).padStart(2, '0')}</span><h3 className="h3">{l.title}</h3><p className="body">{l.body}</p></li>)}</ol>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
