---
description: Triage the last pre-push review, auto-fix the mechanical items, then plan and apply the rest (advisory)
---
You are helping a developer fix the issues raised by the Nextpress pre-push review. They chose "Fix with AI" at the pre-push prompt (or ran this manually). Triage the findings, clear the mechanical ones automatically, then propose a plan for the judgment calls and implement it after approval. **Never commit or push.**

## 1. Gather the findings and the current state
- Read `.git/ai-review-last.txt` — the saved review (findings list + raw linter output). Treat it as a **seed, not ground truth**: it reflects the *last push's* diff, so line numbers may be stale and some items may already be fixed.
- Recompute what has actually changed now, limited to the nextpress plugin, custom themes (not `twenty*`), and the frontend's JS/TS/CSS/SCSS:
  - `git diff origin/main...HEAD` and `git diff HEAD` (working tree).
- For each review finding, **re-locate it in the current code by content/context** (not the stale line number), and confirm it still applies. Drop anything already resolved.

## 2. Triage into three buckets
- **Mechanical** — formatting / lint autofixes (Prettier, `stylelint --fix`, `phpcbf`). No judgement needed.
- **Config false-positives** — linter complaints caused by tooling config, not code (e.g. stylelint not understanding Tailwind v4 `@theme` or `--name--modifier` custom properties). Fixed in config, not code.
- **Judgment calls** — real bugs, logic/design, security, or anything needing a decision.

## 3. Clear the mechanical bucket first (fast, safe, free)
Run only the fixers whose tools are installed, on the changed files:
- Frontend: `cd frontend && npx prettier --write <changed FE files>` and `npx stylelint --fix <changed css/scss>`.
- PHP: `vendor/bin/phpcbf <changed php files>` (or `composer run lint:php:fix`).

Report what each fixer resolved.

**Submodule caveat:** the nextpress plugin is a git submodule. Fixes to files under `backend/wordpress/wp-content/plugins/nextpress/` change the submodule's working tree and must be committed **inside the submodule repo** (`git -C backend/wordpress/wp-content/plugins/nextpress ...`), separately from the superproject. Call this out; never mix submodule and superproject changes in one commit.

## 4. Plan the judgment bucket
Enter plan mode and present a plan grouped by severity (HIGH → LOW). For each item give: the file, what's wrong, the proposed change, and why — and mark which items live in the submodule. Be conservative and explicit for security/HIGH items. Ask the developer to tweak or approve before you touch any code.

## 5. Implement after approval
- Apply the approved changes with Edit/Write, minimal and in the style of the surrounding code.
- **Do not commit or push.** Leave everything in the working tree.
- List the config false-positives from bucket 2 and offer to fix the config (e.g. make `.stylelintrc.json` Tailwind-v4-aware) as a separate follow-up if they want it.

## 6. Hand back
Summarise: what the fixers cleared, what you changed for the judgment items, and what remains — config items, anything you deliberately skipped, and any submodule changes that need their own commit. Tell them to re-run `/pre-push-review` (or just push again) to confirm, then commit and push themselves.

Do not invent issues beyond the review. If you spot something genuinely critical while fixing, mention it but don't scope-creep.
