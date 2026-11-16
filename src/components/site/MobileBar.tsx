'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { useL } from '@/i18n/client';

/**
 * A slim contact bar for small screens only.
 * It appears after the hero, sits at the bottom edge, never covers the last section
 * (the footer reserves space for it) and can be dismissed.
 */
export function MobileBar({ label, closeLabel }: { label: string; closeLabel: string }) {
  const L = useL();
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 420);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  if (closed) return null;
  return (
    <div className={`mbar ${show ? 'on' : ''}`} role="complementary">
      <Link className="mbar-a" href={L('/contact')}>{label} <span aria-hidden="true">→</span></Link>
      {site.whatsapp ? (
        <a className="mbar-w" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WA</a>
      ) : null}
      <button className="mbar-x" aria-label={closeLabel} onClick={() => setClosed(true)}>×</button>
    </div>
  );
}
