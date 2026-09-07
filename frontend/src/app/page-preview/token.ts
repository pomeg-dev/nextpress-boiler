// SPIKE (page-preview 2b) — stateless HMAC preview token verification.
//
// WP mints `base64url(payload).base64url(HMAC-SHA256(payload))` where payload is
// { uid, post, sid, iat, exp } signed with NEXTPRESS_PREVIEW_SECRET (same value
// on both sides — see wp-config / .env). This is the auth boundary for the
// preview render: the renderBlocks Server Action and page.tsx both verify it, so
// there is no unauthenticated way to render or read a draft. `sid` isolates each
// editor session; `post` binds a token to one page (no replay across posts).
//
// Server-only (node:crypto). Runs in the Node runtime (route/action/RSC), never
// on the client — the secret must not ship to the browser.

import crypto from "node:crypto";

const SECRET =
  process.env.NEXTPRESS_PREVIEW_SECRET ||
  "c1492212c32302f323046d9bfb9496980b175da70b0f9004154272e8cbc273be";

// Bumped when the preview contract changes; surfaced by the health endpoint so
// the WP compat check can report the frontend feature version.
export const PREVIEW_FEATURE_VERSION = "1";

export type PreviewClaims = {
  uid: number;
  post: number;
  sid: string;
  iat: number;
  exp: number;
};

function b64urlToBuf(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export function verifyToken(token: string | null | undefined): PreviewClaims | null {
  if (!token || !SECRET) return null;

  const dot = token.indexOf(".");
  if (dot < 0) return null;

  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);

  // Constant-time signature check over the exact base64url payload string.
  const expected = crypto.createHmac("sha256", SECRET).update(payloadB64).digest();
  const got = b64urlToBuf(sigB64);
  if (expected.length !== got.length || !crypto.timingSafeEqual(expected, got)) {
    return null;
  }

  let claims: PreviewClaims;
  try {
    claims = JSON.parse(b64urlToBuf(payloadB64).toString("utf8"));
  } catch {
    return null;
  }

  // exp/iat are UNIX seconds (PHP time()).
  if (typeof claims.exp !== "number" || claims.exp * 1000 < Date.now()) return null;

  return claims;
}

/** True if the token is valid AND bound to this post id. */
export function isAuthorized(token: string | null | undefined, post: string): boolean {
  const claims = verifyToken(token);
  return !!claims && String(claims.post) === String(post);
}
