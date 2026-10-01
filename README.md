# Nextpress Boiler

An opinionated starting point for **Nextpress** — headless WordPress + Next.js. WordPress
(via the `nextpress` plugin) exposes Gutenberg blocks and content over the REST API; a
Next.js App Router frontend renders them.

- **Backend** — WordPress in Docker (MariaDB + phpMyAdmin + WP-CLI), managed by a Makefile.
- **Frontend** — Next.js 15 (App Router) + React 18 + TypeScript + Tailwind v4.
- **`nextpress` plugin** — the bridge between the two, tracked as a git submodule.

## Requirements

- Docker + Docker Compose
- Node 18+ (repo is developed on Node 22) and npm
- Composer *(optional — enables PHP linting)*
- Claude CLI *(optional — enables the pre-push AI review)*
- macOS only: `brew install coreutils` *(optional — gives the AI review a timeout)*

## Getting started

```bash
git clone <git-url> <project-name>
cd <project-name>
```

### Backend

```bash
cd backend
make install
```

`make install` does the whole first-run setup: builds & starts the Docker stack, runs the
WordPress auto-config, installs frontend deps (`npm install`), installs PHP tooling
(`composer install`, if present), activates the git hooks, and pulls the `nextpress`
submodule.

- WordPress admin: <http://localhost/wp-admin>
- phpMyAdmin: `http://localhost:<PHPMYADMIN_PORT>`

Docker settings (project name, image versions, ports) come from `backend/.env`.

Other targets: `make start` / `make down` (containers), `make frontend` (npm install only),
`make php-tools` (composer only), `make hooks` (activate git hooks only).

### Frontend

```bash
cd frontend
cp .env.sample .env    # then set NEXT_PUBLIC_API_URL etc.
npm run dev
```

- Frontend: <http://localhost:3000>

Key env vars: `NEXT_PUBLIC_API_URL` (WordPress REST base), `NEXT_PUBLIC_FRONTEND_URL`,
`NEXTPRESS_PREVIEW_SECRET` (page/block preview).

Scripts: `npm run dev` / `build` / `start`, `lint` (Next ESLint), `lint:css` (Stylelint),
`format` / `format:check` (Prettier).

## Pre-push AI review (git hooks)

On `git push` to `main` with in-scope changes, the hook first asks **"Run the Claude
pre-push review? [y/N]"** — default **no**, so nothing is linted or sent to Claude unless you
opt in (keeps every push cheap). If you say yes, it lints the changed files, has Claude review
the diff (read-only), then asks what to do next: **[P] push anyway** (default), **[F] fix
manually** (cancels the push), or **[A] fix with AI** (cancels and hands off to
`/pre-push-fix`). It's advisory — only F or A stops the push.

- **Enabled automatically** — `make install`, `npm install`, or `composer install` each set
  `core.hooksPath` to `.githooks` (via `bin/enable-hooks`). No manual step.
- **Scope** — the `nextpress` plugin, custom themes (not `twenty*`), and frontend JS/TS/CSS.
  The plugin lives in a submodule, so the hook resolves and diffs *inside* it.
- **Linters** (each skips silently if not installed) — `php -l`, PHPCS/WPCS, ESLint,
  Stylelint, Prettier. Missing-but-configured tools print a one-line install nudge.
- **Run without the prompt** — `AI_REVIEW=1 git push` (always reviews). **Skip entirely** —
  `SKIP_AI_REVIEW=1 git push` or `git push --no-verify`.
- **Last review** — saved to `.git/ai-review-last.txt`.
- **Run manually** — `/pre-push-review` in Claude Code.
- **Different repo layout?** — edit the config vars at the top of `.githooks/pre-push`
  (`PLUGIN_DIR`, `THEMES_DIR`, `FRONTEND_DIR`, …).
- **GUI git clients** run hooks with a restricted PATH, so `claude`/`php`/`node` may not be
  found and the review simply skips.

PHP standards live in `phpcs.xml` (WordPress Coding Standards; short-array syntax and
non-Yoda conditions allowed). Run manually with `composer run lint:php` / `lint:php:fix`.

## Frontend structure

```
frontend/
  src/
    app/                 Next.js App Router
      [[...slug]]/       catch-all — fetches a page's blocks from WP and renders them
      api/               blocks, draft, revalidate, sitemap-proxy, video-proxy
      page-preview/      live preview of WordPress content while editing
      block-preview/     live preview of a single block
      layout.tsx         root layout + metadata (favicons live in public/images/favicon)
    lib/                 types & data helpers
    ui/globals.css       Tailwind entry + @theme design tokens
    utils/               misc helpers
  ui/components/         shared React components (atoms / molecules / organisms / archive)
  themes/
    default/             a site theme
      blocks/            React components matched to WordPress blocks
      theme.scss         theme styles (@reference globals.css + @apply)
```

**Next.js** — App Router, server components by default. The `[[...slug]]` route resolves any
WordPress page/post, fetches its blocks over REST, and renders the matching components.

**Tailwind v4** — CSS-first, **no `tailwind.config.js`**. Configuration lives in
`src/ui/globals.css`: `@import "tailwindcss"` plus `@theme` blocks defining the design tokens
(brand colours, the `--spacing-col-*` column scale, heading type scale). Per-theme SCSS uses
`@reference "…/globals.css"` so `@apply` can see those tokens.

**Blocks** — WordPress Gutenberg blocks (provided via the `nextpress` plugin) map to React
components under `themes/<theme>/blocks/`, composed from shared `ui/components/*`. Use the
`scaffold-block` skill to add new ones.

**Page preview** — the `page-preview` / `block-preview` routes render unsaved editor content
(authenticated with `NEXTPRESS_PREVIEW_SECRET`) so editors see the real Next.js output inside
wp-admin.

## WordPress plugins

Bundled: **Nextpress** (headless bridge), **ACF Pro** (fields), **Gravity Forms** (forms),
**Yoast SEO**, plus supporting plugins (Redis cache, Safe SVG, WP Mail SMTP, …).

The `nextpress` plugin has its **own documentation** — see
`backend/wordpress/wp-content/plugins/nextpress/README.md` and `PLUGIN_DOCUMENTATION.md`.
