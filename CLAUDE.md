# Nextpress boilerplate

Headless WordPress (Docker, `backend/`) + Next.js 15 App Router / Tailwind 4 / TS (`frontend/`).

## Read-only — never edit
- Nextpress PHP plugin (`backend/wordpress/wp-content/plugins/nextpress`).
- `@pomeg-dev/nextpress-client` (node_modules) and the generated `frontend/src/blocks.registry.generated.ts` (written by `npm run gen:registry` on predev/prebuild).

## Block pipeline
`frontend/themes/default/blocks/<name>/fields.json` → served by `/api/blocks` (inlines `{ "$ref": "<name>" }` entries from `themes/default/_partials/<name>.json`) → plugin registers ACF block `acf/default--<name>` → saved content returned by `/wp-json/nextpress/router/<path>` (`content[]`, each with `data`) → package BlockParser → registry → `blocks/<name>/index.tsx` → organism in `frontend/ui/components/organisms/default/`.
- Every block's `data` also carries `theme_override`, `padding_top`, `padding_bottom` from ACF group `group_69d607b467ad1` (`nextpress-theme/assets/acf-json`). Styled by `BlockWrapper.tsx`.
- Core blocks render from the package; site overrides live in `frontend/src/nextpress.blocks.ts`. Package resolves editor colours as `var(--color-<slug>)` (slugs from `nextpress-theme/theme.json`) — keep those token names.
- Design system rules: `DESIGN.md` (root; describes the shipped build, `.claude/docs/REDESIGN_PLAN.md` is the superseded plan). Tokens and colour themes (`[data-theme=…]`) live in `frontend/themes/default/theme.scss`; `src/ui/globals.css` maps them to Tailwind via `@theme inline`. Change values in theme.scss, never in `@theme`. A var redefined in a descendant doesn't reach utilities resolved higher up, so role vars are re-declared on every `[data-theme]`.
- Header/footer = Templates page flexible layouts (`/wp-admin/admin.php?page=templates`), delivered as settings `before_content`/`after_content`.
- Plugin caches the block list for 12h (`nextpress_blocks_next_blocks_*` transients) and router responses (`nextpress_router_*`). After you add a block or change a `fields.json`, delete these transients. Otherwise ACF blocks return only the 3 Block Settings keys. Stale block lists also come from a failed `/api/blocks` fetch: max 3 fetches per 30s, and after 3 failures a 300s circuit breaker (`nextpress_blocks_blocks_api_*`) blocks fetches. Keep option `frontend_url` empty in Docker dev, because the plugin uses it for that server-side fetch. The public URL comes from `NEXT_PUBLIC_SITE_URL` (config `frontendUrl`).
- The frontend also caches router data. After changing content outside wp-admin, call `GET /api/revalidate/?path=/<slug>/` (trailing slash required) with header `x-nextpress-revalidate-secret: HMAC-SHA256(NEXTPRESS_CLIENT_SECRET, "nextpress:revalidate:v1")`.
- Demo content: `backend/seed/seed-showcase.sh [--reset]` (idempotent; backs up what it overwrites; refreshes all the caches above). Needs the frontend on :3000.
- Gravity Forms: a block field `gravity_form` makes the plugin inject `gfData`. The browser posts to `/wp-json/gf/v2/forms/<id>/submissions` (public; GF REST API enabled). The contact form is ID 1.
- Editor classes from `tiny_mce_before_init` in `nextpress-theme/functions.php` are in saved content. Never rename them (`text-teriary` typo is intentional).

## Commands (run in `frontend/`)
- Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`. tsc + lint pass on baseline.
- Dev and build share `.next`: stop the dev server before `npm run build`. Check :3000 before starting a dev server; a second one (it falls back to :3001) corrupts the shared `.next`. `Cannot find module './vendor-chunks/...'` = stale cache → `rm -rf .next`.
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
