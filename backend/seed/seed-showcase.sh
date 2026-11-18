#!/usr/bin/env bash
# Seeds the Nextpress showcase: media, five pages, two menus, the header and
# footer Templates layouts.
#
#   backend/seed/seed-showcase.sh           seed, or update what a previous run made
#   backend/seed/seed-showcase.sh --reset   delete what the seed made and restore what it overwrote
#
# Idempotent. Every post, attachment and menu it creates carries the
# `_np_seed_key` meta, and a second run updates those in place. It never
# deletes content it did not create. Approved overwrites, backed up on the
# first run and restored by --reset:
#   - Home page content (ID 2) → post meta `_np_seed_original_content` (base64)
#   - header/footer Templates layouts → option `np_seed_backup`
#   - menu locations: deleting a seeded menu unassigns it
# It leaves `frontend_url` alone: the plugin also uses that option for its
# server-side block fetch, and http://localhost:3000 is unreachable from the
# wordpress container. Empty, the plugin falls back to the Docker host URL.
# The Gravity Form (ID 1) is only referenced, never created or edited.
#
# Needs: the backend containers running (docker compose up), node on the host,
# and the frontend on :3000 (the plugin reads block fields from its /api/blocks).
# Images and their licences: images/sources.json.
set -euo pipefail

SEED_DIR=$(cd "$(dirname "$0")" && pwd)
BACKEND_DIR=$(dirname "$SEED_DIR")
cd "$BACKEND_DIR"

SITE_URL=${SITE_URL:-http://localhost}
HOME_ID=2
FORM_ID=1
PAGES="about:About platform:Platform work:Work contact:Contact"

RESET=0
[ "${1:-}" = "--reset" ] && RESET=1

OUT_DIR=$(mktemp -d)
trap 'rm -rf "$OUT_DIR"' EXIT

# The wpcli service has no DB env: copy it from the running wordpress container.
docker inspect -f '{{.State.Running}}' wordpress >/dev/null 2>&1 || {
  echo "The wordpress container is not running. Start the backend first." >&2
  exit 1
}
for v in $(docker exec wordpress sh -c 'env | grep -E "^WORDPRESS_" | cut -d= -f1'); do
  export "$v=$(docker exec wordpress printenv "$v")"
done

# Runs a POSIX sh script (stdin) in one wpcli container. Inside it, `wp` runs
# as the admin user without Imagify (it would send uploads to its API) or Yoast.
# PHP notices go to stdout under WP_DEBUG, so scripts report results on lines
# prefixed `@@` and the host reads only those.
in_wpcli() {
  { cat <<'PRELUDE'; cat; } | docker compose run --rm -T \
    -v "$SEED_DIR:/seed:ro" -v "$OUT_DIR:/seed-out:ro" \
    -e WORDPRESS_DB_PASSWORD -e WORDPRESS_DB_HOST -e WORDPRESS_DB_USER -e WORDPRESS_DB_NAME -e WORDPRESS_TABLE_PREFIX \
    wpcli sh -s 2> >(grep -v -E '^ ?(Container|Network) |level=warning' >&2)
set -e
P=${WORDPRESS_TABLE_PREFIX:-wp_}
wp() { command wp --user=1 --skip-plugins=imagify,wordpress-seo,wordpress-seo-premium "$@"; }
# Last line that is only digits: an ID printed by --porcelain.
id_of() { grep -E '^[0-9]+$' | tail -n 1; }
# One SQL value, selected as CONCAT('@@', …), without the PHP notices.
sql() { wp db query "$1" --skip-column-names | sed -n 's/^@@//p'; }
# The plugin caches router responses; drop them so pages show the new content.
clear_router_cache() {
  for t in $(sql "SELECT CONCAT('@@', SUBSTRING(option_name, 12)) FROM ${P}options WHERE option_name LIKE '\_transient\_nextpress\_router\_%'"); do
    wp transient delete "$t" >/dev/null
  done
}
PRELUDE
}

# key=ID pairs for everything the seed owns (posts and menus).
seeded() {
  in_wpcli <<'SH' | sed -n 's/^@@ //p'
wp db query "SELECT CONCAT('@@ ', meta_value, '=', post_id) FROM ${P}postmeta WHERE meta_key = '_np_seed_key'" --skip-column-names
wp db query "SELECT CONCAT('@@ ', meta_value, '=', term_id) FROM ${P}termmeta WHERE meta_key = '_np_seed_key'" --skip-column-names
SH
}

lookup() { printf '%s\n' "$SEEDED" | sed -n "s/^$1=//p" | head -n 1; }

# ---------------------------------------------------------------------------
# --reset
# ---------------------------------------------------------------------------
if [ "$RESET" = 1 ]; then
  SEEDED=$(seeded)
  {
    printf '%s\n' "$SEEDED" | while IFS='=' read -r key id; do
      case "$key" in
        page:home) ;; # Restored below, never deleted.
        menu:*) echo "wp menu delete $id >/dev/null" ;;
        *) echo "wp post delete $id --force >/dev/null" ;;
      esac
    done
    # Byte-exact restores in SQL: no slashing, no double serialisation.
    cat <<SH
wp db query "UPDATE \${P}posts p JOIN \${P}postmeta m ON m.post_id = p.ID AND m.meta_key = '_np_seed_original_content' SET p.post_content = FROM_BASE64(m.meta_value) WHERE p.ID = $HOME_ID" >/dev/null
wp post meta delete $HOME_ID _np_seed_original_content >/dev/null 2>&1 || true
wp post meta delete $HOME_ID _np_seed_key >/dev/null 2>&1 || true
sql "SELECT CONCAT('@@', option_value) FROM \${P}options WHERE option_name = 'np_seed_backup'" | base64 -d | while read -r name value; do
  wp db query "UPDATE \${P}options SET option_value = FROM_BASE64('\$value') WHERE option_name = '\$name'" >/dev/null
done
wp option delete np_seed_backup >/dev/null 2>&1 || true
clear_router_cache
wp cache flush >/dev/null
SH
  } | in_wpcli
  echo "Reset done: seeded items deleted, Home and the templates restored."
  exit 0
fi

# ---------------------------------------------------------------------------
# 1. Media and pages exist (created on the first run, found after).
# ---------------------------------------------------------------------------
SEEDED=$(seeded)

IMAGES=$(node -e '
  const { images } = require(process.argv[1]);
  for (const i of images) console.log([i.key, i.file, i.alt, `Photo: ${i.author} / Unsplash`, i.source].join("\t"));
' "$SEED_DIR/images/sources.json")

{
  printf '%s\n' "$IMAGES" | while IFS=$'\t' read -r key file alt caption source; do
    [ -n "$(lookup "img:$key")" ] && continue
    cat <<SH
id=\$(wp media import "/seed/images/$file" --title="$alt" --alt="$alt" --caption="$caption" --desc="$source" --porcelain | id_of)
wp post meta update \$id _np_seed_key "img:$key" >/dev/null
echo "@@ img:$key=\$id"
SH
  done
  for variant in ink chalk; do
    [ -n "$(lookup "img:wordmark-$variant")" ] && continue
    cat <<SH
id=\$(wp media import "/seed/images/nextpress-wordmark-$variant.svg" --title="Nextpress wordmark ($variant)" --alt="Nextpress" --porcelain | id_of)
wp post meta update \$id _np_seed_key "img:wordmark-$variant" >/dev/null
echo "@@ img:wordmark-$variant=\$id"
SH
  done
  for page in $PAGES; do
    slug=${page%%:*}
    title=${page#*:}
    [ -n "$(lookup "page:$slug")" ] && continue
    cat <<SH
id=\$(wp post create --post_type=page --post_status=publish --post_title="$title" --post_name="$slug" --porcelain | id_of)
wp post meta update \$id _np_seed_key "page:$slug" >/dev/null
echo "@@ page:$slug=\$id"
SH
  done
} | in_wpcli | sed -n 's/^@@ //p' > "$OUT_DIR/created"

SEEDED=$(printf '%s\n%s\n' "$SEEDED" "$(cat "$OUT_DIR/created")")
echo "Media and pages: $(grep -c . "$OUT_DIR/created" || true) created."

# ---------------------------------------------------------------------------
# 2. Page content, generated from the attachment IDs.
# ---------------------------------------------------------------------------
printf '%s\n' "$SEEDED" | node -e '
  const lines = require("fs").readFileSync(0, "utf8").split("\n");
  const media = { form: process.argv[1] };
  for (const line of lines) {
    const m = line.match(/^img:([^=]+)=(\d+)$/);
    if (m) media[m[1]] = Number(m[2]);
  }
  process.stdout.write(JSON.stringify(media));
' "form_id_$FORM_ID" > "$OUT_DIR/media.json"

node "$SEED_DIR/content.mjs" "$OUT_DIR/media.json" "$SITE_URL" > "$OUT_DIR/pages.json"
node -e '
  const pages = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  for (const [slug, html] of Object.entries(pages)) require("fs").writeFileSync(`${process.argv[2]}/${slug}.html`, html);
' "$OUT_DIR/pages.json" "$OUT_DIR"

# ---------------------------------------------------------------------------
# 3. Pages, menus, templates and settings.
# ---------------------------------------------------------------------------
HEADER_MENU=$(lookup "menu:header")
FOOTER_MENU=$(lookup "menu:footer")
LOGO_INK=$(lookup "img:wordmark-ink")
LOGO_CHALK=$(lookup "img:wordmark-chalk")

{
  # Back up what the seed overwrites, once, as base64 (restored in SQL).
  # Then drop the plugin's cached block list (12h) so new blocks get their fields.
  cat <<SH
for t in default_blocks default_templates; do wp transient delete "nextpress_blocks_next_blocks_\$t" >/dev/null 2>&1 || true; done
if [ -z "\$(sql "SELECT CONCAT('@@', meta_id) FROM \${P}postmeta WHERE post_id = $HOME_ID AND meta_key = '_np_seed_original_content'")" ]; then
  wp db query "INSERT INTO \${P}postmeta (post_id, meta_key, meta_value) SELECT ID, '_np_seed_original_content', REPLACE(TO_BASE64(post_content), CHAR(10), '') FROM \${P}posts WHERE ID = $HOME_ID"
fi
wp post meta update $HOME_ID _np_seed_key page:home >/dev/null
# (WP-CLI hides the output of any query containing REPLACE, so the batch-mode
# "\n" escapes in TO_BASE64 output are stripped with sed.)
if [ -z "\$(sql "SELECT CONCAT('@@', option_id) FROM \${P}options WHERE option_name = 'np_seed_backup' AND option_value <> ''")" ]; then
  backup=\$(wp db query "SELECT CONCAT('@@', option_name, ' ', TO_BASE64(option_value)) FROM \${P}options WHERE option_name LIKE 'options\\\\_default\\\\_%\\\\_content\\\\_0\\\\_%'" --skip-column-names | sed -n 's/^@@//p' | sed 's/\\\\n//g')
  [ -n "\$backup" ] || { echo "@@ warn: no Templates options found to back up"; exit 1; }
  wp option update np_seed_backup "\$(printf '%s\n' "\$backup" | base64 -w 0)" --autoload=no >/dev/null
fi
SH

  # Page content, then a byte check: WP-CLI must not strip the backslashes in block JSON.
  for page in home:$HOME_ID $(for p in $PAGES; do s=${p%%:*}; echo "$s:$(lookup "page:$s")"; done); do
    slug=${page%%:*}
    id=${page#*:}
    cat <<SH
wp post update $id /seed-out/$slug.html >/dev/null
if [ "\$(sql "SELECT CONCAT('@@', MD5(post_content)) FROM \${P}posts WHERE ID = $id")" != "\$(md5sum < /seed-out/$slug.html | cut -d ' ' -f 1)" ]; then
  echo "@@ warn: $slug content changed on save"
fi
SH
  done

  # Menus: found by term meta, items rebuilt every run.
  for menu in header footer; do
    existing=$([ "$menu" = header ] && echo "$HEADER_MENU" || echo "$FOOTER_MENU")
    if [ -z "$existing" ]; then
      cat <<SH
${menu}_menu=\$(wp menu create "Nextpress $menu" --porcelain | id_of)
wp term meta update \$${menu}_menu _np_seed_key "menu:$menu" >/dev/null
SH
    else
      cat <<SH
${menu}_menu=$existing
items=\$(wp menu item list \$${menu}_menu --format=ids | tail -n 1)
[ -n "\$items" ] && wp menu item delete \$items >/dev/null
SH
    fi
  done
  for page in $PAGES; do
    slug=${page%%:*}
    title=${page#*:}
    classes=$([ "$slug" = contact ] && echo "--classes=is-cta" || true)
    echo "wp menu item add-post \$header_menu $(lookup "page:$slug") --title=\"$title\" $classes >/dev/null"
  done
  echo "wp menu item add-post \$footer_menu $HOME_ID --title=Home >/dev/null"
  for page in $PAGES; do
    slug=${page%%:*}
    echo "wp menu item add-post \$footer_menu $(lookup "page:$slug") --title=\"${page#*:}\" >/dev/null"
  done

  # Templates layouts (ACF options, Templates page) and settings.
  cat <<SH
wp menu location assign \$header_menu header_nav
wp menu location assign \$footer_menu footer_nav
wp option update options_default_before_content_0_logo $LOGO_INK >/dev/null
wp option update options_default_before_content_0_header_nav "{{nav_id-\$header_menu}}" >/dev/null
wp option update options_default_after_content_0_logo $LOGO_CHALK >/dev/null
wp option update options_default_after_content_0_footer_nav "{{nav_id-\$footer_menu}}" >/dev/null
wp option update options_default_after_content_0_style solid >/dev/null
wp option update options_default_after_content_0_background_image "" >/dev/null
wp option update options_default_after_content_0_copyright "© Nextpress. A headless WordPress boilerplate.
Photography from Unsplash, credited in the media library." >/dev/null
clear_router_cache
echo "@@ ok"
SH
} | in_wpcli | sed -n 's/^@@ //p' | while read -r line; do
  case "$line" in
    warn:*) echo "Warning: ${line#warn: }" >&2 ;;
  esac
done

# ---------------------------------------------------------------------------
# 4. Check the router serves each page with its blocks.
# An ACF block with only the 3 Block Settings keys means the plugin could not
# fetch the block list from the frontend (dev server down, or its rate limit or
# circuit breaker: see CLAUDE.md). Start the frontend, wait 5 minutes, re-run.
# ---------------------------------------------------------------------------
for slug in home about platform work contact; do
  path=$([ "$slug" = home ] && echo "" || echo "$slug")
  blocks=$(curl -sf "$SITE_URL/wp-json/nextpress/router/$path" | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      const page = JSON.parse(s);
      console.log((page.content || []).map((b) => {
        const name = b.blockName.replace(/^(acf\/default--|core\/)/, "");
        const stripped = b.blockName.startsWith("acf/") && Object.keys(b.data || {}).length <= 3;
        return stripped ? `${name} (NO FIELDS)` : name;
      }).join(", "));
    });
  ') || blocks="(router request failed)"
  printf '%-9s %s\n' "$slug" "$blocks"
done
