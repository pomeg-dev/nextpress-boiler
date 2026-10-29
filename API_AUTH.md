# Frontend ↔ WordPress API authentication

This document explains the HMAC request-signing handshake added between the
Next.js frontend and the `nextpress` WordPress plugin's REST routes, and
gives some background on how HMAC signing works and why it was chosen.

## The problem

The `nextpress` plugin registers a set of REST routes under `/wp-json/nextpress/*`
(`posts`, `router`, `menus`, `settings`, `block_theme`, `tax_list`, `tax_term`,
`form`) that the Next.js frontend calls to fetch content. All of them were
registered with `'permission_callback' => '__return_true'` — fully public,
by design, since the frontend has no logged-in WordPress user to authenticate
as.

The downside: "fully public" also means any bot or script that finds the
WordPress domain can hit these routes directly — bypassing the Next.js
frontend, caching, and rate limiting entirely — and hammer the WordPress
database with arbitrary queries (`per_page`, `post_type`, search terms,
taxonomy filters, etc. are all attacker-controlled).

The goal here isn't to add user-level authentication (there's no "user" on
the frontend side — it's a server talking to a server) — it's to make sure
requests to these routes only come from something that holds a shared
secret, i.e. your own Next.js deployment.

## What was implemented

A **shared-secret HMAC signature**, checked on every request to a
`nextpress/*` route before WordPress does any work:

```
┌─────────────┐   1. compute signature using          ┌──────────────┐
│  Next.js    │      shared secret + request details   │  WordPress   │
│  server     │ ──────────────────────────────────────>│  REST API    │
│ (signedFetch)│  GET /wp-json/nextpress/posts          │ (API_Auth)   │
└─────────────┘  X-Nextpress-Timestamp: 1751536...      └──────────────┘
                 X-Nextpress-Signature: 9f2a1c...              │
                                                                 │ 2. recompute
                                                                 │    the same
                                                                 │    signature
                                                                 │    and compare
                                                                 ▼
                                                        match → 200 OK
                                                        no match → 401
```

Neither side ever sends the secret itself over the network — only a
signature *derived* from it (see the HMAC section below for why that
matters).

### Backend (`backend/wordpress/wp-content/plugins/nextpress`)

- **`class/api/api-auth.php`** — new `API_Auth::verify_signature()` static
  method, used as the `permission_callback` for every `nextpress/*` route
  (`api-router.php`, `api-posts.php`, `api-menus.php`, `api-settings.php`,
  `api-theme.php`). It:
  1. Reads the `X-Nextpress-Timestamp` and `X-Nextpress-Signature` headers.
  2. Rejects the request if either is missing, or the timestamp is more
     than 5 minutes old/in the future (`TIMESTAMP_TOLERANCE`).
  3. Recomputes the expected signature from `METHOD:ROUTE:TIMESTAMP` and the
     server's copy of the secret.
  4. Compares it to the signature on the request using `hash_equals()`
     (timing-safe comparison — see below).
  5. Returns `true` (allow) or a `WP_Error` with a `401` status.
- **`wp-config.php`** — new `NEXTPRESS_API_SECRET` constant, hardcoded
  directly (not read from `backend/.env` or `docker-compose.yml`). This
  file is gitignored (`backend/wordpress/.gitignore`), so it's the right
  place for real secrets — the same convention this codebase already uses
  for `JWT_AUTH_SECRET_KEY`. `backend/.env` is tracked in git, so secrets
  never go there.

**Fail-open by design**: if `NEXTPRESS_API_SECRET` isn't set, `verify_signature()`
returns `true` immediately and the routes behave exactly as before (fully
public). The protection is opt-in — set the secret to turn it on.

### Frontend (`frontend`)

- **`src/lib/wp/api-client.ts`** — new `signedFetch()`, a drop-in
  replacement for `fetch()` that adds the two signature headers when
  `NEXTPRESS_API_SECRET` is set. Uses the **Web Crypto API**
  (`crypto.subtle`), not Node's `crypto` module, because some of the
  `lib/wp/*` functions get bundled into Next.js edge-runtime routes (e.g.
  `app/icon.tsx`), which don't support Node built-ins — `crypto.subtle` is
  available in both the Node.js and Edge runtimes.
- **`src/lib/wp/posts.ts`, `menus.ts`, `settings.ts`, `theme.ts`** — now
  call `signedFetch()` instead of `fetch()`.
- **`src/app/api/posts/route.ts`** — a new server-side proxy route. One
  call site (`ui/components/archive/Feed.tsx`, for infinite-scroll
  pagination) is a client component that used to call WordPress directly
  from the browser. A secret can never be safely used in a browser-originated
  request — anyone can read it straight out of DevTools' Network tab and
  replay it. So that call now goes browser → this Next.js route → WordPress,
  keeping the secret server-side only.
- **`NEXTPRESS_API_SECRET`** — added to `.env` / `.env.local` / `.env.sample`.
  Deliberately **not** prefixed with `NEXT_PUBLIC_`, since that prefix tells
  Next.js to inline the value into the browser bundle — the opposite of
  what we want.

## HMAC, briefly

**HMAC** (Hash-based Message Authentication Code) takes a secret key and a
message, and produces a fixed-length tag (here, a 64-character hex string
from SHA-256) that proves two things to whoever can recompute it with the
same key:

1. **Authenticity** — the message was created by someone who holds the
   secret key.
2. **Integrity** — the message wasn't altered in transit (changing even one
   character of the input completely changes the output tag).

It does **not** provide confidentiality — an HMAC tag doesn't hide or
encrypt anything, and the message itself (here, the request) is still sent
in the open. That's fine for this use case: WordPress content isn't
sensitive, and it's already served over plain HTTP/HTTPS regardless. What we
need is a way for WordPress to know "this request came from something that
knows my secret," and HMAC is the standard tool for exactly that — it's
the same primitive behind AWS's request signing (SigV4), webhook
verification (Stripe, GitHub, etc.), and JWT's `HS256` signatures.

### Why not just send the secret as a static header?

A static `X-API-Key: <secret>` header would also work as a first pass, but
it has a weaker failure mode: if it ever leaks — a log line, a browser
extension, a misconfigured proxy — it's valid *forever* until someone
notices and rotates it. With HMAC:

- The secret itself never appears on the wire, only a signature derived
  from it. Even with a network capture of every header, an attacker cannot
  recover the underlying secret — a SHA-256 HMAC is a one-way function.
- Each request produces a **different** signature (because the timestamp is
  part of the signed payload), so a captured signature is only replayable
  within the timestamp window (5 minutes here), not indefinitely.

### Why the timestamp matters (replay protection)

Signing `METHOD:ROUTE:TIMESTAMP` rather than just `METHOD:ROUTE` means a
signature is only valid for a few minutes. Without it, anyone who observed
one valid request (e.g. from a browser's dev tools, or a proxy log) could
replay that exact header pair indefinitely. `API_Auth::verify_signature()`
rejects anything where `abs(time() - $timestamp) > 300` seconds, so a
captured signature has a short shelf life and can't be replayed the next
day, or even the next hour.

This isn't full protection against replay *within* that 5-minute window —
a request captured and replayed 30 seconds later would still pass. That's
an accepted tradeoff for this use case (reducing casual bot/scraper noise
against a content API, not guarding a financial transaction), and the
window could be tightened if needed.

### Why `hash_equals()` instead of `===`

```php
if ( ! hash_equals( $expected, $signature ) ) { ... }
```

PHP's `===` string comparison short-circuits at the first differing byte,
so how long it takes to fail depends on how many leading bytes happened to
match. In principle, an attacker who can measure response timing precisely
enough could exploit that to guess the correct signature one byte at a
time (a **timing attack**). `hash_equals()` always compares the full length
of both strings in constant time, so the comparison itself leaks no
information about how close a guess was. It's cheap to use correctly, so
there's no reason not to.

### Signed payload format

```
{METHOD}:{ROUTE}:{TIMESTAMP}
```

e.g. `GET:/nextpress/posts:1751536200`. `ROUTE` is WordPress's
`$request->get_route()` (the REST path without the `/wp-json` prefix or
query string) — deliberately *not* including the query string, to keep the
frontend implementation simple (it doesn't need to know the exact query
string ahead of time). This means a valid signature for `/nextpress/posts`
could technically be replayed against the same route with different query
parameters within the 5-minute window. That's an acceptable gap here since
this isn't a per-user authorization system — it's a coarse "is this even
coming from our own frontend" gate — but worth knowing if you ever need to
tighten it (the fix would be including a hash of the query string/body in
the signed payload).

## Configuration

| Variable | Where | Notes |
|---|---|---|
| `NEXTPRESS_API_SECRET` | `backend/wordpress/wp-config.php` (hardcoded `define()`) | This file is gitignored, so it's safe to put the real value directly here — same convention as `JWT_AUTH_SECRET_KEY`. Deliberately **not** wired through `backend/.env`/`docker-compose.yml`, since `backend/.env` is tracked in git. |
| `NEXTPRESS_API_SECRET` | `frontend/.env` / `.env.local` | Also gitignored. Server-only — must **not** be prefixed `NEXT_PUBLIC_`. |

Both values must match exactly. Generate a strong one per environment with:

```bash
openssl rand -hex 32
```

**Rotate before production.** The value currently in `wp-config.php` and
`frontend/.env*` was generated for local development only. Both files are
gitignored, so nothing here gets committed — but generate a fresh, unique
value per environment (local/staging/production) rather than reusing this
one, and update it directly in each environment's `wp-config.php` and
frontend env file.

## Testing it

Confirm unauthenticated/forged requests are rejected, straight against
WordPress (bypassing Next.js entirely — this is what a bot would see):

```bash
# No signature at all
curl -i "http://localhost/wp-json/nextpress/posts?per_page=1"
# → 401 nextpress_missing_signature

# Guessed/forged headers
curl -i "http://localhost/wp-json/nextpress/posts?per_page=1" \
  -H "X-Nextpress-Timestamp: 1234567890" \
  -H "X-Nextpress-Signature: notarealsignature"
# → 401 (expired timestamp or invalid signature)
```

And confirm a correctly-signed request succeeds:

```bash
SECRET="<value from backend/.env>"
TS=$(date +%s)
ROUTE="/nextpress/posts"
SIG=$(printf "%s" "GET:${ROUTE}:${TS}" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

curl -i "http://localhost/wp-json/nextpress/posts?per_page=1" \
  -H "X-Nextpress-Timestamp: $TS" \
  -H "X-Nextpress-Signature: $SIG"
# → 200 OK
```

## What this does and doesn't protect against

- ✅ Stops bots/scrapers that discover the WordPress domain and hit its
  REST API directly, skipping the frontend, caching, and any
  frontend-level rate limiting.
- ✅ Stops replay of a captured request/header pair after ~5 minutes.
- ❌ Doesn't stop a bot that drives a real browser (or otherwise executes
  the frontend's own JavaScript) against the **Next.js site itself** —
  Next.js will sign requests on that bot's behalf, same as it would for a
  real visitor. This handshake is a frontend/backend service boundary, not
  a human/bot detector.
- ❌ Doesn't add confidentiality — responses are still plain JSON over
  whatever transport (HTTP/HTTPS) you're already using.
- ❌ Doesn't replace the separately-installed **Disable REST API** plugin,
  which restricts WordPress's *core* `wp/v2/*` routes by user role. That
  plugin and this handshake protect different route sets and can coexist.

If bot traffic against the frontend itself becomes a problem, that's a
separate layer (rate limiting, a WAF/CDN like Cloudflare, or a challenge
like Turnstile) — not something this handshake is meant to solve.
