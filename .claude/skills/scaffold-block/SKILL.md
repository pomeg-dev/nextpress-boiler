---
name: scaffold-block
description: Scaffold a new default theme block (fields.json + index.tsx) and its presentational organism, following the b01–b03 pattern. Use when the user asks to create/add a new block or component for the default theme.
---

# Scaffold an default block

A block = **two files** in `frontend/themes/default/blocks/bNN-<name>/`
(`fields.json` + `index.tsx`) plus **one organism** in
`frontend/ui/components/organisms/default/<Name>.tsx`. The block file is a
thin adapter: it reads ACF data and renders the organism inside a `BlockWrapper`.
The organism is pure presentation.

## 1. Gather inputs (ask the user if missing)

- **Block number** — `bNN` (e.g. `b07`). Check the folder for the next free number.
- **Kebab name** — folder slug, e.g. `feature-list` → folder `b07-feature-list`.
- **Human title** — for reference only.
- **Fields** — the ACF fields the editor needs (id + type each).
- **Inner blocks?** — does it nest other blocks? (use the inner-blocks variant)
- **Shared partials** — reuse any of `buttons`, `text-card` via `{ "$ref": "<id>" }`?

Derive names:
- folder: `bNN-kebab-name`
- block export: `<PascalName>Block` (e.g. `FeatureListBlock`)
- organism file + component: `<PascalName>.tsx` / `<PascalName>`

## 2. File locations

```
frontend/themes/default/blocks/bNN-<name>/fields.json
frontend/themes/default/blocks/bNN-<name>/index.tsx
frontend/ui/components/organisms/default/<Name>.tsx
```

Import aliases:
- organism: `@ui/components/organisms/default/<Name>`
- wrapper:  `@ui/components/organisms/default/BlockWrapper`
- block parser: `{ BlockParser }` from `@/ui/block-parser`

## 3. `fields.json` — ACF field-schema ARRAY

A top-level JSON array of field objects, each `{ "id", "type", ... }`. Pull shared
partials with `{ "$ref": "<partial-id>" }` (resolves to
`frontend/themes/default/_partials/<id>.json`).

Field types and their extra keys:

| type | extra keys |
|---|---|
| `text` / `textarea` | `default_value` (optional) |
| `wysiwyg` | `default_value` (HTML string, optional) |
| `image` | — |
| `link` | — |
| `select` | `choices`: array of `{ "value": "Label" }` objects; `default_value` |
| `true_false` | `ui: 1`, `default_value: 1` |
| `repeater` | `layout: "block"`, `fields`: nested array of field objects |
| `inner_blocks` | `choices`: e.g. `[{ "all": "Show All" }]`; optional `conditional_logic` |

`{ "$ref": "buttons" }` → repeater of `{ link, style, min_width, clicky }`
(field id `buttons`). `{ "$ref": "text-card" }` → repeater `text_card_items` of
`{ size, content }`. Check `_partials/` for the current list.

Template:

```json
[
  { "id": "title", "type": "text" },
  {
    "id": "content",
    "type": "wysiwyg",
    "default_value": "<h2>Title</h2><p>Description</p>"
  },
  {
    "id": "variant",
    "type": "select",
    "choices": [
      { "default": "Default" },
      { "wide": "Wide" }
    ],
    "default_value": "default"
  },
  {
    "id": "items",
    "type": "repeater",
    "layout": "block",
    "fields": [
      { "id": "label", "type": "text" }
    ]
  },
  { "$ref": "buttons" }
]
```

Inner-blocks variant (add to the array; `conditional_logic` is optional):

```json
{
  "id": "inner_blocks",
  "type": "inner_blocks",
  "choices": [{ "all": "Show All" }],
  "conditional_logic": [
    [{ "field": "variant", "operator": "==", "value": "wide" }]
  ]
}
```

## 4. `index.tsx` — block adapter

Destructure `props.data` (ACF values keyed by field id) plus block options
`padding_top`, `padding_bottom`, `theme_override`. Wrap the organism in
`BlockWrapper`. className is always `"custom-block bNN-<name>"`.

```tsx
import <Name> from "@ui/components/organisms/default/<Name>";
import BlockWrapper from "@ui/components/organisms/default/BlockWrapper";
import classNames from "classnames";

export function <Name>Block(props: any) {
  const {
    title,
    content,
    variant,
    items,
    buttons,
    padding_top,
    padding_bottom,
    theme_override
  } = props.data;

  return (
    <BlockWrapper
      blockOptions={{ padding_bottom, padding_top, theme_override }}
      className={classNames("custom-block bNN-<name>", props.className)}
      id={props.id}
    >
      <<Name>
        title={title}
        content={content}
        variant={variant}
        items={items}
        buttons={buttons}
      />
    </BlockWrapper>
  );
}
```

Inner-blocks variant — also destructure `inner_blocks` and pass
`inner_blocks={inner_blocks && props?.innerBlocks}` to the organism (the schema
flag gates rendering; the resolved blocks live on `props.innerBlocks`):

```tsx
const { /* …, */ inner_blocks } = props.data;
// …
<<Name> /* … */ inner_blocks={inner_blocks && props?.innerBlocks} />
```

## 5. Organism — `<Name>.tsx`

Pure, typed presentational component. Default export. **No data fetching.**

- `React.FC<Props>` with a typed props object mirroring the fields you pass.
- **Early-return `null`** when required data is empty (e.g. `if (!items?.length) return null;`).
- Render `wysiwyg` strings with `HTMLReactParser(content)` from `html-react-parser`.
- Use **design-system classes** (see §6) — `.container`, `.stack`, typography
  classes, color/spacing utilities. Do **not** invent class names.
- Add `"use client"` at the top **only** if interactive (state, effects, handlers).
- For inner blocks: accept `inner_blocks?: Block[]` and render
  `<BlockParser blocks={inner_blocks} />`.

```tsx
import React from "react";
import HTMLReactParser from "html-react-parser";

type Item = { label?: string };

type <Name>Props = {
  title?: string;
  content?: string;
  variant?: "default" | "wide";
  items?: Item[];
};

const <Name>: React.FC<<Name>Props> = ({ title, content, variant, items }) => {
  if (!items?.length) return null;

  return (
    <div className="container text-primary stack">
      {title && <h2 className="heading-xl">{title}</h2>}
      {content && <div className="stack">{HTMLReactParser(content)}</div>}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-md">
        {items.map((item, i) => (
          <article key={i} className="info-card">
            {item.label}
          </article>
        ))}
      </div>
    </div>
  );
};

export default <Name>;
```

Inner-blocks variant — add the import and prop, render where appropriate:

```tsx
import { BlockParser } from "@/ui/block-parser";
import { Block } from "@/lib/types";
// props: inner_blocks?: Block[]
{inner_blocks && (
  <div className="inner-blocks">
    <BlockParser blocks={inner_blocks} />
  </div>
)}
```

For buttons, import `Button` from `@ui/components/atoms/Button` and map
`buttons` (typed `ButtonProps[]` from `@/lib/types`) inside a `.button-group`.

## 6. Design system — source of truth

**Read `.claude/docs/DESIGN_SYSTEM.md` before styling.** It lists every available
utility, semantic class, component class, and breakpoint. Use those — do not
invent classes. Quick reference:

- **Layout:** `.container` (page width), `.stack` (vertical rhythm — prefer over
  `space-y-*` for content flows), `w-col-1..16`.
- **Typography = classes, not utilities:** `heading-2xl…xs`, `body-xl…sm`,
  `label-xl…sm` (or just the matching HTML tag). There is **no** `text-heading-*`.
- **Color utilities:** `text-primary` (text role ≈ black, *not* a fill),
  `bg-page`, `bg-paper-white`, `bg-optimisic-yellow` (sic), `bg-black`. Opacity
  modifiers work: `bg-optimisic-yellow/10`.
- **Spacing:** `p-md`, `gap-lg`, `py-section`, `px-canvas-margin`, etc.
- **Radius:** `rounded-sm/md/lg/xl`. **Components:** `.button`, `.info-card`,
  `.accordion`, `.card-group`, `.badge`, `.usp`, … (see §8 of the guide).
- **Theming:** wrap a subtree with `data-theme="overlay|accent|light-secondary"`.

## 7. Conventions / gotchas

- **Mobile-first.** Base styles target the smallest screen; step up with
  breakpoints **`tablet:` / `laptop:` / `desktop:`** (768 / 1080 / 1440) — **not**
  `sm/md/lg`.
- **CSS-var arbitrary values:** use the v4 shorthand `bg-(--token)` /
  `w-(--width-col-3)` (= `[var(--token)]`). Color **shades** (`--optimisic-yellow-500`)
  are raw vars, not utilities.
- **Arbitrary values need `_` for spaces** inside brackets, e.g.
  `bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,...)]`.
- **`max-w-col-*` / `min-w-col-*` don't exist** — use `max-w-(--width-col-3)`.
  Border role colors use `border-(--border-strong)`.
- className on the block is always `custom-block bNN-<name>` (kebab folder name).

## 8. Checklist

1. [ ] `fields.json` created (array of field objects; partials via `$ref`).
2. [ ] `index.tsx` created (`<Name>Block`, destructures `props.data` + padding/theme,
       wraps organism in `BlockWrapper`, className `custom-block bNN-<name>`).
3. [ ] Organism `<Name>.tsx` created (typed `React.FC`, default export, early
       `return null`, `HTMLReactParser` for wysiwyg, `"use client"` only if interactive).
4. [ ] Imports wired (organism alias, `BlockWrapper`, `BlockParser`/`Button` as needed).
5. [ ] Inner blocks (if any): schema flag + `inner_blocks={inner_blocks && props?.innerBlocks}`
       + `<BlockParser>` in the organism.
6. [ ] Styling verified against `.claude/docs/DESIGN_SYSTEM.md` (no invented classes;
       `tablet/laptop/desktop` breakpoints; `.container`/`.stack`; mobile-first).
