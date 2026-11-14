// Server-only; only modules that render blocks import it.
import { nextpress } from "@/nextpress.config";
import { blocks } from "./blocks.registry.generated";

export const { BlockParser, BlockRenderer } = nextpress.blocks.register({
  ...blocks,
  // Site-owned core-block overrides.
  "core/group": () => import("@/ui/wordpress/blocks/group"),
  "core/button": () => import("@/ui/wordpress/blocks/button"),
});

// Module scope, after register(): never from layout.tsx.
if (process.env.NODE_ENV === "production") nextpress.blocks.warm().catch(console.warn);
