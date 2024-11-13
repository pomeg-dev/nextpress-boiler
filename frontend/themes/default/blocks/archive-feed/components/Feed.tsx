"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBox } from "./SearchBox";
import { TaxonomyFilter } from "./TaxonomyFilter";
import { PostsList } from "./PostsList";
import { Pagination } from "./Pagination";
import { PostCount } from "./PostCount";
import Link from "next/link";
import { getPosts } from "@/lib/wp/posts";

type Props = {
  data: {
    post_type_rest: string;
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
  };
  firstPosts?: [];
};

export function Feed({ data, firstPosts }: Props) {
  const [totalPosts, setTotalPosts] = useState(data.number_of_posts);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState(firstPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [taxFilters, setTaxFilters] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const router = useRouter();

  const updateUrl = (params: any) => {
    delete params.is_archive;
    delete params.per_page;
    delete params.exclude;
    if (params.page === 1 || loadMore) {
      delete params.page;
    }
    const searchParams = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    router.push(searchParams, { scroll: false });
  };

  useEffect(() => {
    interface ParamsType {
      is_archive: boolean;
      search?: string;
      page: number;
      per_page: number | string;
      [key: string]: any;
    }
    const params: ParamsType = {
      is_archive: true,
      page: currentPage,
      per_page: data.number_of_posts,
    };

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

    getPosts(data.post_type_rest, params, true)
      .then((response) => {
        const totalPosts =
          response.headers.get("X-WP-Total") ?? data.number_of_posts;
        const totalPages = response.headers.get("X-WP-TotalPages") ?? 1;
        const postsArray =
          data.load_more && loadMore
            ? posts?.concat(response.data)
            : response.data;
        setTotalPosts(totalPosts);
        setTotalPages(totalPages);
        setPosts(postsArray);
      })
      .catch((err) => console.log(err));
  }, [currentPage, taxFilters, searchTerm]);

  return (
    <div className="archive-feed container py-[40px]">
      <div className="archive-container relative">
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
              <Link
                href=""
                className="button"
                onClick={() => {
                  setCurrentPage(1);
                  setSearchTerm("");
                  setTaxFilters([]);
                  setLoadMore(false);
                }}
              >
                Reset
              </Link>
            </div>
          )}
        </div>
        {data.show_post_count && (
          <PostCount
            postType={data.post_type_rest}
            totalPosts={totalPosts}
            totalPages={totalPages}
            perPage={data.number_of_posts}
            currentPage={currentPage}
            isLoadMore={data.load_more === "load_more"}
          />
        )}
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
            <Link
              href=""
              onClick={() => {
                setCurrentPage(currentPage + 1);
                setLoadMore(true);
              }}
            >
              {data.load_more_text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
