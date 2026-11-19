---
name: scaffold-block
description: Scaffold a new default theme block (fields.json + index.tsx) and its presentational organism, following the existing blocks (e.g. stats, text-section). Use when the user asks to create/add a new block or component for the default theme.
---

# Scaffold a default block

A block = **two files** in `frontend/themes/default/blocks/<name>/`
(`fields.json` + `index.tsx`) plus **one organism** in
`frontend/ui/components/organisms/default/<Name>.tsx`. The block file is a thin
adapter: it reads the ACF data and passes it on. The organism renders inside
`BlockWrapper` and holds all the markup.

`stats` is the reference block: copy its shape.

## 1. Gather inputs (ask the user if missing)

- **Kebab name**: the folder, e.g. `feature-list`. It becomes the block name
  `acf/default--feature-list`. Never rename an existing block later: saved
  content refers to it by name.
- **Fields**: the ACF fields the editor needs (id + type each).
- **Shared partials**: reuse `buttons` or `text-card` via `{ "$ref": "<name>" }`?

Derive names:
- block export: `<PascalName>Block` (e.g. `FeatureListBlock`)
- organism file + component: `<PascalName>.tsx` / `<PascalName>`

## 2. `fields.json`: an array of ACF fields

A top-level JSON array of `{ "id", "type", ... }` objects. `/api/blocks` serves
it to the plugin, which registers the ACF block.

| type | extra keys |
|---|---|
| `text` / `textarea` | `default_value`, `instructions` |
| `wysiwyg` | `default_value` (HTML string) |
| `image` / `link` | none |
| `number` | `min`, `max`, `default_value` |
| `select` | `choices`: array of `{ "value": "Label" }` objects; `default_value` |
| `true_false` | `ui: 1`, `default_value: 1` |
| `repeater` | `layout: "block"`, `fields`: nested field array, optional `min` |

Partials: `{ "$ref": "buttons" }` inlines `themes/default/_partials/buttons.json`
(repeater `buttons` of `{ link, style, min_width, clicky }`). Check `_partials/`
for the current list.

Do **not** add `theme_override`, `padding_top` or `padding_bottom`: every block
gets them from the Block Settings ACF group. Most blocks also have their own
`top_spacer`/`bottom_spacer` selects (copy them from `stats/fields.json`).

```json
[
  { "id": "content", "type": "wysiwyg" },
  {
    "id": "items",
    "type": "repeater",
    "layout": "block",
    "fields": [{ "id": "label", "type": "text" }]
  },
  { "$ref": "buttons" },
  {
    "id": "top_spacer",
    "type": "select",
    "choices": [{ "xl": "Large" }, { "lg": "Medium" }, { "md": "Small" }, { "0": "None" }],
    "default_value": "xl"
  },
  {
    "id": "bottom_spacer",
    "type": "select",
    "choices": [{ "xl": "Large" }, { "lg": "Medium" }, { "md": "Small" }, { "0": "None" }],
    "default_value": "xl"
  }
]
```

## 3. `index.tsx`: block adapter

The package block parser uses the module's default export, or else its first
named export. Pass `getBlockOptions(props.data)` for the Block Settings fields.
The className is always `custom-block <name>`.

```tsx
"use client";

import FeatureList from "@ui/components/organisms/default/FeatureList";
import classNames from "classnames";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function FeatureListBlock(props: any) {
  const { content, items, buttons, top_spacer, bottom_spacer } = props.data;

  return (
    <FeatureList
      content={content}
      items={items}
      buttons={buttons}
      top_spacer={top_spacer}
      bottom_spacer={bottom_spacer}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block feature-list", props.className)}
      id={props.id}
    />
  );
}
```

## 4. Organism: `<Name>.tsx`

A typed presentational component with a default export and no data fetching.

- Wrap everything in `BlockWrapper`. It sets `data-theme` and the Block Settings
  padding. `ownSpacing(top_spacer, blockOptions?.padding_top)` gives the block's
  own spacer, unless Block Settings sets that side.
- Return `null` (or nothing inside the wrapper) when required data is empty.
- Render `wysiwyg` strings with `Parser` from `html-react-parser`.
- Add `"use client"` only if it is interactive (state, effects, handlers).
- Buttons: `Button` from `@ui/components/atoms/Button`, e.g.
  `<Button linkItem={b.link} style={b.style} size="md" />`.

```tsx
import React from "react";
import Parser from "html-react-parser";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type FeatureListProps = {
  content?: string;
  items?: { label?: string }[];
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

const FeatureList: React.FC<FeatureListProps> = ({
  content,
  items,
  top_spacer = "xl",
  bottom_spacer = "xl",
  blockOptions,
  className,
  id,
}) => {
  if (!items?.length) return null;

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{
        paddingTop: ownSpacing(top_spacer, blockOptions?.padding_top),
        paddingBottom: ownSpacing(bottom_spacer, blockOptions?.padding_bottom),
      }}
    >
      <div className="container">
        {content && <div className="flow measure">{Parser(content)}</div>}
        <ul className="mt-md grid grid-cols-1 gap-sm md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={i} className="border-t border-rule pt-xs">{item.label}</li>
          ))}
        </ul>
      </div>
    </BlockWrapper>
  );
};

export default FeatureList;
```

## 5. Styling

Read `DESIGN.md` (repo root) before styling. It is the source of truth for the
palette, type scale, themes, spacing and component rules. In short:

- Layout: `.container`, `.flow` (vertical rhythm), `.measure`, the 12-column
  grid. Spacing utilities use the named scale: `p-md`, `gap-sm`, `py-section`.
- Type: the `.heading-3xl … xs`, `.body-lg/.body/.body-sm` and `.label`
  classes, or the `text-heading-*` utilities.
- Colour: role utilities only (`bg-surface`, `bg-surface-raised`, `text-fg`,
  `text-muted`, `border-rule`, `text-accent`). They follow the block's
  `data-theme`, so never hard-code a palette colour on a themed surface.
- Breakpoints: mobile-first, `md:` 720px and `lg:` 1080px (`xl:` 1440px).
  Component CSS in `theme.scss` uses the same widths (45rem / 67.5rem).
- New component CSS goes in `themes/default/theme.scss`, using tokens.
  Never change values in the `@theme` blocks of `src/ui/globals.css`.

## 6. Register and check

1. Run `npm run gen:registry` in `frontend/` (predev/prebuild also run it).
   Never edit `src/blocks.registry.generated.ts` by hand.
2. Delete the plugin's block-list transients (`nextpress_blocks_next_blocks_*`)
   with WP-CLI (see CLAUDE.md). Until you do, the editor shows the old block list
   and new blocks return only the 3 Block Settings keys.
3. Add the block to a page in wp-admin, or to `backend/seed/content.mjs` for the
   demo site, then check `curl localhost/wp-json/nextpress/router/<path>`.
4. Look at it at 390, 720, 1080 and 1440px in each theme it can take.
5. `npx tsc --noEmit` and `npm run lint` in `frontend/`.

## Checklist

1. [ ] `fields.json`: field array; partials via `$ref`; no Block Settings fields.
2. [ ] `index.tsx`: `<Name>Block`, passes `getBlockOptions(props.data)`,
       className `custom-block <name>`.
3. [ ] Organism: typed, default export, inside `BlockWrapper`, renders every
       field, `"use client"` only if interactive.
4. [ ] Styling follows DESIGN.md: role colours, named spacing, `md`/`lg`.
5. [ ] Registry regenerated, transients cleared, rendered and checked.
