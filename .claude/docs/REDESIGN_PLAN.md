# Redesign plan (phase 2)

Status: approved 2026-11-18 (decisions in section 8).

## 1. Direction: "The swatch book"

The site is a colour swatch book for its own system. A swatch book is a set of named, coded colour chips, and each chip is a value you can swap. That is the product's mechanism: a new project changes token values and the whole site changes.

- **Ground and colour:** whole sections are colour fields (chips), not accents on a white page. Five chip themes map to `theme_override`.
- **Type:** one expanded grotesk for display, the same family for body, and a mono face for chip codes and labels. No serif.
- **Signature element:** the *chip*. It is a colour or image field with a white code strip under it (`NP–02 · Bottle`). It appears in the hero, as section index marks and on image captions.
- **Signature interaction (Home):** a fan deck. Five image chips are riveted at one corner and fan open on load and on scroll. Each one lifts on hover or focus.
- **Proof (Platform):** a live palette switcher that recolours the whole page by swapping CSS variables, and an animated editor → API → registry → component flow with real code excerpts from this repo.
- **Raises taken from rejected options:** every reveal moves on one shared beat (the same duration, ease and stagger tokens). Photos get one duotone treatment in the section's chip colours, so mixed stock images read as one set. The Platform flow is numbered in a strict margin column.

Alternatives I considered:
- A variable-font specimen, where a live axis slider restyles the page. It explains the product well, but its world is black on white with one accent, and that fails the brief's 60/30/10 colour requirement.
- The brief's example: cream, forest green and pink with an italic serif. This is the most common look for AI-made studio sites, and the inspiration screens all lean that way.

## 2. Palette (60 / 30 / 10)

| Token | Hex | Role |
|---|---|---|
| `--np-chalk` | #EDEFE7 | 60%: main ground (cool off-white, not cream) |
| `--np-bottle` | #0F3B30 | 30%: dark sections, headings, footer |
| `--np-flare` | #FF3D7F | 10%: accent fills, marks, large text on dark |
| `--np-flare-deep` | #D1185C | accent as small text on light grounds |
| `--np-sage` | #D3DDCC | light-secondary ground, card fill |
| `--np-ink` | #0C1411 | body text, dark-secondary ground |
| `--np-muted` | #46554D | secondary text on light |
| `--np-muted-dark` | #A9BBAF | secondary text on dark |

Contrast checks (WCAG 2.1 AA):

| Pair | Ratio | Result |
|---|---|---|
| ink / chalk | 16.1 | pass |
| bottle / chalk | 10.7 | pass |
| muted / chalk | 6.8 | pass |
| flare-deep / chalk | 4.53 | pass |
| ink / sage | 13.3 | pass |
| muted / sage | 5.6 | pass |
| chalk / bottle | 10.7 | pass |
| muted-dark / bottle | 6.2 | pass |
| flare / ink | 5.5 | pass |
| ink / flare (button label) | 5.5 | pass |
| flare / bottle | 3.7 | large text only |
| flare / chalk | 2.9 | decoration only |

Theme map (`theme_override` → chip):

| Value | Ground | Text | Accent |
|---|---|---|---|
| light (default) | chalk | ink | flare-deep text, flare fills |
| light-secondary | sage | ink | flare-deep |
| dark | bottle | chalk | flare, large only |
| dark-secondary | ink | chalk | flare |
| overlay | image + scrim | white | flare |

Editor colour slugs (`theme.json`, `var(--color-<slug>)`) stay. New values: primary = bottle, secondary = flare-deep, tertiary = muted, accent = flare, black = ink, white = #FFF, card-fill = sage.

## 3. Typography

All fonts load through `next/font/google`, so there is no new dependency. Inter, Outfit, Playfair, DM Sans and the local Paralex are removed from the font loader.

- **Archivo** (variable weight and width): display at width 112–125 and weight 500–800, body at width 100 and weight 400.
- **Geist Mono:** chip codes, labels, eyebrows, nav numbers and code.

Fluid scale. Every size is a `clamp()`. Editor classes map to tokens:

| Class / token | min → max | Use |
|---|---|---|
| `heading-3xl` | 3.25 → 10rem | hero lines |
| `heading-2xl` | 2.75 → 6.5rem | page titles |
| `heading-xl` | 2.25 → 4.5rem | section titles (h2) |
| `heading-lg` | 1.75 → 3rem | h3 |
| `heading-md` | 1.375 → 2rem | h4 |
| `heading-sm` | 1.125 → 1.5rem | h5 |
| `heading-xs` | 1 → 1.125rem | h6 / mono eyebrow |
| body-lg | 1.125 → 1.375rem | lead text |
| body | 1 → 1.125rem | body (16px minimum) |
| body-sm | 0.875 → 0.9375rem | captions |

Other text classes: `text-primary` (bottle), `text-secondary` (flare-deep), `text-teriary` (muted, typo kept), `text-accent` (flare, applied only where it passes contrast) and `font-secondary` (mono). There are also tokens for weights, line heights (0.9 for display, 1.55 for body) and tracking.

## 4. Token set (all CSS variables)

- **Where tokens live:** `themes/default/theme.scss` holds the raw, semantic and theme layers, and is wired into `layout.tsx`. `globals.css` keeps the Tailwind entry and safelist and maps the tokens with `@theme inline` (`bg-surface`, `text-fg`, `text-muted`, `bg-accent`, …).
- **Spacing:** `xs` .5rem, `sm`, `md`, `lg`, `xl` as clamps, `margin` (page gutter clamp(1rem, 4vw, 4rem)), `section` (clamp(5rem, 11vw, 11rem)) and `header` (header height). Tokens are added for the `padding_*` options `section` and `header`.
- **Grid:** 12 columns with a fluid gutter. The existing `--col-size` and `col-*` utilities are kept.
- **Radius:** `none` 0 (the default), `sm` 2px, `pill` 999px (only for the palette switcher's selected state).
- **Borders:** a 1px hairline in `currentColor` at 20%, plus a 2px "rule" for chip strips.
- **Shadows:** one lift shadow for the fan deck. Nowhere else.
- **Motion:** durations `fast` 160ms, `base` 320ms, `slow` 640ms and `beat` 900ms. Easings `out` (0.22, 1, 0.36, 1) and `in-out`. A `stagger` of 70ms. `prefers-reduced-motion` sets every duration to 0 and turns off parallax and the fan deck animation.
- **Images:** `.img-duotone` (grayscale plus a multiply layer in the section ground; full colour on hover), `.img-chip` (image plus a code strip) and aspect tokens (`portrait` 4:5, `landscape` 3:2, `strip` 21:9).
- **Breakpoints:** kept as they are (xs 320 … 3xl 2000). Existing code and the safelist use them.

## 5. Blocks

Rebuilt (markup and styles only; every existing field still renders; no `fields.json` changes):
- **header:** sticky with a mono numbered nav. A menu item with the CSS class `is-cta` renders as the flare button. On mobile, a full-screen bottle menu opens from a real `<button>` (the current trigger is a div with no keyboard support).
- **footer:** bottle ground, nav columns, copyright, and a giant "Nextpress" wordmark set in the last viewport.
- **hero-image:** editorial split. The image is an offset chip, not full-bleed.
- **text-and-image:** all 5 styles redesigned.
- **text-section:** a large statement column and a supporting column.
- **stacked-links:** full-width type rows with an arrow and an accent sweep on hover.
- **stats:** mono numerals on a hairline grid.
- **parallax-image:** CSS scroll-driven parallax with a static fallback.
- **featured-posts** and **archive-feed:** restyled only. archive-feed keeps its data handling. Neither is seeded, because both need posts and the brief allows exactly five pages.
- **BlockWrapper:** every block uses it. `theme_override` maps to the chip themes. The padding values map to spacing tokens and win over a block's own `top_spacer` / `bottom_spacer` when set.
- **Core blocks:** heading, paragraph, list and list-item (raw HTML is styled), quote, code, columns, group, buttons and image. They get the same type, spacing and themes. The site's `core/group` override is restyled, and its TabbedContent hash behaviour is kept.

New blocks (they follow the existing `fields.json` + `index.tsx` + organism pattern):

| Block | Fields | Purpose |
|---|---|---|
| `deck-hero` | heading (wysiwyg), content, buttons[link], images (gallery, 3–6), chip_labels (repeater text) | hero with a fanned image deck |
| `marquee` | items (repeater text), speed (select), direction (select) | ticker strip; pauses on hover; static under reduced motion |
| `gallery` | heading, images (gallery), captions (repeater), layout (select: mosaic / filmstrip / stagger / collage) | image galleries and compositions |
| `timeline` | heading, intro, items (repeater: marker, title, text, image) | process or history timeline |
| `process-flow` | heading, intro, steps (repeater: label, title, text, code, code_label) | numbered system flow with code excerpts |
| `palette-switcher` | heading, intro, presets (repeater: name, chalk/bottle/flare/sage colour_picker) | live token preview: recolours the page |
| `contact-form` | heading (wysiwyg), content, gravity_form, aside (wysiwyg) | Gravity Form submitted through REST, with full validation and error states |

`contact-form` reuses `organisms/forms/GravityForm.tsx`, rebuilt. It gains `is_valid: false` field errors, network errors, a success state and accessible labels.

## 6. Pages

Each page has a different opening composition and mixes custom and core blocks.

**Home** (showpiece)
1. deck-hero (light)
2. marquee (flare strip)
3. text-section (light, padding section)
4. text-and-image narrative, duotone (dark)
5. core group: heading + columns + list, "How a page is made" (light)
6. stacked-links, what you can build (light-secondary)
7. parallax-image break-out (overlay)
8. core group CTA: heading + buttons (dark-secondary)

**About**
1. hero-image editorial split (light)
2. core heading, paragraphs and quote at a narrow reading measure (light)
3. gallery collage (light-secondary)
4. text-and-image card + image_tags (light)
5. stats, "This site in numbers": true counts only, such as pages, blocks and themes (dark)
6. timeline, a generic process: Brief → System → Blocks → Content → Launch (dark-secondary)
7. text-and-image centered-card CTA to Work (light)

**Platform**
1. text-section with a huge statement (dark-secondary)
2. process-flow, editor → ACF block → REST → registry → component → page, with real code excerpts (dark-secondary, continuous)
3. core columns: custom vs core blocks, with lists and a core code block showing BlockWrapper options (light)
4. palette-switcher (light-secondary)
5. text-and-image standard with tags such as Next.js, ACF and Tailwind (light)
6. marquee of the block names (dark)
7. core group CTA (dark)

**Work** ("studies": layout explorations, never presented as client projects)
1. gallery filmstrip as the opener with a large title (light)
2. gallery mosaic with captions "Study 01 — Editorial" and so on (light)
3. text-and-image wide (dark)
4. parallax-image container (light)
5. gallery stagger (light-secondary)
6. core group CTA (dark-secondary)

**Contact**
1. contact-form, a split layout with the huge heading and the form (dark)
2. stacked-links to Platform, Work and About (light)
3. marquee closing strip (flare)
4. Then the footer wordmark closes the page.

Menus: a header menu (About, Platform, Work, Contact with `is-cta`) and a footer menu (all five pages).

## 7. Seed script

`backend/seed/seed-showcase.sh`. It is bash plus WP-CLI through the compose `wpcli` service, using the env workaround from CLAUDE.md.

- Images are committed in `backend/seed/images/`: about 15 photos, resized to 2400px maximum, WebP/JPEG at about 200KB. A `sources.json` (or a header in the script) records the URL, author and licence of each one (Unsplash or Pexels licence).
- Idempotent. Every item the script creates carries the meta `_np_seed_key`. A second run updates those items. It finds pages by key, media by key, menus by name and the form by title.
- It never deletes. It only touches items it created, plus the approved exceptions in section 8.
- After each run, it curls `/wp-json/nextpress/router/<path>` for the five pages and checks the block names.
- Reset: a `--reset` flag deletes only the items that carry `_np_seed_key`.

## 8. Approval items (brief section 2)

Decided 2026-11-18:

1. **GF REST API:** the user enabled it in wp-admin. Anonymous `POST /gf/v2/forms/<id>/submissions` is reachable, and Disable REST API does not block it. The browser posts directly. The `GF_CONSUMER_KEY`/`SECRET` in `frontend/.env` are not used for submissions.
2. **GF form:** the user created it. Form ID 1, "Contact Us" (Name*, Email*, Project Type, Message, Consent). The seed only references it and never creates or edits forms.
3. **Seed overwrites (approved):** Home page ID 2 content; the header/footer Templates layouts (logo → Nextpress SVG wordmark, navs → seeded menus); the `header_nav`/`footer_nav` menu locations; `frontend_url` = `http://localhost:3000`.
4. **PHP:** remove only the debug `error_log` lines in `nextpress-theme/functions.php`, in their own commit.

There are no `fields.json` changes and no new dependencies.
