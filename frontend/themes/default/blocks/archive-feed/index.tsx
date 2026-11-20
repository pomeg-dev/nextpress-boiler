import Parser from "html-react-parser";
import { getPosts, getTaxTerms } from "@/nextpress.config";
import { Feed } from "@ui/components/lazy";
import { FeedResult, INITIAL_STATE, feedQuery } from "@ui/components/archive/query";

// The first page and the filter terms load in parallel, through the cached
// `getPosts`, so the feed is in the server HTML.
export async function ArchiveFeedBlock(props: any) {
  const data = { ...props.data };

  const [first, taxonomyFilters] = await Promise.all([
    getPosts(feedQuery(data, INITIAL_STATE), true)
      .then(({ posts, headers }: { posts: any[]; headers: Headers }): FeedResult => ({
        posts,
        total: Number(headers.get("X-WP-Total") ?? posts.length),
        totalPages: Number(headers.get("X-WP-TotalPages") ?? 1),
      }))
      // The feed fetches in the browser instead.
      .catch(() => undefined),
    Promise.all(
      (data.taxonomy_filters || []).map(async (taxItem: { taxonomy: string; categories?: any[] }) => ({
        ...taxItem,
        terms: taxItem.categories ?? (await getTaxTerms(taxItem.taxonomy)),
      }))
    ),
  ]);
  if (data.taxonomy_filters) data.taxonomy_filters = taxonomyFilters;

  const { heading, description, ...feedData } = data;
  const intro = (heading || description) && (
    <>
      {heading && <div className="flow">{Parser(heading)}</div>}
      {description && <p className="body-lg measure text-muted">{Parser(description)}</p>}
    </>
  );

  return <Feed data={feedData} first={first} intro={intro} />;
}
