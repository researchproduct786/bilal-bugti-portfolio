# Project progress

Milestone log for the Bilal Bugti portfolio. Updated as work lands.

## M1 — Foundation
- **Objective:** project scaffold, design system, content model, i18n-ready structure.
- **Files:** `package.json`, `next.config.mjs`, `tsconfig.json`, `src/data/*`, `src/i18n/*`, `src/styles/globals.css`, `src/components/site/*`, `src/app/layout.tsx`, `src/app/template.tsx`.
- **Features:** tokens (black/charcoal, silver, one electric blue), variable-font type system, responsive nav + full-screen index, footer, magnetic buttons, custom cursor (fine pointers only), page-enter transition, scroll reveals, optional sound (muted by default), security headers, env-driven contact config.
- **Errors found / fixed:** TypeScript 7 broke `next dev` → pinned 5.9. CSS side-effect imports failed typecheck → `src/css.d.ts`.

## M2 — 3D studio and transformation
- **Objective:** cinematic opening scene and the human → machine signature.
- **Files:** `src/three/studio.ts`, `src/components/home/{StudioCanvas,Hero,LabStudio}.tsx`, `public/scene/*`.
- **Features:** fully procedural Three.js scene (desk, laptop, three monitors, chair, seated faceless figure), scroll-driven camera path, shader dissolve between human and machine figure, pointer parallax, DPR cap, render pause when off-screen or tab hidden, full disposal on unmount. Lightweight still-image version with a drag-to-compare slider for phones, touch devices, reduced motion and no-WebGL.
- **Errors found / fixed:** duplicated rotation in limb builder; dev badge baked into captured posters.

## M3 — Home page
- **Files:** `src/app/page.tsx`, `src/styles/home.css`, `ProblemSelector.tsx`, `IndustryGlobe.tsx`, `TestimonialWall.tsx`, `Cover.tsx`.
- **Features:** introduction, three capabilities, selected work, business problem selector (8 problems), canvas industry sphere, five-chapter journey, seven-step process, honest testimonial wall, insights, final CTA.

## M4 — Six concept projects
- **Files:** `src/components/demos/*`, `src/styles/demos.css`, `src/app/work/**`.
- **Features:** Halden Objects (store, cart, demo checkout, owner analytics), Tillo (mobile business app), Deskhand (assistant UI with scripted local responses, disclosed), Linework (CRM pipeline + automations), Ember & Rye (ordering linked to kitchen/admin), Slowtide (campaign, creatives, landing page, dashboard). Each is code-split and labelled a concept project with fictional data.

## M5 — Remaining pages, inquiry, SEO
- **Files:** `src/app/{about,services,industries,case-studies,process,results,testimonials,insights,lab,contact}/**`, `src/components/contact/InquiryForm.tsx`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `not-found.tsx`, `error.tsx`, `src/styles/pages.css`.
- **Features:** three service detail pages (problem, solution, included, process, related demos, FAQ + FAQ structured data), three-step validated inquiry form with email / WhatsApp / copy handoff, Creative Lab, 404.

## M6 — Testing and deployment
- **Tests:** `npm run typecheck`, `npm run build`, `node tests/e2e.mjs` (every route on desktop and 390 px mobile: status, single h1, metadata, canonical, no horizontal overflow; 404; sitemap/robots/OG; problem selector; menu; all six demos; inquiry form validation and completion; reduced motion; security headers; console errors). Results are recorded in the section below.

## Test results
_See bottom of file — filled in from actual runs._

## Remaining / needs input from Bilal
- Contact email, WhatsApp number and social URLs (environment variables; placeholders shown until set).
- An approved photograph for the About page (currently a 3D scene still, labelled as a placeholder).
- Real testimonials, with permission and source links.
- Reviewed translations for Arabic, Spanish, German, French and Simplified Chinese (architecture is ready; nothing is machine-translated and shown as verified).
- Published articles for Insights.
- Optional: a form backend if inquiries should be delivered without the visitor's email app.

### Local run — 2026-11-12 (production build, `next start`)
- `npm run typecheck` — clean.
- `npm run build` — success, 28 static pages.
- `node tests/e2e.mjs` — **74 passed, 0 failed**.
- `node tests/hero.mjs` — full WebGL hero mounts and scrolls through human → machine with no console errors (software-rendered headless Chromium; not measured on real GPUs or phones).
- Not tested: real iOS/Android devices, screen readers, Lighthouse scores.
