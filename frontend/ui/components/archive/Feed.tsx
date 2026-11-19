"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBox } from "./SearchBox";
import { TaxonomyFilter } from "./TaxonomyFilter";
import { PostsList } from "./PostsList";
import { Pagination } from "./Pagination";
import { PostCount } from "./PostCount";
import { getPosts } from "@/nextpress.config";
import { WPQuery } from "@pomeg-dev/nextpress-client/types";
import Button from "@ui/components/atoms/Button";
import Parser from "html-react-parser";
import Loader from "../atoms/Loader";
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
    heading?: string;
    description?: string;
    tax_query?: any;
  };
  firstPosts?: any[];
};

export function Feed({ data, firstPosts }: Props) {
  // The URL query (written by `update_url`) sets the starting page, search and filters.
  const urlParams = useSearchParams();
  const [totalPosts, setTotalPosts] = useState(data.number_of_posts);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState(firstPosts);
  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(urlParams.get("page") ?? "");
    return data.load_more === "pagination" && page > 1 ? page : 1;
  });
  const [searchTerm, setSearchTerm] = useState(() =>
    (data.show_search && urlParams.get("search")) || ""
  );
  const [taxFilters, setTaxFilters] = useState<any>(() => {
    if (!data.taxonomy_filters?.length) return [];
    return Array.from(urlParams.entries())
      .filter(([key]) => key.includes("filter_"))
      .map(([key, value]) => ({ taxonomy: key.replace("filter_", ""), terms: value }));
  });
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { post_type, number_of_posts, load_more, update_url, redirect_on_filter, tax_query } = data;

  useEffect(() => {
    setIsLoading(true);

    // Redirect if true.
    if (redirect_on_filter && taxFilters && taxFilters.length > 0) {
      const currentUrl = window.location.href;
      const filterTarget = taxFilters[0].terms;
      const newUrl = currentUrl.replace(/\/[^/]*\/$/, `/${filterTarget}/`);
      router.push(newUrl);
      return;
    }

    const params: WPQuery = {
      post_type,
      page: currentPage,
      per_page: parseInt(number_of_posts),
      include_content: true,
    };

    if (taxFilters.length < 1 && tax_query && tax_query.length > 0) {
      tax_query.map((filter: any) => {
        params[`filter_${filter.taxonomy}`] = filter.term;
      });
    }

    if (searchTerm) {
      params.search = searchTerm.replace(/-|  /g, "+");
    }

    taxFilters.forEach((filter: any) => {
      if (filter.taxonomy !== undefined && filter.terms) {
        params[`filter_${filter.taxonomy}`] = filter.terms;
      }
    });

    if (update_url) {
      const urlQuery: Record<string, any> = { ...params };
      delete urlQuery.post_type;
      delete urlQuery.per_page;
      delete urlQuery.exclude;
      delete urlQuery.include_content;
      if (urlQuery.page === 1 || loadMore) {
        delete urlQuery.page;
      }
      router.push("?" + new URLSearchParams(urlQuery).toString(), { scroll: false });
    }

    getPosts(params, true)
      .then((response) => {
        const totalPosts =
          response.headers.get("X-WP-Total") ?? number_of_posts;
        const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 1);
        setTotalPosts(totalPosts);
        setTotalPages(totalPages);
        setPosts((current) =>
          load_more && loadMore ? current?.concat(response.posts) : response.posts
        );
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
    // loadMore only ever changes together with currentPage or a filter.
  }, [currentPage, taxFilters, searchTerm, loadMore, post_type, number_of_posts, load_more, update_url, redirect_on_filter, tax_query, router]);

  return (
    <BlockWrapper
      blockOptions={getBlockOptions(data)}
      id="archive-feed"
      className="archive-feed"
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-xl)" }}
    >
    <div className="container">
      <Loader isLoading={isLoading} />
      <div className="archive-container relative">
        {data.heading &&
          <div className="flow mb-md">{Parser(data.heading)}</div>
        }
        <div className="flex flex-col justify-between gap-md border-b border-rule pb-md md:flex-row md:items-end">
          <div className="max-w-col-10 w-full">
            {data.description &&
              <p className="body-lg measure text-muted">{Parser(data.description)}</p>
            }
          </div>
          <div className="archive-filters flex flex-col gap-sm">
            {data.show_search && (
              <SearchBox
                label={data.search_field_label}
                placeholder={data.search_field_placeholder}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                setLoadMore={setLoadMore}
              />
            )}
            {data.taxonomy_filters &&
              data.taxonomy_filters.map((item: any, index: number) => (
                <TaxonomyFilter
                  key={index}
                  taxonomy={item.taxonomy}
                  terms={item.terms}
                  tax_query={data.tax_query}
                  label={item.label}
                  placeholder={item.placeholder}
                  type={item.type}
                  taxFilters={taxFilters}
                  setTaxFilters={setTaxFilters}
                  setCurrentPage={setCurrentPage}
                  setLoadMore={setLoadMore}
                />
              ))}
            {data.show_reset && (
              <div className="filter-reset">
                <Button
                  type="button"
                  style="primary"
                  size="md"
                  onClick={() => {
                    setCurrentPage(1);
                    setSearchTerm("");
                    setTaxFilters([]);
                    setLoadMore(false);
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
          {data.show_post_count && (
            <PostCount
              postType={data.post_type}
              totalPosts={totalPosts}
              totalPages={totalPages}
              perPage={data.number_of_posts}
              currentPage={currentPage}
              isLoadMore={data.load_more === "load_more"}
            />
          )}
        </div>
        {posts && <PostsList posts={posts} />}
        {data.load_more === "pagination" && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        {data.load_more === "load_more" && currentPage != totalPages && (
          <div className="archive-load-more flex justify-center">
            <Button
              type="button"
              size="md"
              style="primary"
              onClick={() => {
                setCurrentPage(currentPage + 1);
                setLoadMore(true);
              }}
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
