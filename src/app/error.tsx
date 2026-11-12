'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="nf"><div className="wrap">
      <p className="kicker">Something went wrong</p>
      <h1 className="h1" style={{ marginTop: 20 }}>That didn’t load properly.</h1>
      <p className="lede" style={{ marginTop: 18 }}>An unexpected error interrupted this page. Trying again usually fixes it.</p>
      <button className="btn" style={{ marginTop: 34 }} onClick={reset}><span>Try again</span></button>
    </div></section>
  );
}
