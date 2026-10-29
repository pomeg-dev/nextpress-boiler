/**
 * fetch() wrapper that HMAC-signs requests to the WordPress nextpress REST
 * routes when NEXTPRESS_API_SECRET is set (server-only env var - never
 * NEXT_PUBLIC_). Must only be called from server-side code: the signature
 * would be visible to anyone in a browser-originated request.
 *
 * Uses the Web Crypto API (not Node's `crypto` module) since some callers
 * of lib/wp/* get bundled into edge-runtime routes (e.g. app/icon.tsx),
 * which don't support Node built-ins.
 */
export async function signedFetch(url: string, options: RequestInit = {}) {
  const secret = process.env.NEXTPRESS_API_SECRET;
  if (!secret) {
    return fetch(url, options);
  }

  const { pathname } = new URL(url);
  const route = pathname.replace(/^\/wp-json/, "");
  const method = options.method ?? "GET";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = `${method}:${route}:${timestamp}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const headers = new Headers(options.headers);
  headers.set("X-Nextpress-Timestamp", timestamp);
  headers.set("X-Nextpress-Signature", signature);

  return fetch(url, { ...options, headers });
}
