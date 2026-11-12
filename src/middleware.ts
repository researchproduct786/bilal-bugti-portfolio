import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, LOCALE_COOKIE } from '@/i18n/config';

/**
 * English lives at the original, unprefixed URLs (/, /work, …) — nothing that was already
 * public moves. Other languages live under /ar, /es, /de, /fr, /zh-Hans.
 * A returning visitor who chose another language is taken back to it.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const first = pathname.split('/')[1];
  if (isLocale(first)) {
    if (first === defaultLocale) { const url = req.nextUrl.clone(); url.pathname = pathname.replace(/^\/en(?=\/|$)/, '') || '/'; return NextResponse.redirect(url, 308); }
    return NextResponse.next();
  }
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved) && saved !== defaultLocale && !req.headers.get('next-router-prefetch') && req.headers.get('sec-fetch-dest') === 'document') {
    const url = req.nextUrl.clone(); url.pathname = `/${saved}${pathname === '/' ? '' : pathname}`; return NextResponse.redirect(url, 307);
  }
  const url = req.nextUrl.clone(); url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`; url.search = search;
  return NextResponse.rewrite(url);
}
export const config = { matcher: ['/((?!_next|api|scene|avatar|fonts|.*\\.[a-zA-Z0-9]{2,5}$).*)'] };
