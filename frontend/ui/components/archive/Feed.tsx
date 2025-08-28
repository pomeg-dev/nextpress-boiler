"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBox } from "./SearchBox";
import { TaxonomyFilter } from "./TaxonomyFilter";
import { PostsList } from "./PostsList";
import { Pagination } from "./Pagination";
import { PostCount } from "./PostCount";
import { getPosts } from "@/lib/wp/posts";
import { WPQuery } from "@/lib/types";
import Button from "@ui/components/atoms/Button";
import Parser from "html-react-parser";
import Loader from "../atoms/Loader";

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
  const [totalPosts, setTotalPosts] = useState(data.number_of_posts);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState(firstPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [taxFilters, setTaxFilters] = useState<any>([]);
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const updateUrl = (params: any) => {
    delete params.post_type;
    delete params.per_page;
    delete params.exclude;
    delete params.include_content;
    if (params.page === 1 || loadMore) {
      delete params.page;
    }
    const searchParams = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    router.push(searchParams, { scroll: false });
  };

  useEffect(() => {
    setIsLoading(true);

    // Redirect if true.
    if (data?.redirect_on_filter && taxFilters && taxFilters.length > 0) {
      const currentUrl = window.location.href;
      const filterTarget = taxFilters[0].terms;
      const newUrl = currentUrl.replace(/\/[^/]*\/$/, `/${filterTarget}/`);
      router.push(newUrl);
      return;
    }

    const params: WPQuery = {
      post_type: data.post_type,
      page: currentPage,
      per_page: parseInt(data.number_of_posts),
      include_content: true,
    };

    if (taxFilters.length < 1 && data.tax_query && data.tax_query.length > 0) {
      data.tax_query.map((filter: any) => {
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

    if (data.update_url) {
      updateUrl(JSON.parse(JSON.stringify(params)));
    }

    getPosts(params, true)
      .then((response) => {
        const totalPosts =
          response.headers.get("X-WP-Total") ?? data.number_of_posts;
        const totalPages = response.headers.get("X-WP-TotalPages") ?? 1;
        const postsArray =
          data.load_more && loadMore
            ? posts?.concat(response.posts)
            : response.posts;
        setTotalPosts(totalPosts);
        setTotalPages(totalPages);
        setPosts(postsArray);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [currentPage, taxFilters, searchTerm]);

  console.log(data);

  return (
    <div id="archive-feed" className="archive-feed container pb-8 pt-[160px]">
      <Loader isLoading={isLoading} />
      <div className="archive-container relative">
        {data.heading &&
          <div className="animation-slide-up [&_h1]:!mb-8">{Parser(data.heading)}</div>
        }
        <div className="animation-slide-up flex flex-col justify-between gap-4 border-b border-primary/20 pb-10 md:flex-row md:items-end">
          <div className="max-w-col-10 w-full">
            {data.description &&
              <p className="text-primary/70">{Parser(data.description)}</p>
            }
          </div>
          <div className="archive-filters flex flex-col gap-4">
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
          <div className="archive-load-more">
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
  );
}
