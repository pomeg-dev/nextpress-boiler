import { createNextpress } from "@pomeg-dev/nextpress-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export const nextpress = createNextpress({
  apiUrl,
  // Same value as NEXTPRESS_CLIENT_SECRET in wp-config.php.
  secret: process.env.NEXTPRESS_CLIENT_SECRET,
  settings: {
    // Read by layout.tsx, beyond the package's base keys.
    extraKeys: ["enable_user_flow", "default_language"],
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
