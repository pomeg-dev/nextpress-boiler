import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/nextpress.config";
import { parseFeedQuery, toFeedResult } from "@ui/components/archive/query";

// The archive feed's browser requests: pages after the first, filters and
// search. Through `getPosts`, each response lands in the Data Cache under the
// `post-type-<type>` tag the plugin revalidates on publish, so WordPress sees
// one request per query per publish. The CDN keeps a copy for a minute.
const BROWSE = "public, s-maxage=60, stale-while-revalidate=86400";
// Searches rarely repeat: no long stale copy.
const SEARCH = "public, s-maxage=60";
const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  const query = parseFeedQuery(request.nextUrl.searchParams);
  if (!query) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400, headers: NO_STORE });
  }

  try {
    const result = toFeedResult(await getPosts(query, true));
    return NextResponse.json(result, {
      headers: { "Cache-Control": query.search ? SEARCH : BROWSE },
    });
  } catch {
    return NextResponse.json({ error: "Posts unavailable" }, { status: 502, headers: NO_STORE });
  }
}
