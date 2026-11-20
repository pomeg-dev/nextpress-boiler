import { WPQuery } from "@pomeg-dev/nextpress-client/types";

// The archive feed's query, shared by the server (first page, through the
// cached `getPosts`) and the browser (every later page, through `fetchPosts`).
// Both build it here, so the server's first page can seed the browser cache.

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

// Same serialisation as the package's `getPosts`.
function postsUrl(params: WPQuery) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (typeof value === "boolean") query.append(key, value ? "1" : "0");
    else query.append(key, Array.isArray(value) ? value.join(",") : String(value));
  });
  return `${process.env.NEXT_PUBLIC_API_URL}/wp-json/nextpress/posts?${query}`;
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
        return response.json().then((posts) => ({
          posts,
          total: Number(response.headers.get("X-WP-Total") ?? posts.length),
          totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 1),
        }));
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
