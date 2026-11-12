import Link from '@/components/site/L';
import type { ReactNode } from 'react';

interface Props { href: string; children: ReactNode; variant?: 'solid' | 'ghost'; small?: boolean; external?: boolean; className?: string }

/** The one button style used across the site. Magnetic on fine pointers (see Interactions). */
export function Btn({ href, children, variant = 'solid', small, external, className = '' }: Props) {
  const cls = `btn ${variant === 'ghost' ? 'ghost' : ''} ${small ? 'small' : ''} ${className}`.trim();
  const inner = (<><span>{children}</span><span className="arr" aria-hidden="true" /></>);
  if (external) return <a className={cls} href={href} target="_blank" rel="noopener noreferrer" data-magnetic>{inner}</a>;
  return <Link className={cls} href={href} data-magnetic>{inner}</Link>;
}
