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
- [ ] `archive/PostsList.tsx` wraps `PostCard` in a `<Link>`, and PostCard can contain button links → nested `<a>` (invalid HTML, hydration warning) when a post has `acf_data.link`/`download`. Fixing it changes archive-feed markup behaviour: needs approval.
- [x] Skip link added in `app/layout.tsx` once nextpress-client 0.4.2 gave `<main>` the id `main`.
- [ ] `PostCard` in featured-posts has no link to the post itself (only `acf_data.link`). Left as is.
- [ ] Legacy leftovers outside the new system: Tailwind colour aliases (`primary-dark`, `quaternary`, `dark`, `smoke`) and BlockWrapper's `"mission"` theme fallback. Remove once no saved content uses them.
- [ ] Some component CSS in theme.scss uses raw `48rem`/`64rem` media queries instead of the Tailwind screens (md 720, lg 1080).

## Security / privacy
- [ ] Plugin `ext-gravityforms.php` injects the full `GFAPI::get_form()` as `gfData` into public router JSON, including `notifications` (recipient emails, routing). Plugin is read-only: needs a decision (strip in plugin, or filter server-side).

## Content (user's wp-admin)
- [x] GF form 1 "Project Type" choices set to New website / Redesign / Design system / Something else (one-off WP-CLI, 2026-11-19; the seed still never edits forms).
- [ ] `.claude/docs/DESIGN_SYSTEM.md` and `.claude/skills/scaffold-block` describe another project's structure. Rewrite once the new design system lands.
- [ ] `next lint` is deprecated (Next 16 removes it). Migrate to the ESLint CLI.

## Environment
- [x] WordPress auto-updated core 7.1.4 → 7.1.5 when Docker started; committed (cb20c20f). Core auto-updates are still on, so this can recur.
- [ ] `backend` compose `wpcli` service has no DB env vars; compose `version` attribute is obsolete. (Docker config is off-limits in this task.)
- [x] Public site URL: `frontendUrl` in `nextpress.config.ts` reads `NEXT_PUBLIC_SITE_URL` (2026-11-19), so canonical/og:url are absolute. WordPress `frontend_url` stays empty: the plugin uses it for its server-side `/api/blocks` fetch, which fails inside Docker. Optional plugin change: keep separate internal and public URLs.
- [ ] The package's core image renderer hardcodes `sizes`. Read-only; raise with package owners if it costs performance.
- [x] Confirm the "Disable REST API" plugin lets anonymous `gf/v2` submissions through. (Yes, after the GF REST API was enabled in wp-admin.)
- [x] Unused `@react-three/fiber` and `@react-three/drei` removed (approved 2026-11-19).
