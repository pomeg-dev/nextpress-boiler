# Design System — Usage Guide (Tailwind v4)

How to build with the design system delivered in [`src/ui/style.css`](src/ui/style.css).

> **If you're coming from our old Tailwind 3 setup:** the big change is that you
> no longer hand-author utilities like `text-heading-2xl` in a config. Now there
> are **two kinds of styling primitives**:
>
> 1. **Utilities** generated from `@theme` tokens — colors, spacing, radius,
>    breakpoints (`bg-page`, `p-md`, `rounded-lg`, `tablet:` …).
> 2. **Semantic classes** authored as plain CSS — typography (`heading-2xl`,
>    `body-md`) and components (`button`, `info-card`, `accordion` …).
>
> Typography and components are **classes you apply**, not `text-*`/`bg-*`
> utilities you compose. That's the main thing to unlearn.

---

## 1. How it's wired

```
src/ui/globals.css        ← the entry (imported once in app/layout.tsx)
  ├─ @import "tailwindcss"     // v4 engine
  ├─ @import "./style.css"     // the design system (below)
  └─ a few global utilities (.no-scrollbar, no-transition, smooth scroll)

src/ui/style.css          ← the delivered design system
  ├─ :root { … }              // raw + semantic CSS-variable tokens
  ├─ @theme { … }             // exposes SOME tokens as Tailwind utilities
  ├─ .button / .info-card / … // component classes (plain CSS)
  ├─ .heading-* / .body-* / … // typography classes
  ├─ .stack { … }             // vertical-rhythm layout primitive
  └─ [data-theme='…'] { … }   // theme variants (accent / overlay / …)
```

`tailwind.config.js` from the v3 era is **inert** — v4 does not auto-load it, and
we don't reference it with `@config`. The token source of truth is `style.css`.

---

## 2. The three-layer token model

```
raw tokens            --optimisic-yellow-500, --black-700, --paper-white   (the palette)
   ↓ referenced by
semantic tokens       --text-primary, --button-fill, --divider-subtle      (roles)
   ↓ exposed by @theme as
utilities             text-primary, bg-page, border-…                       (what you type)
```

Component classes consume the **semantic** tokens. Theme variants
(`data-theme="accent"`) work by **remapping the semantic tokens** — which is why
swapping a theme restyles every component underneath it for free.

---

## 3. Color utilities (`@theme --color-*`)

These generate the usual `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*` utilities.

| Utility token | Meaning |
|---|---|
| `page` | Page/surface background (`bg-page`) |
| `paper-white` | Core light surface |
| `optimisic-yellow` | Brand yellow *(spelled as shipped — note the missing "t")* |
| `black` | Brand black |
| `utility-red` | Error/destructive red |
| `primary` | **Primary text color** (≈ black) |
| `secondary` | Secondary text color |
| `subtle` | Muted text color |
| `hyperlink` | Link color |
| `error` | Error text color |

```html
<div class="bg-page text-primary">…</div>
<p class="text-secondary">Muted-ish copy</p>
<a class="text-hyperlink">A link</a>
```

> ⚠️ **`primary` is a TEXT role, not a brand fill.** Unlike TW3 where `bg-primary`
> was your brand blue, here `--color-primary` maps to the primary *text* color
> (black). For **backgrounds** use `bg-page`, `bg-paper-white`,
> `bg-optimisic-yellow`, or `bg-black`.

**Opacity modifiers** work (v4 uses `color-mix`): `bg-optimisic-yellow/10`,
`border-primary/25`, `text-primary/50`.

**Numbered shades** (`--optimisic-yellow-500`, `--black-700`, `--paper-white-300`)
are **raw CSS vars, not utilities** — only the base colors are in `@theme`. Use
them with arbitrary values or an opacity modifier:

```html
<div class="bg-(--optimisic-yellow-500)">…</div>   <!-- v4 CSS-var shorthand -->
<div class="bg-optimisic-yellow/50">…</div>         <!-- often the cleaner intent -->
```

> **v4 shorthand:** `bg-(--token)` is the canonical short form of
> `bg-[var(--token)]` — use it for any `--var`-backed arbitrary value
> (`w-(--width-col-3)`, `border-(--border-strong)`, …).

---

## 4. Spacing utilities (`@theme --spacing-*`)

The named spacing scale feeds **every** spacing utility (`p-*`, `m-*`, `gap-*`,
`w-*`, `h-*`, `inset-*`, `space-*`, …). All values are responsive — they change at
the breakpoints automatically (see the `@media` blocks in `style.css`).

| Token | Example | Notes |
|---|---|---|
| `section` | `py-section` | Section rhythm (5→7.5rem) |
| `section-sm` | `py-section-sm` | Slim section |
| `section-none` | `py-section-none` | 0 |
| `xl` `lg` `md` `sm` `xs` | `gap-md`, `p-lg`, `mt-xs` | General scale |
| `nav` | `pt-nav` | Nav offset |
| `canvas-margin` | `px-canvas-margin` | Page side margin |
| `canvas-gutter` | `gap-canvas-gutter` | Grid gutter |

```html
<section class="py-section px-canvas-margin">
  <div class="flex gap-md">…</div>
</section>
```

---

## 5. Radius utilities (`@theme --radius-*`)

`rounded-sm` (0.375rem) · `rounded-md` (0.75rem) · `rounded-lg` (1.25rem) · `rounded-xl` (2rem).
These override the v4 defaults for those names.

---

## 6. Breakpoints (`@theme --breakpoint-*`)

Mobile-first. Base styles target the smallest screen; prefix to step up.

| Prefix | Min width |
|---|---|
| `tablet:` | 768px |
| `laptop:` | 1080px |
| `desktop:` | 1440px |

```html
<div class="flex-col tablet:flex-row laptop:gap-lg">…</div>
```

> ⚠️ These are **not** the old `sm/md/lg` (390/720/1080). The v4 default
> `sm/md/lg` still technically exist, but **use `tablet/laptop/desktop`** — that's
> the design-system contract.

---

## 7. Typography — classes, not utilities

There is **no `text-heading-2xl`**. Apply a semantic class, or just use the
matching HTML tag (tags are pre-styled).

| Class | Tag equivalent | Family |
|---|---|---|
| `heading-2xl` | `<h1>` | Barlow Condensed, UPPERCASE |
| `heading-xl` | `<h2>` | ″ |
| `heading-lg` | `<h3>` | ″ |
| `heading-md` | `<h4>` | ″ |
| `heading-sm` | `<h5>` | ″ |
| `heading-xs` | `<h6>` | ″ |
| `body-xl` / `body-lg` / `body-md` / `body-sm` | `<p>` = `body-md` | Hanken Grotesk |
| `label-xl` / `label-lg` / `label-md` / `label-sm` | — | Barlow Condensed |

```html
<h1>Already styled as heading-2xl</h1>
<p class="body-lg">Lead paragraph</p>
<span class="label-md">FORM LABEL</span>
<p>Body copy with <strong>bold</strong> via &lt;strong&gt; or <span class="strong">.strong</span>.</p>
```

Each typography class also declares a `--stack-after` so it spaces itself
correctly inside a `.stack` (see §9).

---

## 8. Components — classes + modifiers

Apply the base class, then space-separated modifier classes. Children use
descendant classes (`.svg`, `.banner`, `.answer`, …) as defined in `style.css`.

| Component | Base | Common modifiers |
|---|---|---|
| Button | `button` | `secondary`, `clicky` (+ `secondary`/`tertiary`/`disabled`), `destructive`, `min-width` |
| Button groups | `button-group`, `toggle-group` | — |
| Info card | `info-card` | `is-interactive` (+ `in-view`), `sm`; child `.svg` |
| Card layouts | `mini-card-grid`, `card-group`, `card-list`, `card-grid`, `card-flex` | — |
| Clicky card | `clicky-card` | `selected`, `logo-card`; child `svg`/`.svg` |
| Carousel | `carousel-rail` | child `.embla-slide.not-in-view` |
| Field | `field` | `error`; `::placeholder` styled |
| Field group | `field-group` | — |
| Comparison card | `comparison-card` | `main-offer`; children `.banner`/`.usp-group`/`.header` |
| Badge | `badge` | `warning`; group `badge-group` |
| Checkbox / Radio | `checkbox` / `radio` | `disabled`; native `:checked`/`:hover` |
| USP | `usp` | `neutral`; children `.icon-circle`/`.label`; group `usp-group` |
| Accordion | `accordion` | child `.answer`; group `accordion-group` |
| Marquee | `marquee` | — |
| Nav bar | `nav-bar` | `is-cta`, `hidden` |
| Modal | `modal` | `lg`, `sm`; `::backdrop` styled |
| Container | `container` | `full` |
| Misc | `page`, `logo` | — |

```html
<button class="button clicky secondary">Save</button>

<article class="info-card is-interactive">
  <div class="svg">…</div>
  <h4>Title</h4>
</article>

<details class="accordion">
  <summary>Question</summary>
  <div class="answer">Answer</div>
</details>
```

---

## 9. `.stack` — vertical rhythm (replaces `space-y-*` / manual `mb-*`)

Add `stack` to a container and its **direct children** get vertical spacing
automatically. The gap between two siblings is
`max(previous element's --stack-after, next element's --stack-before)` — so a
heading followed by a paragraph gets the heading's designed spacing without you
picking a number.

```html
<div class="stack">
  <h2>Heading</h2>        <!-- contributes its --stack-after -->
  <p>Paragraph…</p>       <!-- contributes its --stack-before -->
  <div class="card-group">…</div>
  <button class="button">CTA</button>
</div>
```

Prefer `.stack` over `space-y-*`/`gap` for editorial/content flows — it keeps the
designed rhythm. Use `flex gap-*` for evenly-spaced UI rows.

---

## 10. Theming (`data-theme` variants)

The root is the default (light) theme. Wrap any subtree to switch the **semantic
token palette** — every component inside restyles automatically.

| Variant | Effect |
|---|---|
| *(root)* | Default light (paper-white surface) |
| `light-secondary` | Light, yellow-tinted surface |
| `accent` | Yellow surface |
| `overlay` | Dark surface (black bg, light text) |

Apply via attribute or class:

```html
<section data-theme="overlay">… dark themed …</section>
<div class="accent">… yellow themed …</div>
```

`app/layout.tsx` already sets `data-theme` on `<html>` from WordPress settings, so
the page default comes from the CMS; nest a wrapper to override a region.

---

## 11. TW3 → new system cheat sheet

| Old (TW3) | New |
|---|---|
| `text-heading-2xl` | class `heading-2xl` (or `<h1>`) |
| `text-card-lg` etc. | the `heading-*` / `body-*` / `label-*` class set |
| `text-primary` | `text-primary` ✅ (now oklch black, semantic) |
| `bg-primary` (brand fill) | `bg-page` / `bg-paper-white` / `bg-optimisic-yellow` / `bg-black` |
| `bg-primary/10` | `bg-optimisic-yellow/10` (opacity modifiers still work) |
| custom `sm/md/lg` (390/720/1080) | `tablet:` / `laptop:` / `desktop:` (768/1080/1440) |
| `p-md`, `gap-lg` (custom spacing) | same idea — `p-md`, `gap-lg` (from `--spacing-*`) |
| `rounded-md` (custom radius) | `rounded-sm/md/lg/xl` (from `--radius-*`) |
| `max-w-col-14`, `w-col-*` | column tokens — see Gotchas (§12) |
| `grid-cols-16/18/…/24` | removed; not part of the new system |
| editing `tailwind.config.js` | edit `style.css` (`@theme` + `:root`) |

---

## 12. Gotchas / to verify

- **`bg-primary` is black**, not a brand fill — see §3.
- **Color shades aren't utilities** — `bg-(--optimisic-yellow-500)` or
  `bg-optimisic-yellow/<opacity>`.
- **Column widths:** `w-col-1` … `w-col-16` **work** — the `w-*` utility reads the
  `--width-*` namespace, so `--width-col-N` from `@theme` resolves. Note
  `max-w-col-*` and `min-w-col-*` do **not** (they read different namespaces) —
  for those use `max-w-(--width-col-3)`.
- **Border role colors (`--border-subtle/strong/accent`):** these are **not**
  border-color utilities (border color reads `--border-color`/`--color`, not the
  bare `--border-*` namespace). Use the CSS-var form:
  `border-(--border-strong)`.
- **Removed old utilities:** `text-heading-*`, `max-w-col-*`, `grid-cols-16..24`,
  and the old `xs/sm/md/lg/xl` screens no longer exist (the v3 config is inert).
- **Tree-shaking:** utilities from `@theme` are only emitted when used in source,
  so an unused token won't appear in the output CSS — that's expected, not a bug.

---

## 13. Extending the system

`style.css` is **generated from the Figma export tool** — prefer changing tokens
at the source and re-exporting over hand-editing. For one-off additions:

- New **token/utility** → add a `--…` under `@theme` in `style.css`.
- New **component class** → add plain CSS after the `@theme` block.
- **App-level CSS** (animations, helpers not from Figma) → put it in `globals.css`,
  **not** the generated `style.css` (a re-export would wipe it). Example — the
  marquee animation: `@theme { --animate-marquee: marquee 28s linear infinite; }`
  + a `@keyframes marquee`, which gives the `animate-marquee` utility.
- Keep `globals.css` as the single entry; don't import `style.css` elsewhere.

> ⚠️ **Re-export caveat (important).** The export emits *self-referential* spacing
> & radius theme tokens — `@theme { --spacing-lg: var(--spacing-lg); }` next to
> `:root { --spacing-lg: 3rem; }` — a CSS-variable cycle that makes
> `p-lg`/`gap-md`/`rounded-lg`/etc. resolve to nothing. The repo works around it by
> renaming the **raw runtime** tokens (defs, refs, and `@media` overrides) to
> `--ds-spacing-*` / `--ds-radius-*`, leaving the `@theme` keys as `--spacing-*` /
> `--radius-*` pointing at them (utility names unchanged). **Re-apply this rename
> after every re-export** — or, better, fix the export to emit non-colliding names.
