// Server-only; only preview routes import it.
import { createPreviewServer } from "@pomeg-dev/nextpress-client/preview-server";
import { nextpress } from "@/nextpress.config";
import { BlockParser } from "@/nextpress.blocks";

export const preview = createPreviewServer(nextpress.config, BlockParser);
