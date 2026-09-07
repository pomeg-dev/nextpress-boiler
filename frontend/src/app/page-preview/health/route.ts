// Live-preview health endpoint for the WordPress compat check.
//
// GET /page-preview/health?np_token=…  →  { ok, version, tokenValid }
//
// - `ok: true` + 200 proves the route exists (a 404 means the frontend build
//   predates the feature).
// - `tokenValid` proves the shared NEXTPRESS_PREVIEW_SECRET matches on both
//   sides (the #1 real-world setup failure). Post binding is irrelevant here, so
//   we only check the signature/expiry.
import { NextResponse } from "next/server";
import { verifyToken, PREVIEW_FEATURE_VERSION } from "../token";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("np_token");
  return NextResponse.json(
    {
      ok: true,
      version: PREVIEW_FEATURE_VERSION,
      tokenValid: !!verifyToken(token),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
