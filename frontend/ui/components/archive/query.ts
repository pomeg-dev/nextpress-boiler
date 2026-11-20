import { WPQuery } from "@pomeg-dev/nextpress-client/types";

// The archive feed's query, shared by the server (first page, through the
// cached `getPosts`) and the browser (every later page, through `fetchPosts`
// and the `/api/posts/` route). All build it here, so the server's first page
// can seed the browser cache.

export type TaxFilter = { taxonomy: string; terms: string };

export type FeedState = {
  page: number;
  search: string;
  filters: TaxFilter[];
};

export type FeedResult = {
  posts: any[];
  total: number;
  totalPages: number;
};

export const INITIAL_STATE: FeedState = { page: 1, search: "", filters: [] };

export function feedQuery(
  data: { post_type?: string; number_of_posts?: string | number; tax_query?: any[] },
  { page, search, filters }: FeedState
): WPQuery {
  const params: WPQuery = {
    post_type: data.post_type || "post",
    page,
    per_page: Number(data.number_of_posts) || 12,
    // Cards need no Yoast head: it is ~85% of each post's JSON.
    include_metadata: false,
  };

  if (!filters.length) {
    data.tax_query?.forEach((filter: any) => {
      params[`filter_${filter.taxonomy}`] = filter.term;
    });
  }
  if (search) {
    params.search = search.replace(/-|  /g, "+");
  }
  filters.forEach((filter) => {
    if (filter.taxonomy && filter.terms) {
      params[`filter_${filter.taxonomy}`] = filter.terms;
    }
  });

  return params;
}

// Post types a feed may list. `/api/posts/` refuses any other: WordPress
// would answer for internal types too (menu items). Add a site's own types.
const FEED_POST_TYPES = ["post", "page", "resource"];
const SLUG = /^[a-z0-9_-]+$/;
// WordPress keeps non-ASCII slugs percent-encoded.
const TERMS = /^[a-z0-9_%-]+(,[a-z0-9_%-]+)*$/;
const isInt = (value: number, min: number, max: number) =>
  Number.isInteger(value) && value >= min && value <= max;

// `/api/posts/`'s query: only what `feedQuery` sends, within limits, else null.
// Search is normalised so equivalent searches share a cache entry.
export function parseFeedQuery(params: URLSearchParams): WPQuery | null {
  const postType = params.get("post_type") ?? "post";
  const page = Number(params.get("page") ?? 1);
  const perPage = Number(params.get("per_page") ?? 12);
  if (!FEED_POST_TYPES.includes(postType) || !isInt(page, 1, 100) || !isInt(perPage, 1, 50)) {
    return null;
  }

  const query: WPQuery = { post_type: postType, page, per_page: perPage, include_metadata: false };
  for (const [key, value] of Array.from(params.entries())) {
    if (key.startsWith("filter_")) {
      const taxonomy = key.slice("filter_".length);
      if (!SLUG.test(taxonomy) || !TERMS.test(value)) return null;
      query[`filter_${taxonomy}`] = value;
    } else if (key === "search") {
      const search = value.trim().replace(/\s+/g, " ").toLowerCase().slice(0, 100);
      if (search) query.search = search;
    } else if (!["post_type", "page", "per_page", "include_metadata"].includes(key)) {
      return null;
    }
  }
  return query;
}

// What a feed card renders (PostCard): about a fifth of the post's JSON.
export const toFeedPost = ({ id, title, path, excerpt, category_names, image, acf_data }: any) => ({
  id,
  title,
  path,
  excerpt,
  category_names,
  image: image ? { full: image.full } : image,
  acf_data,
});

// `getPosts(query, true)`'s response as the feed's result.
export const toFeedResult = ({ posts, headers }: { posts: any[]; headers: Headers }): FeedResult => ({
  posts: posts.map(toFeedPost),
  total: Number(headers.get("X-WP-Total") ?? posts.length),
  totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
});

function postsUrl(params: WPQuery) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (typeof value === "boolean") query.append(key, value ? "1" : "0");
    else query.append(key, Array.isArray(value) ? value.join(",") : String(value));
  });
  return `/api/posts/?${query}`;
}

// Responses by URL for this page view: revisiting a page or filter, or
// opening a prefetched one, is instant.
const cache = new Map<string, Promise<FeedResult>>();
const settled = new Map<string, FeedResult>();

export function fetchPosts(params: WPQuery): Promise<FeedResult> {
  const url = postsUrl(params);
  let request = cache.get(url);
  if (!request) {
    request = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Posts request failed: ${response.status}`);
        return response.json() as Promise<FeedResult>;
      })
      .then((result) => {
        settled.set(url, result);
        return result;
      })
      .catch((error) => {
        cache.delete(url);
        throw error;
      });
    cache.set(url, request);
  }
  return request;
}

// A response already in hand, so the feed can show it without a loading state.
export const cachedPosts = (params: WPQuery) => settled.get(postsUrl(params));

export function seedPosts(params: WPQuery, result: FeedResult) {
  const url = postsUrl(params);
  if (!settled.has(url)) {
    settled.set(url, result);
    cache.set(url, Promise.resolve(result));
  }
}
