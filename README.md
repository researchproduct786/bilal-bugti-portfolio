# Bilal Bugti — Portfolio

Personal portfolio of **Bilal Bugti** — Digital Entrepreneur | Technology & Business Solutions.

> I don't just build projects. I build solutions to real-world problems.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Three.js (procedural scene, no model downloads) · GSAP + ScrollTrigger · custom CSS · self-hosted fonts. Hosted on Vercel's free plan. No paid APIs or services.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
npm run test:e2e   # needs a running server; see tests/browser.mjs for the headless browser
```

## Configuration
Copy `.env.example` to `.env.local` (or set in Vercel → Settings → Environment Variables). Everything is optional; when a value is missing the site shows a clearly labelled placeholder instead of inventing one.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL (sitemap, OG, canonical tags) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Enables "Send by email" on the inquiry form |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, with country code. Enables WhatsApp handoff |
| `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_X_URL` | Footer social links |

## Content rules
- The six projects under `/work` are **original concept projects** with fictional brands and sample data. They are labelled as such everywhere they appear.
- No testimonials, clients, figures or credentials are invented. Add real testimonials to the `testimonials` array in `src/components/site/TestimonialWall.tsx`.
- The 3D figure is a faceless placeholder, not a likeness.
- The inquiry form has no backend: it prepares a message that the visitor sends from their own email app or WhatsApp.

## Structure
`src/app` routes · `src/data` all copy and content · `src/three/studio.ts` the 3D scene · `src/components/demos` the six interactive demos · `src/i18n` locale registry (English live; Arabic/RTL, Spanish, German, French, Simplified Chinese registered as planned — not shown as translated) · `tests` end-to-end checks.

See `PROJECT_PROGRESS.md` for the milestone log.
