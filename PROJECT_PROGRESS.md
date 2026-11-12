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

---

## Phase 2 — avatar, six-scene hero, process journey, product stories, six languages

**Rollback reference:** `main` = `e46f3e862d7fc65c1fc1c8f00bace9ab0708e46b`, Vercel production deployment `dpl_fKxx8f9rZVGP4RzhpCZdxqTNNcgc`.
Production is not touched until the preview of branch `arena/eaeb608c-bilal-bugti-portfolio` has been reviewed.

### Done
- **Avatar** — head modelled from one authorised photograph (`tools/avatar`, `public/avatar/head.glb`, 0.7 MB), loaded into the studio scene; face stays human while plating grows over neck, skull and jaw.
- **Hero** — six scroll scenes (The Human → My digital world), skip link, progress bar; still-image version for phones, reduced motion and devices without WebGL.
- **Process journey** — seven 3D stations on `/process` and the home page, with a plain list fallback and a text description of every scene.
- **Product pages** — each `/work/<slug>` now tells the story in plain words: problem, solution, before/after, live demo, features, business value, technical details.
- **Languages** — English (original, unprefixed URLs), Arabic (right-to-left), Spanish, German, French, Simplified Chinese. 1,394 strings per language, hreflang + sitemap for every page, language switcher with a remembered choice.

### How translation works
- English strings in the code are the keys. `node tools/i18n-extract.mjs` collects them into `src/i18n/keys.json`.
- Translations live in `tools/i18n-work/*.txt` (one line per string, five languages) against `tools/i18n-work/source.tsv`.
- `node tools/i18n-merge.mjs` rebuilds `src/i18n/dict/*.json` and checks placeholders.
- To add a string: write it in English with `t('…')`, run extract, append the new line to `source.tsv`, add a line to a work file, run merge.

### Tests (local production build)
- `npm run typecheck` clean; `npm run build` — 133 static pages.
- `node tests/locales.mjs` — 21 routes × 6 languages: status, `lang`/`dir`, hreflang, translated titles, redirects, sitemap.
- `node tests/leaks.mjs <base> <locale>` — looks for English sentences left on translated pages.
- `node tests/e2e.mjs` — the phase 1 browser suite (navigation, demos, contact form, reduced motion, headers).

### Known limits
- Translations were written and checked by the developer, not by professional translators; the language menu says so.
- The avatar is a likeness from a single photo; hair is stylised. More photos would improve it.
- The social preview image (`/opengraph-image`) is English only.
- Not tested: real phones and tablets, screen readers, Lighthouse on the deployed preview.
- Still needed from Bilal: contact e-mail and WhatsApp number, social links, real testimonials, published articles.
