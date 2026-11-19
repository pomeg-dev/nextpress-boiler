# Flagged for later

Items found during the redesign that are out of scope or need a decision. Newest at the bottom of each section.

## Security
- [x] Figma vars removed from `frontend/.env.sample` (Figma API no longer used). The old token is still in git history (a2681581): revoke it in Figma.

## Licensing
- [x] Unused trial/commercial fonts in `frontend/public/fonts` deleted (2026-11-19).

## Code hygiene (needs approval — PHP or out of scope)
- [x] `nextpress-theme/functions.php` debug `error_log` calls removed (1052dd48).
- [x] `category-archive.tsx` lists every term (Glion slug filter removed). Untested in the browser: tax routes need a WordPress posts page (`page_for_posts_slug`), and this site has none.
- [x] `_partials/*.json` are resolved again (`$ref`, nextpress-client 0.4.3).
- [x] Unused `src/lib/themeLoader.ts` deleted.
- [x] `ui/components/archive/Feed.tsx` stray `console.log(data)` removed (phase 5 restyle).
- [x] Post cards: the title links to the post and stretches over the card (`.post-card-link`); buttons sit above it. Fixes the archive's nested `<a>` and gives featured-posts cards a post link (approved 2026-11-19).
- [x] Skip link added in `app/layout.tsx` once nextpress-client 0.4.2 gave `<main>` the id `main`.
- [x] Legacy Tailwind colour aliases (`primary-dark`, `quaternary`, `dark`, `smoke`) and BlockWrapper's `"mission"` theme fallback removed (unused in code and saved content, 2026-11-19).
- [x] theme.scss component media queries now use the Tailwind md/lg widths (45rem/67.5rem) instead of 48rem/64rem (2026-11-19).

## Security / privacy
- [x] Plugin `ext-gravityforms.php` no longer sends GF `notifications` (recipient emails, routing) in `gfData`/`*_data` or from `/wp-json/nextpress/form/<id>` (`get_public_form()`, plugin edit approved for this fix, 2026-11-19). Uncommitted in the plugin repo.

## Content (user's wp-admin)
- [x] GF form 1 "Project Type" choices set to New website / Redesign / Design system / Something else (one-off WP-CLI, 2026-11-19; the seed still never edits forms).
- [x] `.claude/docs/DESIGN_SYSTEM.md` (another project's structure) deleted; DESIGN.md replaces it. `scaffold-block` skill rewritten for this repo (2026-11-19).
- [x] `next lint` replaced by the ESLint CLI: ESLint 9, eslint-config-next 15.5.26, flat `eslint.config.mjs`, script `eslint .` (2026-11-19). It now also lints `ui/` and `themes/`, which `next lint` skipped; 3 missing display names fixed.
- [x] The 7 lint warnings in `ui/` fixed (2026-11-19, approved). Archive feed: `Feed` reads page/search/filters from the URL as initial state (the child effects are gone), which also fixes `?page=2` → Next going to page 21, the select ignoring `?filter_*`, and Next showing on the last page. `CookieManager`: a returning visitor's stored consent now reaches GTM (it was always sent as denied). `ToggleControl` derives its lists from props. `Modal` keeps `<img>` (unknown dimensions) with a reasoned disable. Tested on a temporary posts page, deleted afterwards; GTM runs in production only, so the consent change is untested in the browser.

## Environment
- [x] WordPress auto-updated core 7.1.4 → 7.1.5 when Docker started; committed (cb20c20f). Core auto-updates are still on, so this can recur.
- [x] Compose `wpcli` shares the `wordpress` DB env (YAML anchor); obsolete `version` removed. The seed and CLAUDE.md no longer copy env from the container (2026-11-19).
- [x] Public site URL: `frontendUrl` in `nextpress.config.ts` reads `NEXT_PUBLIC_SITE_URL` (2026-11-19), so canonical/og:url are absolute. WordPress `frontend_url` stays empty: the plugin uses it for its server-side `/api/blocks` fetch, which fails inside Docker. Optional plugin change: keep separate internal and public URLs.
- [x] Core image `sizes`: nextpress-client 0.5.0 `coreBlocks.imageSizes`, set in `nextpress.config.ts` to the page container (every alignment renders there; the theme has no alignwide/alignfull styles). Checked on a temp page at 390/1280/1920, deleted afterwards (2026-11-19).
- [x] Package core image falls back to 800×600 when the saved `<img>` has no dimensions (wrong reserved ratio → CLS; resized images get e.g. 400×600 and a Next warning). Fixed in nextpress-client 0.6.0, which reads `naturalWidth`/`naturalHeight` from the plugin. The boiler is bumped to 0.6.0.
  - [ ] Push the plugin branch `feat/core-image-natural-dimensions` (38de144) and open its PR. Until it is deployed, images without dimensions keep the 800×600 ratio.
- [x] Confirm the "Disable REST API" plugin lets anonymous `gf/v2` submissions through. (Yes, after the GF REST API was enabled in wp-admin.)
- [x] Unused `@react-three/fiber` and `@react-three/drei` removed (approved 2026-11-19).
