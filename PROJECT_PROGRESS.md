# Project progress

Milestone log for the Bilal Bugti portfolio. Updated as work lands.

---

## Current state (branch `arena/d81b63b6-bilal-bugti-portfolio`)

The site has been rebuilt on a six-language locale router and is running the new design
system. `npm run typecheck`, `npm run build` and `npm run test:e2e` all pass
(**1301 automated checks, 0 failures**), and `npm run check:i18n` passes for all six
languages. A Vercel preview deployment of this branch builds and is READY.

### What the visitor gets now

| Area | State |
| --- | --- |
| Home | 12 sections: hero, introduction + service lines, eight capabilities, six products, portfolio artwork in a monitor frame, problem selector, seven-step journey, industries, about + portrait, honest testimonials, working notes, closing CTA |
| Products | Six concept products, each with a real, interactive interface and a distinct identity (Halden Objects, Tillo, Deskhand, Linework, Ember & Rye, Slowtide) |
| Services | Three practice areas holding seven capabilities, each pairing a photograph with a matching interface |
| Process | Seven steps, each with one photograph, a plain-English explanation and an outcome label |
| Languages | English, Arabic (RTL), Spanish, German, French, Simplified Chinese — every page, string and form |
| Pages | Home, Work, six product pages, Services, three service pages, Process, Industries, About, Insights, Creative Lab, Case studies, Results, Testimonials, Contact, 404 |

---

## M1 — Foundation
- **Files:** `package.json`, `next.config.mjs`, `tsconfig.json`, `src/styles/globals.css`, `src/components/site/*`, `src/app/layout.tsx`.
- **Features:** design tokens (black / charcoal, silver, one electric blue), variable-font type system, responsive nav + full-screen index, footer, magnetic buttons, custom cursor (fine pointers only), scroll reveals, security headers, env-driven contact config.
- **Fixed:** TypeScript 7 broke `next dev` → pinned 5.9.

## M2 — 3D studio and transformation *(removed, superseded)*
- The procedural Three.js studio and the human → machine dissolve were built here, and then
  removed in M7. The concept was rejected: it said nothing about the business, cost a large
  download on phones, and made a robot the central identity. `src/three/`, `StudioCanvas`,
  `IndustryGlobe`, `LabStudio`, `TypeLab`, `demos/Cover` and `public/scene/` are gone; the
  hero is now a photograph and one working interface, which loads instantly.

## M3 — Home page *(rebuilt in M7)*
- Original version: introduction, three capabilities, canvas industry sphere, five-chapter
  journey, testimonial wall.
- The canvas sphere and the decorative sections were replaced; the journey was rewritten as
  first-person, and the profile is now the real one.

## M4 — Six concept projects
- **Files:** `src/components/demos/*`, `src/styles/demos.css`, product pages.
- **Features:** Halden Objects (store, cart, checkout, admin), Tillo (mobile business app),
  Deskhand (assistant UI with scripted local answers, disclosed in the interface), Linework
  (CRM pipeline + automations), Ember & Rye (ordering linked to a kitchen display). All six
  are code-split, labelled concept projects, and use fictional sample data.

## M5 — Remaining pages, inquiry, SEO
- Three service detail pages, three-step inquiry form (email / WhatsApp / copy handoff, nothing
  sent to a server), Creative Lab, 404, sitemap, robots, Open Graph image.

## M6 — Testing and deployment
- `npm run typecheck`, `npm run build`, `node tests/e2e.mjs`.
- Production remains on `main` and was **not** touched by this work.

---

## M7 — Six-language rebuild and redesign *(this branch)*

### Architecture
- Flat `src/app/*` routes replaced by `src/app/[locale]/`. Unprefixed URLs are rewritten to
  `/en` by `src/middleware.ts`, so existing links keep working.
- Every page declares a canonical URL and `hreflang` alternates for all six languages.
  `sitemap.xml` lists 126 URLs with alternates.
- `lang` and `dir` are set on a wrapper (`src/app/[locale]/layout.tsx`), not on `<html>`,
  because a child layout cannot own the `<html>` element. Arabic therefore gets `dir="rtl"` on
  the content wrapper with logical CSS properties throughout.

### Content and languages
- `src/i18n/{en,ar,es,de,fr,zh}.ts` — **255 UI keys** per language (nav, buttons, headings,
  form labels, errors, notices).
- `src/i18n/content/{locale}.ts` — **485 strings** per language: the six projects with five
  answered questions each, three services, eight problems, twelve industries, a five-chapter
  profile, four lessons and the supporting pages.
- `src/i18n/ui-labels.ts` — **57 labels** for the small interfaces drawn inside the product and
  service mockups (cart, checkout, column headings, prompts, disclosure notes), plus translated
  demo-frame notes. Brand names, product names and status values stay in English on purpose:
  a fictional brand does not translate its own product names, while the business language
  around them is fully translated.
- `npm run check:i18n` fails on a missing key, an empty string, a key that is identical to
  English (a sign of an untranslated string), or an extra key — across dictionaries, content,
  interface labels and demo notes. All six pass.
- Arabic was written in full in this milestone; it is not machine-pasted English.

### Visuals
- Ten generated photographs in `public/img/`, each cropped to a consistent 4:3 and compressed
  to WebP (q82, 1600 px). Each one is paired with an interface or a caption that explains the
  business situation, so no image is decoration.
- The second uploaded artwork is used as `public/img/portfolio-reference.webp` and shown inside
  a CSS monitor frame (`.reel`), at a modest size on phones.
- The uploaded photograph of Bilal was used only as an identity reference for the portrait;
  the original file is not published.
- Every interface is real HTML/CSS inside the page: store product page and cart, Tillo phone
  dashboard, Deskhand assistant thread, Linework pipeline, Ember kitchen display, Slowtide
  campaign dashboard. The fictional numbers are consistent across the whole site
  (Orders 124, Today's sales ₨48,500, Products 86, Pending 12).
- Stock photography was **not** used: every stock host is blocked from the build environment.
  That is stated here rather than hidden.

### Mobile
- Layouts are authored single-column first and expand at 460 / 560 / 760 / 860 / 900 / 1000 px.
- The hero keeps the portrait and a working phone interface side by side from 560 px, and
  stacks them with the interface overlapping the portrait below that, so the visitor never
  scrolls one large image and then a separate explanation.
- Interfaces embedded in photographs shrink to 52–62 % width rather than overflowing.
- Horizontal overflow is asserted per page in the test suite; all pages report 0 px.
- No WebGL, no scroll pinning, no blocking animation before content.

### Removed
- Human → machine concept, `src/three/studio.ts`, `public/scene/*`, `StudioCanvas`,
  `IndustryGlobe`, `LabStudio`, `TypeLab`, `demos/Cover`, the superseded flat pages and the old
  `src/data/{content,projects,services}.ts`.

### Verification
| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run build` | pass, 133 static pages |
| `npm run test:e2e` | **1301 passed, 0 failed** |
| `npm run check:i18n` | 6 locales, 262 UI keys + 485 content strings + 57 interface labels, complete |

`npm run test:e2e` checks, per locale and per route: HTTP 200, exactly one `<h1>`, correct
`lang` and `dir`, canonical plus hreflang, no leftover 3D references, no rendered
`undefined`/`NaN`, no untranslated English chrome; then legacy unprefixed URLs, real 404s, every
referenced image exists and is under 320 KB, sitemap coverage, robots, structured data, that the
demo is real markup rather than a screenshot, and security headers.

### Known limitations (stated, not hidden)
1. **No browser-level testing in this sandbox.** Chromium cannot start here (missing `libnspr4` /
   `libnss3`, and every system package mirror is blocked). The test suite therefore does not
   claim to verify scrolling, touch, focus order or animation timing — those need a human pass on
   the preview, or a machine with a browser.
2. **`scene-leads.webp` is a stand-in.** The image generator's 10-per-turn cap was reached in
   every attempt; the file currently duplicates `scene-operations.webp`. Replace it with a
   photograph of two people working through a call list when generation is available.
3. **Stock photography is unavailable** from this environment, so the ten photographs are
   generated rather than licensed. An image audit was produced in the previous session; the
   classification of each scene is in that report.
4. **Contact needs environment variables.** `NEXT_PUBLIC_CONTACT_EMAIL` and
   `NEXT_PUBLIC_WHATSAPP_NUMBER` must be set on the deployment for the form's handoff buttons to
   point anywhere real.
5. **Preview is SSO-protected.** The Vercel preview deployment is `private` with
   `ssoProtection: all_except_custom_domains`, so opening the preview URL requires signing in to
   the Vercel account.
6. **Testimonials and results are intentionally near-empty**, because inventing them was
   explicitly out of scope. Both pages say so.

---

## Next
1. Replace `scene-leads.webp` with a real photograph.
2. Human pass on the preview at 360 / 375 / 390 / 393 / 430 px, plus a screen-reader pass.
3. Run a browser-based test suite on a machine that has Chromium.
4. Set the two contact environment variables.
5. Only after approval: merge to `main` and promote to production.
