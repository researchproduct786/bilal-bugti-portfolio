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
1. ~~No browser-level testing in this sandbox.~~ **Superseded** — Chromium was later built from
   source (see the final milestone below) and driven against the production build. See that
   section for the routes, locales and motion states actually verified.
2. ~~`scene-leads.webp` is a stand-in.~~ **Resolved** — it is now a distinct image of a team
   working through a call list, not a duplicate of `scene-operations.webp`.
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

---

# Milestone: final visual quality audit

Branch `arena/d81b63b6-bilal-bugti-portfolio`, commit `49c5f6a`. Production untouched, PR #2
still open and unmerged.

## What changed

**Spatial glass language** — new `src/styles/spatial.css`. Three glass tiers (far / mid / near),
layered contact + falloff + ambient shadows, a single specular edge highlight per surface, and
two consistent light sources (cool key upper-left, warm fill lower-right). Blur is applied to a
few surfaces sitting over real content rather than to everything, so some things stay sharp and
others genuinely sit behind.

**Nav** — a floating glass pill that thickens its blur, border and shadow once the page moves,
with a short settle-in that respects reduced motion.

**Hero cut-out** — rebuilt as four real planes: a soft studio plate, a wide glass card holding a
working storefront, the cut-out subject whose head clears that card's top edge, and a near
glass dashboard card in front of the shoulder. Uses real `z-index`, so it survives resize, RTL
and reduced motion.

**The portrait itself** — generated from the supplied photograph with identity preserved, then
keyed off a chroma backdrop into a genuine alpha cut-out (`portrait-hero.webp`, 900×1016,
98 KB). The cyan key spill was removed at the pixel level rather than by eroding the matte, so
fine hair strands survive without a coloured rim. The about-page portrait (`portrait-bilal.webp`)
was regenerated from the same source, so both portraits show the same person in the same session.

**Motion** — `DepthMotion` drives GSAP ScrollTrigger parallax, staggered reveals and a
scroll-linked hero timeline where each plane moves at its own speed. Nothing is pinned, nothing
delays reading, and it aborts on reduced motion, coarse pointers or ≤2 cores.

**Interfaces** — every device screen now holds specific, coherent content; fixed several cards
that cropped their interface mid-row, a literal `{l.askPlaceholder}` token rendering on screen,
and an empty dashboard column in the campaign panel. One currency (Rs) across the whole site so
the marketing figures and the demos agree.

## Bugs found only by rendering the page

| Symptom | Cause |
| --- | --- |
| Every page hit the error boundary | `LocaleProvider` was `LocaleContext.Provider` — React 19 resolves that to a lazy `Context` object |
| Blank hero | Entrance classes were not in the `Interactions` observer selector, so they stayed at `opacity: 0` |
| Near hero card clipped | A `focus-in` ancestor left `clip-path: inset(0)` behind permanently |
| 173 px horizontal scroll (desktop) | A light field bled past the viewport edge |
| 47 px horizontal scroll (phone) | Nav pill's inline padding sat outside its own width |
| Problem selector was one run-on line | `.ps*` classes were used in markup but had no CSS at all |
| `{l.askPlaceholder}` visible in the UI | A template literal written into a label table |
| Parallax silently dead on desktop | Capability gate used `hover: none`, which matches touch-screen desktops |

## Verification actually performed

Headless Chromium 153 (NSS/NSPR built from source, see below), driving the **production build**
served by `next start`:

- `npx tsc --noEmit` — clean.
- `npm run build` — clean, 133 static pages.
- `npm run test:e2e` (BASE=http://127.0.0.1:3100) — **1325 passed, 0 failed**.
- `npm run check:i18n` — 6 locales, 264 UI keys, 485 content strings, all complete and distinct.
- Browser sweep of `/en`, `/es`, `/de`, `/fr`, `/ar`, `/zh`, `/en/work`, `/en/work/tillo`,
  `/en/services`, `/en/services/ai-business-systems`, `/en/process`, `/en/about`, `/en/contact`,
  `/en/industries`, `/en/insights`, `/en/lab`, `/ar/work`, `/ar/contact`, `/zh/work`, `/fr/lab`
  at 390×844 — no crashes, no horizontal overflow, **console completely clean**.
- Arabic verified as real RTL: `dir=rtl` on the locale wrapper, mirrored hero planes, Arabic h1.
- `prefers-reduced-motion: reduce` — zero hidden or permanently transformed elements.
- Parallax verified numerically on an emulated desktop: plate +4 px, back card +11 px,
  subject −24 px, near card +16 px at the same scroll offset — genuine depth separation.
- Below 900 px and on coarse pointers the parallax is off by design; CSS reveals carry the page.

### Browser tooling note
Chromium could not start in this sandbox initially: `libnss3`, `libnssutil3` and `libnspr4` were
missing and every package mirror is blocked. They were built from source over GitHub
(NSS `NSS_3_101_RTM` + NSPR `main`, `gyp-next`, `ninja`) and loaded via
`LD_LIBRARY_PATH=/tmp/nss/dist/Release/lib`. `tests/browser.mjs` exposes the `launch()` helper.

## Manual visual QA checklist (still worth a human pass)

Open the preview signed in as `researchproduct786`.

1. **Hero, desktop** — head clearly clears the glass card's top edge; the near card overlaps the
   shoulder without covering the face; storefront tiles read on both sides of the body.
2. **Hero, phone (360 / 375 / 390 / 393 / 430)** — three planes still legible, near card clear of
   the sticky contact bar, no sideways scroll.
3. **Scroll** — planes separate at different speeds; sections fade/rise once; nothing jumps;
   no pinned section blocks scrolling.
4. **Cut-out edges** — zoom to 200 % on the hair: no cyan fringe, no hard matte line.
5. **Nav** — pill thickens after scrolling; menu overlay opens/closes; language switch keeps you
   on the same page in the new locale.
6. **Arabic** — `/ar`: whole layout mirrors, numerals and Rs amounts read correctly, hero planes
   swap sides.
7. **Demos** — `/en/work/halden-objects` add to cart, `/en/work/tillo` advance an order,
   `/en/work/linework-crm` move a deal; every screen shows real content, none empty.
8. **Contact** — three steps, validation, and the copy/send handoff.
9. **Reduced motion** — enable it in the OS, reload: everything visible, no animation.
10. **Console** — no errors on any route.
