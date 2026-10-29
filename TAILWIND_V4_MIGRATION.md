# Tailwind CSS v3 → v4 migration

This documents the switch from Tailwind v3 (JS config) to v4 (CSS-first config), including a new design system that replaced the old one.

## Summary

- `tailwindcss` v3.2.6 → v4.3.2, using a new CSS-based design system (colors, spacing, typography, components) supplied as a full replacement for the old `tailwind.config.js`.
- The old JS config, its custom column-utility plugin, and the old component styling in `themes/default/theme.scss` are gone. Everything now lives in `src/ui/globals.scss`.

## Package changes (`frontend/package.json`)

| Package | Before | After |
|---|---|---|
| `tailwindcss` | `^3.2.6` | `4.3.2` |
| `@tailwindcss/postcss` | — | `4.3.2` (new — v4's PostCSS plugin) |
| `autoprefixer` | `^10.4.13` | removed (v4 handles vendor-prefixing internally via Lightning CSS) |

## `postcss.config.js`

```diff
 module.exports = {
   plugins: {
-    tailwindcss: {},
-    autoprefixer: {},
+    "@tailwindcss/postcss": {},
   },
 };
```

## `tailwind.config.js` — deleted

Nothing in the codebase `require`d or `import`ed it directly, so removing it was safe. It previously held:
- Custom `colors`, `fontSize`, `screens`, `container`, and `extend` (spacing/radius/fontFamily/gridTemplateColumns) config.
- A `safelist` for dynamically-generated class names (notably column-grid classes, likely populated at runtime from CMS/ACF field data rather than static JSX — worth remembering if any `max-w-col-*`/`gap-col-*` etc. classes stop appearing on CMS-driven content, since v4 has no equivalent JS `safelist` option; see **Known gaps** below).
- A custom `plugin()` that generated `max-w-col-*`, `w-col-*`, `min-w-col-*`, `gap-col-*`, `gap-x-col-*`, `gap-y-col-*`, `ml-col-*`, `mr-col-*`, `mx-col-*`, `pl-col-*`, `pr-col-*`, `px-col-*` utilities (1–24) driven by a `--col-size` variable. **This plugin was not ported.** The new design system defines its own, narrower column-width scale (`--width-col-1` through `--width-col-16` in `@theme`, generating only `w-col-*` / `max-w-col-*` / `min-w-col-*` up to 16), driven by `--canvas-margin`/`--canvas-gutter` instead of `--col-size`. Only one file in the codebase used these utilities directly (`ui/components/archive/Feed.tsx`, `max-w-col-10`), so the blast radius of dropping the old plugin was small and confirmed working.

## `src/ui/globals.scss` — new design system

Previously:
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities { .no-scrollbar { ... } }
html { scroll-behavior: smooth; }
.no-transition * { ... }
```

Now starts with `@import "tailwindcss";` (v4's replacement for the three `@tailwind` directives), followed by the full new design system pasted in by request:
- A large `:root` block of raw CSS custom properties (colors in `oklch()`, spacing, typography, component tokens like `--button-fill`, `--info-card-border`, etc.), plus responsive overrides at `768px`/`1080px`/`1440px`.
- A `@theme` block mapping a subset of those into Tailwind's theme namespaces (`--color-*`, `--border-*`, `--breakpoint-*`, `--spacing-*`, `--width-col-*`, `--radius-*`) so Tailwind generates matching utilities (`bg-primary`, `text-hyperlink`, `w-col-4`, `rounded-lg`, etc.).
- Full component CSS: `.button`, `.badge`, `.info-card`, `.clicky-card`, `.comparison-card`, `.checkbox`, `.radio`, `.usp`, `.accordion`, `.nav-bar`, `.modal`, heading/body/label typography classes (`.heading-2xl`, `.body-md`, `.label-lg`, ...), and a `.stack` margin-collapsing spacing system using `@property --stack-before/--stack-after/--stack-prev-after`.
- Three theme variants: `[data-theme='light-secondary']`, `[data-theme='accent']`, `[data-theme='overlay']`, each overriding the same set of CSS custom properties.
- The original `@layer utilities { .no-scrollbar {...} }`, `html { scroll-behavior: smooth; }`, and `.no-transition * {...}` rules were kept, appended at the end.

### Two things added on top of the pasted config (not in the original paste)

**1. Default Tailwind breakpoints preserved alongside the new ones.**

The pasted `@theme` only defined:
```css
--breakpoint-tablet: 768px;
--breakpoint-laptop: 1080px;
--breakpoint-desktop: 1440px;
```

In Tailwind v4, declaring your own `--breakpoint-*` keys **replaces** the framework's defaults rather than merging with them. 18 files across the codebase use the default `sm:`/`md:`/`lg:`/`xl:`/`2xl:` prefixes, so using the pasted config as-is would have silently broken all of their responsive behavior. Added back:

```css
--breakpoint-xs: 320px;
--breakpoint-sm: 390px;
--breakpoint-md: 720px;
--breakpoint-lg: 1080px;
--breakpoint-xl: 1440px;
--breakpoint-2xl: 1720px;
--breakpoint-3xl: 2000px;
```

These values match the old `tailwind.config.js`'s custom `screens` scale (not Tailwind's stock 640/768/1024/1280/1536 defaults) so existing responsive behavior is pixel-for-pixel unchanged, not just "still works at some breakpoint."

**2. A base `.container` rule.**

The pasted config only styles `.container.full`:
```css
.container {
  &.full {
    max-width: 90rem;
    padding: 0 var(--canvas-margin);
  }
}
```
It has no rule for bare `.container`. ~7 components use plain `className="container"` (no `.full`), relying on the old `theme.scss`'s `.container { @apply relative max-w-[var(--pagewidth)] mx-auto px-[var(--margin)]; }` for their width constraint. Added a base rule using the new system's own tokens so those keep working:
```css
.container {
  position: relative;
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: var(--canvas-margin);
}
```
This sits above the pasted `.container.full` rule in the file; `.container.full` naturally wins on specificity when both classes are applied, so the two compose as intended (constrained by default, wider with `.full`).

## `themes/default/theme.scss` — retired, mostly

This file is loaded as its own separate module (`src/lib/themeLoader.ts` dynamically `import()`s it per theme folder), so it's compiled outside the main `globals.scss` chain. Two consequences:

1. Its `@apply` calls need an explicit `@reference "../../src/ui/globals.scss";` at the top of the file to resolve Tailwind utilities at all — this was the immediate build error (`Cannot apply unknown utility class 'text-primary'`) that surfaced first.
2. Even with `@reference` added, most of its `@apply` calls used the **old** design system's tokens (`bg-dark`, `text-quaternary`, `text-heading-2xl`, `primary-dark`, plain `white`) — none of which exist in the new `@theme`. Beyond the token mismatch, `theme.scss` was restyling the exact same components (`button`/`.button`, headings, `.pill`, `.toggle-control`) that the newly-pasted config already styles natively, with entirely different colors and class structure — two competing systems for the same UI.

Per your direction, the new config now fully owns buttons, headings, pills, and toggle-control. `theme.scss` was stripped down to only the two things with no equivalent elsewhere: `.terminal` and `.break-out`, plus the required `@reference` line. Everything else (the `body`/`.wp-preview` base styles, `.container` `@apply` rule, `h1`–`h6`, `button`/`.pill`/`.toggle-control` variants, `::selection`, `.before-white`, `.after-inherit`, and the unused `--pagewidth`/`--margin`/`--container` custom properties) was deleted.

## Known gaps / follow-ups

- **Color semantics changed.** In the old config, `primary`/`secondary` were literal brand colors (RGB values driven by Figma variables). In the new config, `--color-primary`/`--color-secondary` are **text-color roles** (`var(--text-primary)`/`var(--text-secondary)`). Any component using `bg-primary`, `border-primary`, etc. will render differently now — this is an expected consequence of adopting the new design system, but wasn't individually audited component-by-component. Worth a visual pass.
- **No JS-level `safelist` equivalent.** If any class names (especially the old `max-w-col-*`/`gap-col-*` family, or others) are constructed dynamically from CMS/ACF data rather than appearing as static strings in JSX, Tailwind v4's automatic content scanning won't find them and they won't be generated. v4's equivalent mechanism is `@source inline("...")` in CSS — none were added since no concrete broken case was found, but this is the first place to look if a CMS-driven page is missing styling that works when hardcoded in JSX.
- **Component-level visual QA not done beyond a build/render smoke test.** Verification so far confirms: the app builds and renders (`200` responses, no console/CSS compile errors), the new design tokens and component CSS are present in the compiled output, breakpoints are preserved at their original pixel values, and `.container` still constrains width. It does **not** confirm every component looks correct against the new color/typography system — that needs an actual browser pass.
