import { Btn } from '@/components/site/Btn';
export const metadata = { title: 'Page not found' };
export default function NotFound() {
  return (
    <section className="nf"><div className="wrap">
      <p className="nf-code" aria-hidden="true">404</p>
      <h1 className="h1" style={{ marginTop: 20 }}>This page doesn’t exist.</h1>
      <p className="lede" style={{ marginTop: 18 }}>The link may be old or mistyped. The work, however, is exactly where it should be.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}><Btn href="/">Back to home</Btn><Btn href="/work" variant="ghost">See the work</Btn></div>
    </div></section>
  );
}
