import React, { Suspense } from "react";
import { FeaturedPosts } from "./components/FeaturedPosts";
import { getPosts } from "@/lib/wp/posts";
import { loadComponent } from "@/utils/component-loader";

export async function featured_posts(props: any) {
  if (!props.data.featured_posts) {
    return <div>Posts not found</div>;
  }
  const posts = await getPosts({ post__in: props.data.featured_posts });
  const Component = await loadComponent(
    props.data?.select_theme,
    "featured-posts",
    <FeaturedPosts posts={posts} />
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component posts={posts} />
    </Suspense>
  );
}
