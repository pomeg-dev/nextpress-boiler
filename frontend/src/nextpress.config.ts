import { createNextpress } from "@pomeg-dev/nextpress-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export const nextpress = createNextpress({
  apiUrl,
  // Wins over WordPress `frontend_url`, which must stay empty in Docker dev.
  frontendUrl: process.env.NEXT_PUBLIC_SITE_URL,
  // Same value as NEXTPRESS_CLIENT_SECRET in wp-config.php.
  secret: process.env.NEXTPRESS_CLIENT_SECRET,
  settings: {
    // Read by layout.tsx, beyond the package's base keys.
    extraKeys: ["enable_user_flow", "default_language"],
  },
  // Core columns/groups use the theme's spacing token and container.
  coreBlocks: {
    columnGap: "var(--space-md)",
    groupInnerClassName: "container",
    // Every alignment renders in the page container: --pagewidth 1680px less
    // --space-margin (4vw a side, 4rem max). Update if alignwide/full get styles.
    imageSizes: {
      full: "(min-width: 1680px) 1552px, 92vw",
      wide: "(min-width: 1680px) 1552px, 92vw",
      content: "(min-width: 1680px) 1552px, 92vw",
    },
  },
  // trailingSlash matches next.config.js (default true).
  cacheWarmer: {
    blocks: [
      "core/paragraph",
      "core/heading",
      "core/image",
      "core/group",
      "core/columns",
      "core/column",
    ],
  },
  seo: {
    indexable: process.env.VERCEL_ENV === "production",
    robotsDisallow: ["/magazine/module", "/themes"],
    sitemaps: ["sitemap.xml", "post-sitemap.xml", "page-sitemap.xml", "program-sitemap.xml"],
  },
});

export const {
  getPosts,
  getPostByPath,
  getTaxTerms,
  getTaxTerm,
  getSettings,
  getBlockTheme,
} = nextpress.data;
