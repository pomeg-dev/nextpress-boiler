# Nextpress boilerplate

Headless WordPress (Docker, `backend/`) + Next.js 15 App Router / Tailwind 4 / TS (`frontend/`).

## Read-only — never edit
- Nextpress PHP plugin (`backend/wordpress/wp-content/plugins/nextpress`).
- `@pomeg-dev/nextpress-client` (node_modules) and the generated `frontend/src/blocks.registry.generated.ts` (written by `npm run gen:registry` on predev/prebuild).

## Block pipeline
`frontend/themes/default/blocks/<name>/fields.json` → served raw by `/api/blocks` (no `_partials`/`$ref` resolution) → plugin registers ACF block `acf/default--<name>` → saved content returned by `/wp-json/nextpress/router/<path>` (`content[]`, each with `data`) → package BlockParser → registry → `blocks/<name>/index.tsx` → organism in `frontend/ui/components/organisms/default/`.
- Every block's `data` also carries `theme_override`, `padding_top`, `padding_bottom` from ACF group `group_69d607b467ad1` (`nextpress-theme/assets/acf-json`). Styled by `BlockWrapper.tsx`.
- Core blocks render from the package; site overrides live in `frontend/src/nextpress.blocks.ts`. Package resolves editor colours as `var(--color-<slug>)` (slugs from `nextpress-theme/theme.json`) — keep those token names.
- Tokens and colour themes (`[data-theme=…]`) live in `frontend/themes/default/theme.scss`; `src/ui/globals.css` maps them to Tailwind via `@theme inline`. Change values in theme.scss, never in `@theme`. A var redefined in a descendant doesn't reach utilities resolved higher up, so role vars are re-declared on every `[data-theme]`.
- Header/footer = Templates page flexible layouts (`/wp-admin/admin.php?page=templates`), delivered as settings `before_content`/`after_content`.
- Gravity Forms: a block field `gravity_form` makes the plugin inject `gfData`. The browser posts to `/wp-json/gf/v2/forms/<id>/submissions` (public; GF REST API enabled). The contact form is ID 1.
- Editor classes from `tiny_mce_before_init` in `nextpress-theme/functions.php` are in saved content. Never rename them (`text-teriary` typo is intentional).
- `.claude/docs/DESIGN_SYSTEM.md` and the `scaffold-block` skill describe another project (`style.css`, `bNN-` folders, `$ref` partials). Not true here; follow the existing blocks.

## Commands (run in `frontend/`)
- Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`. tsc + lint pass on baseline.
- Dev and build share `.next`: stop the dev server before `npm run build`. `Cannot find module './vendor-chunks/...'` = stale cache → `rm -rf .next`.
- Stop dev servers by PID only — never `pkill -f "next dev"` (kills other projects).
- Playwright MCP can only write inside the repo: screenshots go to `.playwright-mcp/`.

## WP-CLI
The `wpcli` compose service has no DB env. Copy it from the running container:
```sh
cd backend; for v in $(docker exec wordpress sh -c 'env | grep -E "^WORDPRESS_" | cut -d= -f1'); do export $v="$(docker exec wordpress printenv $v)"; done
docker compose run --rm -T -e WORDPRESS_DB_PASSWORD -e WORDPRESS_DB_HOST -e WORDPRESS_DB_USER -e WORDPRESS_DB_NAME -e WORDPRESS_TABLE_PREFIX wpcli wp <cmd>
```
Inspect content: `curl localhost/wp-json/nextpress/router/<path>`; menus/settings via `/wp-json/nextpress/...`.

## Open issues
Tracked in `.claude/docs/TODO.md`.
