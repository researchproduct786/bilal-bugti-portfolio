'use client';
import { useT } from '@/i18n/client';
/**
 * Honest by construction: there are no real testimonials in the codebase yet.
 * Real ones are added to `testimonials` only with the reviewer's content, permission and source link.
 */
export interface Testimonial { quote: string; name: string; role: string; source: 'WhatsApp' | 'LinkedIn' | 'Instagram' | 'Facebook' | 'X' | 'Email'; sourceUrl?: string; verified: boolean }
export const testimonials: Testimonial[] = [];

export function TestimonialWall({ compact = false }: { compact?: boolean }) {
  const tr = useT();
  const slots = compact ? 2 : 4;
  return (
    <div className="twall">
      {testimonials.map((t, i) => (
        <figure className="tcard real" key={i}>
          <blockquote>“{t.quote}”</blockquote>
          <figcaption><b>{t.name}</b><span>{t.role}</span>{t.sourceUrl ? <a className="link" href={t.sourceUrl} target="_blank" rel="noopener noreferrer">{tr('View on {source}', { source: t.source })}</a> : <span>{tr('via {source}', { source: t.source })}</span>}</figcaption>
        </figure>
      ))}
      <figure className="tcard demo" aria-label={tr('Illustrative demo — not a real client testimonial')}>
        <span className="tag concept">{tr('Illustrative demo — not a real client testimonial')}</span>
        <blockquote>{tr('“This is how a verified review will appear here: the client’s own words, their name and role, and a link back to the original message.”')}</blockquote>
        <figcaption><b>{tr('Sample layout')}</b><span>{tr('Design mock-up only')}</span><span className="mono">{tr('Source link · verified badge')}</span></figcaption>
      </figure>
      {Array.from({ length: slots }).map((_, i) => (
        <div className="tcard empty" key={i}><span className="mono">{tr('Reserved')}</span><p>{tr('For a real client review, published with permission.')}</p></div>
      ))}
    </div>
  );
}
