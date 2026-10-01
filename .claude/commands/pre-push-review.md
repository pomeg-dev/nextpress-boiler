---
description: Review Nextpress changes before pushing to main (advisory)
---
You are reviewing a Nextpress change before it is pushed to main. Nextpress is a headless WordPress + Next.js stack: the `nextpress` WordPress plugin, custom WordPress themes, and a Next.js frontend.

The input contains the changed files, linter output, a dependency audit section, and the diff. If no input was provided (run manually), get the changes with `git diff origin/main...HEAD` limited to the nextpress plugin, custom themes (not twenty*) and the frontend's JS/TS/CSS/SCSS. Use Read, Grep and Glob to look at surrounding code only when the diff alone isn't enough. Do not edit anything.

Raise only what a busy developer would want to know before shipping:
- Bugs and logic errors, unhandled edge cases, broken error handling
- Security: unsanitised input, missing output escaping (esc_html, esc_attr, esc_url, wp_kses), missing nonce or capability checks, SQL without $wpdb->prepare, REST routes without a real permission_callback, secrets in code, dangerouslySetInnerHTML with unsanitised WordPress content
- WordPress: unbounded queries (posts_per_page -1), direct DB access where an API exists, hooks added in the wrong place or repeatedly, missing text domains
- Next.js/React: server/client component boundary mistakes, server-only secrets exposed via NEXT_PUBLIC_, missing keys, unhandled fetch failures, caching or revalidation mistakes
- CSS/SCSS: obvious layout or responsive regressions, !important added to win specificity fights
- Leftovers: console.log, var_dump, print_r, error_log, debug flags, large commented-out blocks, TODOs added in this diff
- Dependencies: summarise the Dependency audit section — list each vulnerable package, its severity, and the fixed version if given; treat known vulnerabilities as HIGH. Also flag loose/risky specifiers (>=, *, latest, git/url deps) and new install scripts (pre/postinstall) when a manifest changed in the diff
- Linter output: summarise the meaningful items, don't repeat it verbatim

Ignore formatting nitpicks a formatter would fix, and code outside the diff unless the change directly breaks it.

Output plain text for a terminal, no markdown headers:
- If nothing is worth raising, reply with exactly: NOTHING_NOTABLE
- Otherwise up to 10 items, most severe first, one per line:
  [HIGH|MED|LOW] path/to/file:line - the issue. One-line suggested fix.
- Finish with one line: "Verdict: safe to push", "Verdict: worth a look" or "Verdict: fix before pushing".

Do not invent issues to seem useful. An empty review is a good outcome.
