import { NextRequest, NextResponse } from "next/server";
// Plain ESM, shared with the blocks CLI (scripts/blocks/cli.mjs).
import { compileManifest } from "../../../../scripts/blocks/compile.mjs";

/**
 * Legacy pull endpoint. WordPress now prefers a manifest pushed with
 * `npm run blocks:push`; this route is only used by sites that haven't had
 * one pushed yet (the plugin persists the first successful pull).
 *
 * GET /api/blocks           → { [theme]: Block[] }
 * GET /api/blocks?theme=a,b → Block[]
 */
export async function GET(request: NextRequest) {
  const themeParam = request.nextUrl.searchParams.get("theme");
  const themes = themeParam ? themeParam.split(",").map((t) => t.trim()) : undefined;

  try {
    const { manifest, errors } = await compileManifest({ themes });
    if (errors.length) {
      // Fail rather than serve a partial manifest — WP keeps its stored copy.
      console.error("Invalid block definitions:", errors);
      return NextResponse.json({ error: "Invalid block definitions", errors }, { status: 500 });
    }

    if (themes) {
      return NextResponse.json(themes.flatMap((theme) => manifest.themes[theme] ?? []));
    }
    return NextResponse.json(manifest.themes);
  } catch (error) {
    console.error("Error reading themes directory:", error);
    return NextResponse.json({ error: "Unable to retrieve blocks" }, { status: 500 });
  }
}
