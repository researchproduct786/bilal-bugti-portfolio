'use client';
import { useEffect } from 'react';

/**
 * Keeps `<html>` honest.
 *
 * The root layout has to render a single static `<html>` for every route, so it
 * cannot know which language it is serving. That left Arabic pages shipping
 * `lang="en" dir="ltr"` — a screen reader pronounces Arabic with an English voice,
 * and anything reading `document.documentElement.dir` gets the wrong answer. The
 * locale segment does know, so it corrects both attributes on mount.
 *
 * Layout direction is already correct in the first paint: the locale wrapper
 * carries `dir`, so nothing reflows. This only repairs the document element.
 */
export function LocaleDocument({ lang, dir }: { lang: string; dir: 'ltr' | 'rtl' }) {
  useEffect(() => {
    const el = document.documentElement;
    if (el.lang !== lang) el.lang = lang;
    if (el.dir !== dir) el.dir = dir;
  }, [lang, dir]);
  return null;
}
