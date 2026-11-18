# Flagged for later

Items found during the redesign that are out of scope or need a decision. Newest at the bottom of each section.

## Security
- [ ] `frontend/.env.sample` commits a real-looking Figma token (`FIGMA_ACCESS_TOKEN=figd_...`). Rotate it and blank the sample value.

## Licensing
- [ ] `frontend/public/fonts` holds trial/commercial fonts (TT Ramillas Trial, PP Neue Montreal, HelveticaNowDisplay, F37 Caslon, TT Firs, Paralex). Not used by the redesign; confirm licences or remove.

## Code hygiene (needs approval — PHP or out of scope)
- [x] `nextpress-theme/functions.php` debug `error_log` calls removed (1052dd48).
- [ ] `frontend/src/ui/category-archive.tsx` hardcodes Glion term slugs.
- [ ] `frontend/themes/default/_partials/*.json` are not loaded by anything (`/api/blocks` serves raw JSON).
- [ ] `frontend/src/lib/themeLoader.ts` is unused.
- [x] `ui/components/archive/Feed.tsx` stray `console.log(data)` removed (phase 5 restyle).
- [ ] `archive/PostsList.tsx` wraps `PostCard` in a `<Link>`, and PostCard can contain button links → nested `<a>` (invalid HTML, hydration warning) when a post has `acf_data.link`/`download`. Fixing it changes archive-feed markup behaviour: needs approval.
- [ ] `PostCard` in featured-posts has no link to the post itself (only `acf_data.link`). Left as is.
- [ ] `.claude/docs/DESIGN_SYSTEM.md` and `.claude/skills/scaffold-block` describe another project's structure. Rewrite once the new design system lands.
- [ ] `next lint` is deprecated (Next 16 removes it). Migrate to the ESLint CLI.

## Environment
- [ ] `backend` compose `wpcli` service has no DB env vars; compose `version` attribute is obsolete. (Docker config is off-limits in this task.)
- [ ] WordPress `frontend_url` setting is empty, which logs a console warning on every page.
- [ ] The package's core image renderer hardcodes `sizes`. Read-only; raise with package owners if it costs performance.
- [x] Confirm the "Disable REST API" plugin lets anonymous `gf/v2` submissions through. (Yes, after the GF REST API was enabled in wp-admin.)
- [ ] `@react-three/fiber` and `@react-three/drei` are dependencies but nothing imports them. Remove them to cut install size (needs approval: dependency change).
