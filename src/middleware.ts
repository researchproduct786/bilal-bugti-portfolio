import { NextResponse, type NextRequest } from 'next/server';
import { localeCodes } from '@/i18n/config';

/**
 * Locale routing without a third-party library.
 *
 * `/<locale>/...` is the canonical address for every page. Requests without a prefix are
 * rewritten (not redirected) to English so every previously shared link keeps working.
 */
const PUBLIC_FILE = /\.(?:png|jpg|jpeg|webp|avif|svg|ico|txt|xml|json|webmanifest|woff2?|mp3)$/i;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/opengraph-image') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split('/')[1] ?? '';
  if ((localeCodes as readonly string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ['/((?!_next|.*\\..*).*)'] };
