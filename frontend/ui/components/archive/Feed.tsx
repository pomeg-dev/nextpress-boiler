"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBox } from "./SearchBox";
import { TaxonomyFilter } from "./TaxonomyFilter";
import { PostsList } from "./PostsList";
import { Pagination } from "./Pagination";
import { PostCount } from "./PostCount";
import {
  FeedResult,
  FeedState,
  INITIAL_STATE,
  cachedPosts,
  feedQuery,
  fetchPosts,
  seedPosts,
} from "./query";
import Button from "@ui/components/atoms/Button";
import BlockWrapper, { getBlockOptions } from "../organisms/default/BlockWrapper";

type Props = {
  data: {
    post_type: string;
    number_of_posts: string;
    show_search: boolean;
    search_field_label: string;
    search_field_placeholder: string;
    taxonomy_filters: any;
    load_more: string;
    load_more_text: string;
    show_post_count: boolean;
    show_reset: boolean;
    update_url: boolean;
    redirect_on_filter?: boolean;
    tax_query?: any;
  };
  // The first page, rendered on the server.
  first?: FeedResult;
  // Heading and description, parsed on the server.
  intro?: React.ReactNode;
};

// Wait this long before swapping posts for skeletons: a quick response
// replaces the posts without a flash.
const SKELETON_DELAY = 150;
const SEARCH_DEBOUNCE = 300;

// The server renders the first page. The URL query (written by `update_url`)
// is read after hydration: reading it during render would make Next render
// the whole feed in the browser only. Pages and filters already fetched, and
// the next page (prefetched), show at once.
export function Feed({ data, first, intro }: Props) {
  const router = useRouter();
  const isPagination = data.load_more === "pagination";
  const isLoadMore = data.load_more === "load_more";
  const perPage = Number(data.number_of_posts) || 12;

  const [state, setState] = useState<FeedState>(INITIAL_STATE);
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState<FeedResult | undefined>(() => {
    if (first) seedPosts(feedQuery(data, INITIAL_STATE), first);
    return first;
  });
  const [posts, setPosts] = useState<any[]>(first?.posts ?? []);
  const [loading, setLoading] = useState(!first);
  const [showSkeleton, setShowSkeleton] = useState(!first);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // True when the visitor changed the state; false when it came from the URL.
  const userChange = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  const params = useMemo(() => feedQuery(data, state), [data, state]);

  // Visitor changes. Any change but the page starts again from page 1.
  const update = useCallback((change: Partial<FeedState>) => {
    userChange.current = true;
    setState((current) => ({ ...current, page: 1, ...change }));
  }, []);

  // URL → state, after hydration and on back/forward.
  useEffect(() => {
    const fromUrl = () => {
      const url = new URLSearchParams(window.location.search);
      const page = parseInt(url.get("page") ?? "");
      const search = (data.show_search && url.get("search")) || "";
      userChange.current = false;
      setSearchInput(search);
      setState({
        page: isPagination && page > 1 ? page : 1,
        search,
        filters: data.taxonomy_filters?.length
          ? Array.from(url.entries())
              .filter(([key]) => key.startsWith("filter_"))
              .map(([key, value]) => ({ taxonomy: key.replace("filter_", ""), terms: value }))
          : [],
      });
    };
    if (window.location.search) fromUrl();
    window.addEventListener("popstate", fromUrl);
    return () => window.removeEventListener("popstate", fromUrl);
  }, [data.show_search, data.taxonomy_filters, isPagination]);

  // Search → state, once typing pauses.
  useEffect(() => {
    if (searchInput === state.search) return;
    const timer = setTimeout(() => update({ search: searchInput }), SEARCH_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [searchInput, state.search, update]);

  // State → posts.
  useEffect(() => {
    // Load more adds each page to the posts already shown.
    const append = isLoadMore && state.page > 1;
    const show = (response: FeedResult) => {
      setResult(response);
      setPosts((current) => (append ? [...current, ...response.posts] : response.posts));
      setLoading(false);
      setShowSkeleton(false);
      setFailed(false);
      // Warm the next page while the visitor reads this one.
      if ((isPagination || isLoadMore) && state.page < response.totalPages) {
        const next = feedQuery(data, { ...state, page: state.page + 1 });
        setTimeout(() => fetchPosts(next).catch(() => {}), 500);
      }
    };

    const cached = cachedPosts(params);
    if (cached) {
      show(cached);
      return;
    }

    let current = true;
    setLoading(true);
    setFailed(false);
    const timer = setTimeout(() => current && setShowSkeleton(true), SKELETON_DELAY);
    fetchPosts(params)
      .then((response) => current && show(response))
      .catch(() => {
        if (!current) return;
        setLoading(false);
        setShowSkeleton(false);
        setFailed(true);
      });
    return () => {
      current = false;
      clearTimeout(timer);
    };
    // `params` is derived from `data` and `state`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, attempt]);

  // State → URL, for the visitor's changes only.
  useEffect(() => {
    if (!userChange.current) return;

    if (data.redirect_on_filter && state.filters.length) {
      const target = state.filters[0].terms;
      router.push(window.location.href.replace(/\/[^/]*\/$/, `/${target}/`));
      return;
    }
    if (!data.update_url) return;

    const query = new URLSearchParams();
    if (state.search) query.set("search", state.search);
    state.filters.forEach((filter) => filter.terms && query.set(`filter_${filter.taxonomy}`, filter.terms));
    if (isPagination && state.page > 1) query.set("page", String(state.page));
    const url = window.location.pathname + (query.size ? `?${query}` : "");
    if (url === window.location.pathname + window.location.search) return;

    // Typing replaces the history entry; pages and filters add one each.
    // The native history API skips the server request a router push makes.
    const typing = new URLSearchParams(window.location.search).get("search") !== (state.search || null);
    window.history[typing ? "replaceState" : "pushState"](null, "", url);
  }, [state, data.redirect_on_filter, data.update_url, isPagination, router]);

  const filterValue = (taxonomy: string) =>
    state.filters.find((filter) => filter.taxonomy === taxonomy)?.terms ??
    data.tax_query?.find((filter: any) => filter.taxonomy === taxonomy)?.term ??
    "";

  const setFilter = (taxonomy: string, terms: string) =>
    update({
      filters: [
        ...state.filters.filter((filter) => filter.taxonomy !== taxonomy),
        ...(terms ? [{ taxonomy, terms }] : []),
      ],
    });

  const goToPage = (page: number) => {
    update({ page });
    // The new page replaces this one: bring its top into view.
    const top = listRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) listRef.current?.scrollIntoView({ block: "start" });
  };

  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 1;

  return (
    <BlockWrapper
      blockOptions={getBlockOptions(data)}
      id="archive-feed"
      className="archive-feed"
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-xl)" }}
    >
    <div className="container">
      <div className="archive-container relative">
        {/* Intro, then one wrapping row of controls (button groups take a line
            each), then Reset and the count. */}
        <div className="flex flex-col gap-md border-b border-rule pb-md">
          {intro}
          <div className="archive-filters flex flex-wrap items-end gap-sm">
            {data.show_search && (
              <SearchBox
                label={data.search_field_label}
                placeholder={data.search_field_placeholder}
                value={searchInput}
                onChange={setSearchInput}
              />
            )}
            {data.taxonomy_filters &&
              data.taxonomy_filters.map((item: any, index: number) => (
                <TaxonomyFilter
                  key={index}
                  taxonomy={item.taxonomy}
                  terms={item.terms}
                  label={item.label}
                  placeholder={item.placeholder}
                  type={item.type}
                  value={filterValue(item.taxonomy)}
                  onChange={(term) => setFilter(item.taxonomy, term)}
                />
              ))}
          </div>
          {(data.show_reset || data.show_post_count) && (
            <div className="flex flex-wrap items-center justify-between gap-sm">
              {data.show_reset && (
                <div className="filter-reset">
                  <Button
                    type="button"
                    style="no-fill"
                    size="md"
                    onClick={() => {
                      setSearchInput("");
                      update({ search: "", filters: [] });
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
              {data.show_post_count && result && (
                <PostCount
                  postType={data.post_type}
                  totalPosts={total}
                  totalPages={totalPages}
                  perPage={perPage}
                  currentPage={state.page}
                  isLoadMore={isLoadMore}
                />
              )}
            </div>
          )}
        </div>
        <div ref={listRef} className="scroll-mt-[var(--header-h)]">
          {failed ? (
            <div role="alert" className="my-lg flex flex-wrap items-center gap-sm">
              <p>The posts didn&rsquo;t load.</p>
              <Button type="button" size="md" style="secondary" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
            </div>
          ) : (
            <PostsList
              // Load more keeps the posts shown and adds skeletons after them.
              posts={showSkeleton && !(isLoadMore && state.page > 1) ? [] : posts}
              skeletons={showSkeleton ? perPage : 0}
              pending={loading}
            />
          )}
        </div>
        {isPagination && (
          <Pagination
            totalPages={totalPages}
            currentPage={state.page}
            setCurrentPage={goToPage}
          />
        )}
        {isLoadMore && state.page < totalPages && (
          <div className="archive-load-more flex justify-center">
            <Button
              type="button"
              size="md"
              style="primary"
              disabled={loading}
              onClick={() => update({ page: state.page + 1 })}
            >
              {data.load_more_text}
            </Button>
          </div>
        )}
      </div>
    </div>
    </BlockWrapper>
  );
}
