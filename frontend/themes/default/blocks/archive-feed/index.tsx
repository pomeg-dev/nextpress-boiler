import { getPosts, getTaxTerms } from "@/nextpress.config";
import { Feed } from "@ui/components/lazy";
import { INITIAL_STATE, feedQuery, toFeedResult } from "@ui/components/archive/query";

// The first page and the filter terms load in parallel, through the cached
// `getPosts`, so the feed is in the server HTML.
export async function ArchiveFeedBlock(props: any) {
  const data = { ...props.data };

  const [first, taxonomyFilters] = await Promise.all([
    getPosts(feedQuery(data, INITIAL_STATE), true)
      .then(toFeedResult)
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

  return <Feed data={data} first={first} />;
}
