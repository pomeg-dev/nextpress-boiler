"use server";

// SPIKE (page-preview 2b, Vercel-safe render): a Server Action that renders the
// REAL server-side BlockParser and returns it as an RSC payload (a React node,
// NOT an HTML string). The Next client runtime renders that payload, so client
// components inside blocks (sliders, carousels, etc.) hydrate normally.
//
// Why this shape: on Vercel (serverless) a globalThis store doesn't survive
// between the POST that saves blocks and the GET that renders them — different
// invocations, different memory. Here the blocks travel with each action call,
// so there is no server state to shard. This also deletes the unauthenticated
// store surface and makes two editors on the same page impossible to collide
// (each canvas renders its own client-held blocks).
//
// The auth boundary: every call verifies the HMAC preview token (and that it is
// bound to this post) before rendering. This is what the unauthenticated store
// route never did.

import { BlockParser } from "@/ui/block-parser";
import { isAuthorized } from "./token";

export async function renderBlocks(token: string, post: string, blocks: unknown[]) {
  if (!isAuthorized(token, post)) {
    throw new Error("Unauthorized preview render");
  }
  return <BlockParser blocks={(blocks ?? []) as never} />;
}
