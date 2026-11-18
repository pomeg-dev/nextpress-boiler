---
name: Nextpress
description: The showcase site for Nextpress, built as a swatch book of its own token system.
colors:
  np-chalk: "#edefe7"
  np-chalk-raised: "#f7f8f3"
  np-sage: "#d3ddcc"
  np-bottle: "#0f3b30"
  np-bottle-raised: "#164a3d"
  np-ink: "#0c1411"
  np-ink-raised: "#17211c"
  np-flare: "#ff3d7f"
  np-flare-deep: "#b01350"
  np-flare-light: "#ff8fb3"
  np-muted: "#46554d"
  np-muted-dark: "#a9bbaf"
  np-white: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 1.5rem + 7.78vw, 8.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "\"wdth\" 118"
  headline:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2.75rem, 1.67rem + 4.81vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "\"wdth\" 118"
  title:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1.58rem + 2.96vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 108"
  subtitle:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.375rem + 1.67vw, 2.875rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 108"
  body-lg:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(1.125rem, 1.042rem + 0.37vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(1rem, 0.958rem + 0.19vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "\"wdth\" 100"
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(0.75rem, 0.729rem + 0.09vw, 0.8125rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.08em"
rounded:
  corner-none: "0"
  corner-sm: "2px"
  corner-md: "3px"
  corner-pill: "999px"
spacing:
  space-xs: "0.5rem"
  space-sm: "clamp(1rem, 0.833rem + 0.74vw, 1.5rem)"
  space-md: "clamp(1.5rem, 1rem + 2.22vw, 3rem)"
  space-lg: "clamp(2.5rem, 1.667rem + 3.7vw, 5rem)"
  space-xl: "clamp(4rem, 2.667rem + 5.93vw, 8rem)"
  space-section: "clamp(5rem, 3rem + 8.89vw, 11rem)"
  space-margin: "clamp(1rem, 4vw, 4rem)"
  space-header: "clamp(4rem, 3.667rem + 0.93vw, 4.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.np-flare}"
    textColor: "{colors.np-ink}"
    rounded: "{rounded.corner-md}"
    padding: "1em 1.25em"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.np-bottle}"
    textColor: "{colors.np-chalk}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.np-ink}"
    rounded: "{rounded.corner-md}"
    padding: "1em 1.25em"
  button-high-contrast:
    backgroundColor: "{colors.np-bottle}"
    textColor: "{colors.np-chalk}"
    rounded: "{rounded.corner-md}"
    padding: "1em 1.25em"
  chip-strip:
    backgroundColor: "{colors.np-chalk-raised}"
    textColor: "{colors.np-ink}"
    typography: "{typography.label}"
    height: "2.75rem"
    padding: "0 0.875rem"
  pill:
    backgroundColor: "{colors.np-chalk-raised}"
    textColor: "{colors.np-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.corner-sm}"
  pill-accent:
    backgroundColor: "{colors.np-flare}"
    textColor: "{colors.np-ink}"
    rounded: "{rounded.corner-sm}"
  field-control:
    textColor: "{colors.np-ink}"
    rounded: "{rounded.corner-sm}"
    padding: "0.75rem 1rem"
    height: "3rem"
  palette-option-selected:
    backgroundColor: "{colors.np-bottle}"
    textColor: "{colors.np-chalk}"
    rounded: "{rounded.corner-pill}"
---

# Design System: Nextpress

Source of truth: `frontend/themes/default/theme.scss` (all token values and the six colour themes). `frontend/src/ui/globals.css` only maps those tokens to Tailwind through `@theme inline`. Change values in theme.scss, never in `@theme`. Derived from the build at `major/ui-redesign` 0e49572a.

## Overview

**Creative North Star: "The Swatch Book"**

The site is a swatch book of its own system. Every section is a whole colour field (a chip) picked from six named themes, and images and code excerpts are chips too: a field over a white code strip carrying a mono code such as `NP–02 · Bottle`. Because each chip is a token value, the site shows its own mechanism: a new project changes values in `theme.scss` and every section follows.

The palette runs 60/30/10: cool chalk ground, deep bottle-green fields, a hot flare pink used in small doses. Type is one expanded variable grotesk (Archivo, width axis pushed out for display) with Geist Mono for codes, labels, numerals and code. Corners are square or nearly so, structure is drawn with hairlines, and depth is almost absent. Photographs are unified by one duotone treatment in the section's own colours. All reveals share one motion beat.

The world refuses two looks by intent: the cream-and-italic-serif studio template and the dark SaaS hero.

**Key Characteristics:**
- Sections are whole colour fields chosen by `data-theme`; no white page with accents.
- Chips: image or code over a white mono code strip.
- Expanded Archivo display at very large fluid sizes, tight negative tracking.
- Geist Mono for every code, label, numeral and nav index.
- Square-ish corners (0–3px), 1px hairline rules, 2px accent rules.
- One duotone image treatment; one lift shadow; one motion beat.

## Colors

A cool, green-black system lit by one hot pink. Raw `--np-*` values are never used directly in components; components read the role tokens that each theme sets.

### Primary
- **Bottle Green** (`--np-bottle`): the 30%. Ground of `dark` sections, the footer and the mobile menu; heading colour and `--inverse` on light themes; the primary button's hover fill. Editor slug `primary` resolves to it on light themes.

### Secondary
- **Flare** (`--np-flare`): the 10%. Fills only on light grounds: primary button, marquee marks, list markers, link underlines, text selection, the stacked-link hover sweep, the `flare` theme ground. As text only on `ink` or `dark-secondary` grounds. Role token `--np-accent-fill`.
- **Flare Deep** (`--np-flare-deep`): flare as small text on chalk and sage (about 5.9:1 on chalk). Role token `--np-accent` and editor slug `secondary`/`accent` on light themes.
- **Flare Light** (`--np-flare-light`): flare as text on bottle and over images (about 5.8:1 on bottle). Role `--np-accent` on `dark` and `overlay`.

### Neutral
- **Chalk** (`--np-chalk`): the 60%. Default ground, `html` background, text on dark themes.
- **Chalk Raised** (`--np-chalk-raised`): the white of every chip strip; raised surfaces on light themes.
- **Sage** (`--np-sage`): `light-secondary` ground, `card-fill` editor slug, duotone light tone.
- **Ink** (`--np-ink`): body text on light grounds, `dark-secondary` ground, text on flare (`--np-on-accent`), editor slug `black`.
- **Bottle Raised / Ink Raised** (`--np-bottle-raised`, `--np-ink-raised`): code panels and raised surfaces inside dark themes.
- **Muted** (`--np-muted`) and **Muted Dark** (`--np-muted-dark`): secondary text on light and dark grounds (`--fg-muted`, editor slug `tertiary`).
- **White** (`--np-white`): text in the `overlay` theme; editor slug `white`.

### Colour themes

Each theme sets the role tokens `--surface`, `--surface-raised`, `--fg`, `--fg-muted`, `--heading`, `--rule`, `--np-primary`, `--np-secondary`, `--np-tertiary`, `--np-accent`, `--np-accent-fill`, `--np-on-accent`, `--inverse`, `--on-inverse`, `--focus`, `--duotone-dark`, `--duotone-light`.

| Theme | Ground | Text / heading | Accent text | How it is picked |
|---|---|---|---|---|
| `light` (default) | chalk | ink / bottle | flare-deep | Block Settings `theme_override`; fallback |
| `light-secondary` | sage | ink / bottle | flare-deep | `theme_override`; core group `card-fill` |
| `dark` | bottle | chalk / chalk | flare-light | `theme_override`; core group `primary` |
| `dark-secondary` | ink | chalk / chalk | flare | `theme_override`; core group `black` |
| `overlay` | transparent (image + `--scrim`) | white | flare-light | `theme_override`; parallax-image, footer with image |
| `flare` | flare | ink / ink | ink | marquee accent toggle; core group `accent`/`secondary` (not a `theme_override` choice) |

Editor colour slugs from `nextpress-theme/theme.json` (`primary`, `secondary`, `tertiary`, `accent`, `black`, `white`, `card-fill`) resolve as `var(--color-<slug>)` and are re-declared on every `[data-theme]`, so saved Gutenberg colours follow the section. Keep those names.

### Named Rules
**The Whole Field Rule.** A section's colour is its theme, set on the section by `data-theme`. Do not paint a background inside a section to fake a different chip; nest a themed group instead.

**The Flare Dose Rule.** Flare is the 10%. It fills small marks and one primary action per view; as text it appears only through `--np-accent` (flare-deep, flare-light or flare, by theme). Flare is never body text on chalk.

**The Re-declare Rule.** Any role variable that a utility reads must be declared on every `[data-theme]`, because a value redefined only on a descendant does not reach utilities resolved higher up.

## Typography

**Display Font:** Archivo variable, width axis 118 for display and 108 for headings (with Arial Narrow, Arial)
**Body Font:** Archivo at width 100 (with Arial)
**Label/Mono Font:** Geist Mono (with ui-monospace, SFMono-Regular, Menlo)

**Character:** One family stretched wide and set heavy for display, at its normal width for reading, paired with a precise mono that reads as the code printed on a swatch.

### Hierarchy
Every size is a `clamp()` from a 360px to a 1440px viewport. Editor classes `.heading-3xl` … `.heading-xs`, `.body-lg`, `.body-sm` and the `text-heading-*` utilities share the same `--fs-*` tokens.
- **Display** (`--fs-heading-3xl`, 3.25 → 8.5rem; weight 700; line-height 0.92; tracking -0.035em): hero lines (`heading-3xl`).
- **Headline** (`--fs-heading-2xl`, 2.75 → 6rem; 700; 0.92): page titles and `h1`.
- **Title** (`--fs-heading-xl`, 2.25 → 4.25rem; 600; 1.0; -0.02em): section titles and `h2`; also marquee items, mobile menu links and stat figures.
- **Subtitle** (`--fs-heading-lg`, 1.75 → 2.875rem; 600; 1.0): `h3`, statement paragraphs, stacked-link titles, footer nav links, process-flow numbers.
- **Small headings** (`--fs-heading-md` 1.375 → 2rem, `--fs-heading-sm` 1.125 → 1.5rem, `--fs-heading-xs` 1 → 1.125rem; 600; 1.25): `h4`–`h6`, quotes, form confirmation.
- **Body** (`--fs-body` 1 → 1.125rem; 400; 1.55) and **Lead** (`--fs-body-lg` 1.125 → 1.375rem): reading text at `--measure` (65ch) or `--measure-narrow` (42ch). Body never falls below 16px.
- **Small** (`--fs-body-sm` 0.875 → 0.9375rem; 1.25): nav links, help text, code blocks.
- **Label** (`--fs-label` 0.75 → 0.8125rem; Geist Mono 500; tracking 0.08em; uppercase): chip strips, pills, nav indices, timeline markers, captions, the menu toggle.

Editor text classes: `text-primary`, `text-secondary`, `text-teriary` (typo is intentional; it is in saved content), `text-accent`, `font-secondary` (mono). Never rename them.

### Named Rules
**The One Family Rule.** Display and body are both Archivo; character comes from the width axis and weight, not from a second face. No serif anywhere.

**The Mono Means Code Rule.** Geist Mono is reserved for codes, labels, numerals, indices and code. It never sets running body copy or a heading.

## Layout

- **Container:** `container` utility, max width `--pagewidth` (1680px), side gutter `--space-margin` (1rem → 4rem). Blocks lay out on a 12-column grid from `lg`; `--col-size` (and the `w-col-*` / `max-w-col-*` utilities) divides the page by `--grid-columns` (24).
- **Section rhythm:** sections pad by `--space-section` (5rem → 11rem). Block Settings `padding_top` / `padding_bottom` map to the spacing tokens (`0`, `xs`, `sm`, `md`, `lg`, `xl`, `margin`, `section`, `header`) through `BlockWrapper` and win over a block's own spacer fields.
- **Inner rhythm:** `space-xs` (0.5rem) for tight gaps, `space-sm`/`space-md` within components, `space-lg`/`space-xl` between groups. Rich text uses `.flow` (1em between siblings, 1.5em before `h2`–`h4`, 0.6em after a heading).
- **Breakpoints** (Tailwind screens, defaults reset): xs 320, sm 390, md 720, lg 1080, xl 1440, 2xl 1720, 3xl 2000. Some component CSS in theme.scss uses raw 48rem and 64rem queries instead.
- **Header:** sticky, `--header-h` (4 → 4.5rem); hides on scroll down, shows a hairline once scrolled. `scroll-padding-top` matches it.
- **Break-out:** `.break-out` escapes to the viewport edges; the deck and the filmstrip run on into the page margin from `lg`.

## Elevation & Depth

The system is flat. Depth comes from the colour fields themselves, from `--surface-raised` tones inside a theme, and from hairlines. One shadow exists.

### Shadow Vocabulary
- **Lift** (`--shadow-lift`: `0 1px 2px rgb(12 20 17 / 0.12), 0 24px 48px -16px rgb(12 20 17 / 0.4)`): physical objects only. Used on deck chips, the overlapping chip in the gallery collage, and the floating cookie panel.

### Named Rules
**The Paper Rule.** Surfaces are flat. A shadow means a chip is lying on top of something else. Cards, buttons and fields never take a shadow.

## Shapes

Square by default. `--corner-sm` (2px) on pills, fields, code panels and form messages; `--corner-md` (3px) on buttons (the Button atom applies `rounded-md`) and the cookie panel. `--corner-pill` (999px) only on the palette switcher's selected preset, its swatch ends, the cookie switch track, and the Button atom's circular icon well. Chips and images have no radius.

Lines: `--border-width` (1px) hairlines in `--rule` (the theme's text colour at 16–35%) for row dividers, grids and section edges; `--rule-width` (2px) flare rules above quotes and the form confirmation, and as field underlines on hover and focus. Small solid squares (the flare mark in chip strips, marquee marks, timeline markers) are the recurring glyph.

Aspect tokens: `--ratio-portrait` 4/5, `--ratio-square` 1/1, `--ratio-landscape` 3/2, `--ratio-strip` 21/9.

## Components

### Buttons
Shape and colour live in `.button` (theme.scss); size and padding come from the Button atom.
- **Shape:** 3px corners (`--corner-md`), minimum height 2.75rem, padding 1em × 1.25em.
- **Primary:** `--np-accent-fill` with `--np-on-accent` text (flare with ink on most themes; ink with chalk on `flare`).
- **Hover:** fills with `--inverse` / `--on-inverse` (bottle with chalk on light themes); a trailing arrow nudges 0.25em right. Transitions on `--dur-base` with `--motion-ease-out`.
- **Secondary / Tertiary:** transparent with a 1.5px inset ring in `currentColor`.
- **High-contrast:** `--inverse` fill; hovers to flare.
- **No-fill:** text link with a 1px flare underline; hover colours the text `--np-accent`. Keeps the 44px target.
- **Card:** `--surface-raised` fill.

### Chips (signature)
- **Chip:** a figure with `--np-chalk-raised` background and ink text, holding a media area (no radius) over a **chip strip**.
- **Chip strip:** 2.75rem high (`--chip-strip-h`), mono label, uppercase, spaced code on the left and a small flare square on the right. Codes follow `NP–NN · Word` (en dash, two digits, middle dot).
- Used by the deck hero, hero-image, text-and-image, gallery items and process-flow code panels (there the strip is a file name, not uppercase, over a raised code panel).

### Fan deck (deck-hero)
Up to six image chips at 4:5, riveted at their bottom-left corner. The top chip stands upright; the ones under it fan clockwise across `--spread` (56deg). On load they fan open on `--dur-beat` with a `--stagger` delay; hover lifts a chip 0.75rem. Only the top chip shows its code; lower chips show the flare square and keep the code for screen readers. From `lg` the deck takes the right 5 of 12 columns and runs into the page margin.

### Duotone images
`.img-duotone`: the photo in grayscale multiplied over `--duotone-light`, with `--duotone-dark` lightened on top, so every image is recoloured in the section's own theme. `.is-revealable` returns full colour on hover or focus-within over `--dur-slow`.

### Pills
Mono label type, 2px corners, 1px inset rule. Variants: raised (`primary`, `card`), `accent` (flare fill), `high-contrast`/`inverted` (`--inverse`), `no-fill`.

### Inputs / Fields
- **Style:** a 6% tint of `--fg` as fill, 2px corners, 3rem minimum height, a 1px `--fg-muted` underline drawn as an inset shadow.
- **Hover / Focus:** underline thickens to 2px in `--fg`; focus adds the 2px `--focus` outline at 2px offset.
- **Error:** 2px underline and help text in `--np-accent`, with an icon. Form-level error is a flare panel; success is a raised panel with a 2px flare top rule in heading type.
- **Consent:** checkbox with flare `accent-color`; the whole row is the 44px target.

### Navigation
- **Header:** sticky `light` bar. Links in body-sm, weight 500, each prefixed by a mono **nav index** (`01`, `02` …) in `--fg-muted`, flare-deep on the current page. A flare underline draws in from the left on hover. A menu item with the class `is-cta` renders as the primary button.
- **Mobile:** a real `<button>` with a mono "Menu" label and two bars that cross into an X opens a full-height `dark` panel below the bar (clip-path wipe on `--dur-slow`). Links are Title-size display type with their indices, staggered in.
- **Footer:** `dark` (or `overlay` with an image). Nav links are Subtitle-size rows on hairlines with an arrow that slides in on hover; a full-width "Nextpress" wordmark closes the page.

### Row components
- **Stacked links:** full-width rows (title, text, arrow) on hairlines; on hover or focus a flare field sweeps in from the left and the text turns ink.
- **Stats:** mono figures at Title size with tabular numerals on a hairline grid.
- **Timeline and process flow:** rows on hairlines with a fixed marker column (a flare square plus a mono label, or a large mono step number), copy, and optional duotone image or code chip.
- **Marquee:** one line of display type between hairlines with flare square marks; pauses on hover; a toggle stops it; static under reduced motion.

### Palette switcher (signature)
Preset buttons each show a four-swatch strip; the selected preset turns `--inverse` and morphs to a pill. Choosing one rewrites the `--np-*` raw tokens on the page and a mono contrast table reports WCAG AA results live.

### Motion
One beat: `--dur-fast` 160ms (colour), `--dur-base` 320ms (state), `--dur-slow` 640ms (image and panel), `--dur-beat` 900ms (entrances), `--motion-ease-out` cubic-bezier(0.22, 1, 0.36, 1), `--motion-ease-in-out` cubic-bezier(0.65, 0, 0.35, 1), `--stagger` 70ms, `--reveal-distance` 1.5rem. `[data-reveal]` plays a scroll-driven fade-up where supported (content is visible without it). Under `prefers-reduced-motion` every duration drops to 0.01ms, stagger to 0, and parallax, the fan and the marquee stop.

## Do's and Don'ts

### Do:
- **Do** pick a section's colour through `theme_override`, a core group background slug, or `data-theme`; read colours through role tokens (`--surface`, `--fg`, `--heading`, `--np-accent`, `--np-accent-fill`).
- **Do** caption images with a chip strip using the `NP–NN · Word` code format, mono, uppercase.
- **Do** put every photograph through `.img-duotone` so mixed stock reads as one set.
- **Do** draw structure with 1px `--rule` hairlines and keep corners at 0–3px.
- **Do** use the shared motion tokens for every transition and keep the 2.75rem (44px) minimum on every interactive element.
- **Do** change the look by changing values in `theme.scss`; keep token names and editor slug names stable.

### Don't:
- **Don't** use flare (`--np-flare`) as small text on chalk or sage; use `--np-accent`, which resolves to an AA-safe tint per theme.
- **Don't** add shadows to cards, buttons or fields; `--shadow-lift` is for chips lying on top of something.
- **Don't** set a mono kicker or eyebrow above a heading; the label belongs in the chip strip or closes the text.
- **Don't** introduce a serif, a second sans, or a cream ground.
- **Don't** add a colour value outside the `--np-*` palette, or set values in Tailwind's `@theme` blocks.
- **Don't** rename editor classes (`heading-*`, `text-teriary`, `font-secondary`) or the `--color-<slug>` variables.
