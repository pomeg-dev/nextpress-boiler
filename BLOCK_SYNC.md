# Block Sync

You define block fields on the frontend in `frontend/themes/<theme>/blocks/<block>/fields.json`, next to the block's `index.tsx`. You then push them to WordPress. WordPress stores them in its database and registers the ACF fields and Gutenberg blocks from that copy. This means:

- New fields reach WordPress without a frontend deploy or a WordPress code deploy.
- Blocks keep working if the frontend is down.

## Setup

1. In wp-admin, go to **Nextpress > Blocks** and generate a sync secret. If the site defines `NEXTPRESS_SYNC_SECRET` in `wp-config.php`, use that value instead.
2. Add the secret to `frontend/.env.local`:

```bash
NEXTPRESS_SYNC_SECRET=<secret from wp-admin>
# Optional; defaults to NEXT_PUBLIC_API_URL
NEXTPRESS_WP_URL=http://localhost
```

Extra environments use a suffix and are selected with `--target`:

```bash
NEXTPRESS_WP_URL_STAGING=https://staging-cms.example.com
NEXTPRESS_SYNC_SECRET_STAGING=<staging secret>
```

## The npm scripts

Run these from `frontend/`.

### `npm run blocks:check`

Validates every `fields.json` without changing anything. It catches:

- invalid JSON
- missing `id` or `type`
- duplicate ids
- `$ref` partials that are missing or circular

It also warns about unknown field types and about `conditional_logic` that points at a field that doesn't exist. Run it in CI or before committing.

### `npm run blocks:build`

Runs the same validation, then writes the compiled manifest to `frontend/.nextpress/blocks.manifest.json`, which is gitignored. Use it to inspect exactly what WordPress will receive. You don't need it for a normal push.

### `npm run blocks:push`

Validates the blocks, then fetches what WordPress currently has and prints a diff. The diff marks:

- `+` added
- `~` changed
- `!` type changed
- `-` removed

After the diff, it sends the new manifest. If nothing has changed, it skips the send.

| Flag | What it does |
| --- | --- |
| `--dry-run` | Show the diff only, push nothing |
| `--target=staging` | Push to the `_STAGING` env vars instead of the default |
| `--allow-removals` | Required when blocks or fields would be removed |

Pass flags after `--`, for example `npm run blocks:push -- --target=staging --dry-run`.

### `npm run blocks:watch`

For local development. It pushes once, then pushes again every time a `.json` file under `themes/` is saved. Validation errors are printed and nothing is pushed until you fix them. Watch mode doesn't apply the removal guard, so use it locally only.

## Building a new block: ideal order

1. **Start watching.** In one terminal run `npm run dev`, and in another run `npm run blocks:watch`.
2. **Create the folder** `themes/default/blocks/<block-name>/`.
3. **Write `fields.json` first.** Save it. The watcher pushes it, and the block appears in the editor straight away. For shared fields such as buttons, use `{ "$ref": "<name>" }`, which inlines `themes/<theme>/_partials/<name>.json`.
4. **Add test content in WordPress.** Insert the block on a local page and fill the fields. You now have real data to build against.
5. **Build `index.tsx`** and its organism. The editor preview and the page update as you go.
6. **Adjust fields if needed.** Edit `fields.json` and the watcher pushes again.
7. **Before committing,** run `npm run blocks:check`.
8. **Staging.** Run `npm run blocks:push -- --target=staging --dry-run`, check the diff, then run it again without `--dry-run`. Deploy the frontend whenever you're ready. The order doesn't matter: until the frontend ships, the editor shows the block's fallback preview.
9. **Production.** Repeat step 8 with `--target=production`. Editors can start filling in content before the frontend release goes out.

For the self-hosted client, step 9 is only a push. No WordPress deploy is needed once their plugin includes the sync feature.

## Gotchas

- **Renaming a field `id`, a block folder or a theme orphans existing content.** The ACF field keys are built from those names (`field_<theme>-<block>-block_<id>`). Treat a rename as a removal plus an addition.
- **Removals need `--allow-removals`.** Existing content keeps its raw data, but WordPress no longer has a field definition for it.
- **`!` type changed** means existing values may not fit the new type. For example, a `text` field changed to a `repeater`.
- **Rollback.** **Nextpress > Blocks** keeps the last 5 versions. Use "Roll back" to restore the previous one.
- **Sites that have never had a push** fall back to pulling `/api/blocks` from the frontend once and storing the result. "Pull from frontend now" on the same page forces a pull.
