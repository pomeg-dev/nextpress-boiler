import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { SETTINGS_KEYS } from "@/utils/settings-keys";

const allowedTags = ["posts", "sitemap", "taxonomy"];
const allowedTagPrefixes = ["post-type-", "post-ids-"];

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");
  
  // Must have either tag or path parameter
  if (!tag && !path) {
    return NextResponse.json(
      { error: "Missing tag or path parameter" },
      { status: 400 }
    );
  }
  
  // Handle tag-based revalidation
  if (tag) {
    // Revalidate every settings key synchronously. revalidateTag only marks
    // the tag dirty (the refetch happens lazily on the next request), so
    // there's no thundering-herd reason to stagger — and staggering via
    // setTimeout was unreliable on serverless, where the instance is frozen
    // after the response and pending timers never fire.
    if (tag === 'settings') {
      SETTINGS_KEYS.forEach((key) => revalidateTag(key));
      return NextResponse.json({ revalidated: true, keys: SETTINGS_KEYS, now: Date.now() });
    }
    
    // Handle individual settings key revalidation
    if (SETTINGS_KEYS.includes(tag)) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, now: Date.now(), key: tag });
    }
    
    // Handle other allowed tags
    const isAllowedTag = allowedTags.includes(tag);
    const isAllowedPrefix = allowedTagPrefixes.some(prefix => tag.startsWith(prefix));

    if (!isAllowedTag && !isAllowedPrefix) {
      return NextResponse.json(
        { error: "Invalid tag parameter" },
        { status: 400 }
      );
    }
    
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now(), tag: tag });
  }
  
  // Handle path-based revalidation (new functionality)
  if (path) {
    // Validate path format (must start with /)
    if (!path.startsWith('/')) {
      return NextResponse.json(
        { error: "Path must start with /" },
        { status: 400 }
      );
    }
    
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), path: path });
  }

  return NextResponse.json(
    { error: "Unexpected error: no valid parameters processed" },
    { status: 500 }
  );
}
