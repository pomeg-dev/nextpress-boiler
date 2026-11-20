import PostHero from "@ui/components/organisms/default/PostHero";
import classNames from "classnames";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

// Placed once in Templates → Post → Before Content: reads the post it is
// rendered for from `data.current_post`. A server component, so only the
// fields below reach the client, not the whole post.
export function PostHeroBlock(props: any) {
  const { show_image, show_excerpt, current_post: post } = props.data;
  // Unset (a template saved before the field existed) means on.
  const on = (value: unknown) => value !== false && value !== 0 && value !== "0";

  return (
    <PostHero
      title={post?.title}
      date={post?.date}
      excerpt={on(show_excerpt) ? post?.excerpt : undefined}
      image={on(show_image) ? post?.featured_image?.url || post?.image?.full : undefined}
      categories={(post?.category_names ?? []).filter((name: string) => name !== "Uncategorized")}
      themes={post?.terms?.theme}
      code={post?.id}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block post-hero", props.className)}
      id={props.id}
    />
  );
}
