import { getPosts, getRestPosts } from "@/lib/wp/posts";
import React from "react";
import { FeaturedPosts } from "./components/FeaturedPosts";

interface ParamsType {
  is_archive: boolean,
  per_page: number|string,
  categories?: any,
  tags?: any,
}

export async function featured_posts(props: any) {
  const {
    heading,
    block_type,
    post_type_rest,
    category,
    tag,
    number_posts,
    featured_posts,
    slides_to_show,
    theme
  } = props.data;

  let posts = [];
  if (block_type === "automatic") {
    const params: ParamsType = {
      is_archive: true,
      per_page: number_posts == 0 ? 100 : number_posts,
    };

    if (category) {
      params.categories = category;
    }

    if (tag) {
      params.tags = tag;
    }

    posts = await getRestPosts(post_type_rest, params);
  } else {
    posts = await getPosts({"post__in": featured_posts});
  }

  if (!posts || posts.length < 0) {
    return (<div>Posts not found</div>);
  }

  return (
    <FeaturedPosts
      posts={posts}
      heading={heading}
      slidesToShow={parseInt(slides_to_show)}
    />
  );
}
