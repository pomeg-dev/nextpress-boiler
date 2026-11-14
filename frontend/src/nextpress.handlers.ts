// Server-only; only route files import it.
import { createHandlers } from "@pomeg-dev/nextpress-client/handlers";
import { nextpress } from "@/nextpress.config";

// Pass the data layer so the sitemap proxy can read the `frontend_url` setting.
export const handlers = createHandlers(nextpress.config, nextpress.data);
