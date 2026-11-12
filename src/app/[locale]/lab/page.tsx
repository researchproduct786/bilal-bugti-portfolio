import type { Metadata } from 'next';
import { getT, type PageProps } from '@/i18n/server';
import { pageMeta } from '@/i18n/meta';
import { i18n } from '@/i18n/core';
import { LabStudio } from '@/components/home/LabStudio';
import { IndustryGlobe } from '@/components/home/IndustryGlobe';
import { TypeLab } from '@/components/home/TypeLab';
import { FinalCTA, PageHero } from '@/components/site/Blocks';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params; const t = getT(locale);
  return pageMeta(locale, '/lab', t('Creative Lab — interactive experiments'), t('The interactive pieces behind this site, opened up: a real-time 3D studio with a human-to-machine transformation, a canvas industry sphere, and a variable-font playground.'));
}

export default async function Lab({ params }: PageProps) {
  const { locale } = await params; const t = getT(locale);
  return (
    <>
      <PageHero kicker={t('Creative Lab')} title={<>{t('The moving parts,')} <span className="serif muted">{t('with the lid off.')}</span></>} lede={t('Three small experiments built for this site. Each is written from scratch, uses no paid service, and stops rendering when you scroll past it.')} />
      <section className="section tight">
        <div className="wrap">
          <div className="lab-block">
            <div className="lab-head"><span className="mono muted">{t('Exp. 01')}</span><h2 className="h2">{t('Human ⇄ machine')}</h2><p className="body">{t('The studio from the home page, under manual control. The scene is procedural — geometry, textures and the dissolve shader are generated in code, so nothing is downloaded but the script. The figure is a faceless placeholder, not a likeness.')}</p></div>
            <LabStudio />
          </div>
          <div className="lab-block">
            <div className="lab-head"><span className="mono muted">{t('Exp. 02')}</span><h2 className="h2">{t('Industry sphere')}</h2><p className="body">{t('Seven hundred points and fourteen nodes on a 2D canvas, rotated with a few lines of trigonometry. Light enough for any phone; drag it.')}</p></div>
            <IndustryGlobe />
          </div>
          <div className="lab-block">
            <div className="lab-head"><span className="mono muted">{t('Exp. 03')}</span><h2 className="h2">{t('One font, two axes')}</h2><p className="body">{t('Every sans-serif heading on this site comes from a single variable font file. Weight and width are set per element instead of loading separate fonts.')}</p></div>
            <TypeLab />
          </div>
        </div>
      </section>
      <FinalCTA q={t('Want something interactive of your own?')} a={t('If it serves the idea, it can probably be built.')} />
    </>
  );
}
