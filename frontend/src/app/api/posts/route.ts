import { NextRequest, NextResponse } from "next/server";
import { getPosts, GetPostsParams } from "@/lib/wp/posts";

/**
 * Server-side proxy for client components (e.g. archive/Feed.tsx) that need
 * to fetch posts after the initial page load. The browser only ever talks
 * to this route - getPosts()'s signed request to WordPress happens here,
 * server-side, so the HMAC secret never reaches the client.
 */
export async function GET(request: NextRequest) {
  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  try {
    const { posts, headers } = await getPosts(params as GetPostsParams, true);
    return NextResponse.json(posts, {
      headers: {
        "X-WP-Total": headers.get("X-WP-Total") ?? "",
        "X-WP-TotalPages": headers.get("X-WP-TotalPages") ?? "",
      },
    });
  } catch (error) {
    console.error("Error proxying posts request:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
