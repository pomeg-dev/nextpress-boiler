import { Suspense } from "react";
import { Feed } from "./components/Feed";
import { getPosts, getTaxTerms } from "@/lib/wp/posts";

export async function archive_feed(props: any) {
  type ParamsType = {
    is_archive: boolean;
    page: number;
    per_page: number | string;
  };
  const params: ParamsType = {
    is_archive: true,
    page: 1,
    per_page: props.data.number_of_posts,
  };
  const firstPosts = await getPosts(props.data.post_type, params).catch(() => ({
    default: () => <div>Posts not found</div>,
  }));

  if (props.data.taxonomy_filters) {
    await Promise.all(
      props.data.taxonomy_filters.map(
        async (taxItem: { taxonomy: string }, i: string | number) => {
          props.data.taxonomy_filters[i].terms = await getTaxTerms(
            taxItem.taxonomy
          );
        }
      )
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Feed data={props.data} firstPosts={firstPosts} />
    </Suspense>
  );
}
