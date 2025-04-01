import { Feed } from "./components/Feed";
import { getPosts, getTaxTerms } from "@/lib/wp/posts";
import { WPQuery } from "@/lib/types";

export async function ArchiveFeedBlock(props: any) {
  const {
    post_type,
    number_of_posts,
    taxonomy_filters
  } = props.data;

  const params: WPQuery = {
    page: 1,
    post_type: post_type,
    per_page: number_of_posts,
    include_content: true,
  };
  const firstPosts = await getPosts(params).catch(() => ({
    default: () => <div>Posts not found</div>,
  }));

  if (taxonomy_filters) {
    await Promise.all(
      taxonomy_filters.map(
        async (taxItem: { taxonomy: string }, i: string | number) => {
          props.data.taxonomy_filters[i].terms = await getTaxTerms(
            taxItem.taxonomy
          );
        }
      )
    );
  }

  return (
    <Feed data={props.data} firstPosts={firstPosts} />
  );
}
