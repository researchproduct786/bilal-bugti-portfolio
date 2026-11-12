'use client';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useLocale } from '@/i18n/client';
import { localePath } from '@/i18n/config';

/** Drop-in replacement for next/link that keeps the visitor inside their chosen language. */
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return <NextLink href={typeof href === 'string' ? localePath(locale, href) : href} {...rest} />;
}
