import dynamic from 'next/dynamic';
import { getPosts, getTaxTerms } from "@/lib/wp/posts";
import { WPQuery } from "@/lib/types";

const Feed = dynamic(
  () => import("../../../../ui/components/archive/Feed").then(mod => ({ default: mod.Feed })),
  {
    loading: () => <div className="animate-pulse rounded bg-black/50" />,
  }
);

export async function ArchiveFeedBlock(props: any) {
  let data = { ...props.data };

  const params: WPQuery = {
    page: 1,
    post_type: data?.post_type || 'post',
    per_page: data?.number_of_posts || 12,
    include_content: true,
  };

  if (data?.tax_query && data.tax_query.length > 0) {
    data.tax_query.map((filter: any) => {
      params[`filter_${filter.taxonomy}`] = filter.term;
    });
  }

  const firstPosts = await getPosts(params).catch(() => ({
    default: () => <div>Posts not found</div>,
  }));

  if (data.taxonomy_filters) {
    const updatedTaxonomyFilters = await Promise.all(
      data.taxonomy_filters.map(async (taxItem: { taxonomy: string, categories?: any[] }) => {
        if (taxItem?.categories) {
          return {
            ...taxItem,
            terms: taxItem.categories
          }
        } else {
          const terms = await getTaxTerms(taxItem.taxonomy);
          return {
            ...taxItem,
            terms: terms
          };
        }
      })
    );
    data.taxonomy_filters = updatedTaxonomyFilters;
  }

  return (
    <Feed data={data} firstPosts={firstPosts} />
  );
}
