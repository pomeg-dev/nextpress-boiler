import { getPosts } from "@/nextpress.config";
import React from "react";
import classNames from "classnames";
import FeaturedPosts from "@ui/components/organisms/default/FeaturedPosts";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";
import { Post, WPQuery } from "@pomeg-dev/nextpress-client/types";

// Size of each candidate query. Ranking happens within these posts.
const POOL = 12;

// Shared terms between two posts: a category counts double, a theme once.
const score = (post: any, current: any) => {
  const shared = (a: string[] = [], b: string[] = []) => a.filter((name) => b.includes(name)).length;
  return (
    2 * shared(post.category_names, current.category_names) +
    shared(post.terms?.theme, current.terms?.theme)
  );
};

// Placed in Templates → Post → After Content: reads the post it is rendered
// for from `data.current_post`. Candidates are the post's category siblings
// plus the latest posts (so a lone category still fills the row), ranked by
// shared categories and themes, then by date.
export async function RelatedPostsBlock(props: any) {
  const { heading, number_posts, button, current_post: current } = props.data;
  const count = parseInt(number_posts) || 3;

  const base: WPQuery = {
    post_type: current?.type?.id || "post",
    per_page: POOL,
    ...(current?.id && { post__not_in: [current.id] }),
  };
  const categories = (current?.categories ?? []).map((term: { slug: string }) => term.slug);

  const [siblings, latest] = await Promise.all([
    categories.length ? getPosts({ ...base, filter_category: categories }).catch(() => []) : [],
    getPosts(base).catch(() => []),
  ]);

  const seen = new Set<number>();
  const posts = [...(siblings || []), ...(latest || [])]
    .filter((post: Post) => !seen.has(post.id) && seen.add(post.id))
    .map((post: Post) => ({ post, score: current ? score(post, current) : 0 }))
    .sort((a, b) => b.score - a.score || +new Date(b.post.date) - +new Date(a.post.date))
    .slice(0, count)
    .map(({ post }) => post);

  if (!posts.length) return null;

  return (
    <FeaturedPosts
      posts={posts}
      heading={heading}
      button={button}
      card="PostCard"
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block related-posts", props.className)}
      id={props.id}
    />
  );
}
