import Parser from "html-react-parser";
import { getPosts, getTaxTerm, getTaxTerms } from "@/nextpress.config";
import { FeedResult, INITIAL_STATE, feedQuery } from "@ui/components/archive/query";
import { notFound } from "next/navigation";
import { Feed } from "@ui/components/lazy";

export default async function CategoryArchive({
  taxonomy,
  term
}: {
  taxonomy: string;
  term: string;
}) {
  const archiveData = {
    post_type: 'post',
    number_of_posts: '12',
    show_search: false,
    search_field_label: '',
    search_field_placeholder: '',
    load_more: 'pagination',
    load_more_text: 'Load More',
    show_post_count: false,
    show_reset: false,
    update_url: false,
    redirect_on_filter: true,
    tax_query: [
      { taxonomy: taxonomy, term: term }
    ],
  };

  const [termObject, allTerms, first] = await Promise.all([
    getTaxTerm(taxonomy, term),
    getTaxTerms(taxonomy),
    getPosts(feedQuery(archiveData, INITIAL_STATE), true)
      .then(({ posts, headers }: { posts: any[]; headers: Headers }): FeedResult => ({
        posts,
        total: Number(headers.get("X-WP-Total") ?? posts.length),
        totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
      }))
      .catch(() => undefined),
  ]);
  if (!termObject || termObject.length < 1) {
    notFound();
  }

  const feedData = {
    ...archiveData,
    taxonomy_filters: [
      {
        label: "",
        placeholder: "All",
        taxonomy: taxonomy,
        terms: allTerms,
        type: "select"
      }
    ]
  };

  return (
    <main id="main" data-pageurl={`${taxonomy}/${term}`} data-termid={termObject.term_id}>
      <Feed
        data={feedData}
        first={first}
        intro={
          <>
            <div className="flow">
              <h1><span className="text-heading-xl">{termObject.name}</span></h1>
            </div>
            {termObject.description && (
              <p className="body-lg measure text-muted">{Parser(termObject.description)}</p>
            )}
          </>
        }
      />
    </main>
  );
}
