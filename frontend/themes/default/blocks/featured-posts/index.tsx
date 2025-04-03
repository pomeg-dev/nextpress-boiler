import { getPosts } from "@/lib/wp/posts";
import React from "react";
import classNames from "classnames";
import FeaturedPosts from "@ui/components/organisms/default/FeaturedPosts";
import { Cards, Post, WPQuery } from "@/lib/types";

export async function FeaturedPostsBlock(props: any) {
  const {
    heading,
    block_type,
    post_type,
    button,
    category,
    tag,
    number_posts,
    featured_posts,
    slides_to_show,
    top_spacer,
    bottom_spacer
  } = props.data;

  let posts = [];
  if (block_type === "automatic") {
    const params: WPQuery = {
      post_type: post_type ?? 'post',
      per_page: number_posts == 0 ? -1 : parseInt(number_posts),
    };

    if (category) {
      params.category_name = category;
    }

    if (tag) {
      params.tag_name = tag;
    }

    posts = await getPosts(params);
  } else {
    posts = await getPosts({
      "post__in": featured_posts,
      "orderby": "post__in"
    });

    if (posts) {
      posts.map((post: Post) => {
        switch (post.type.id) {
          default:
            post.card = "PostCard";
        }
      });
    }
  }

  let card: Cards = "PostCard";

  if (!posts || posts.length < 0) {
    return (<div>Posts not found</div>);
  }

  return (
    <FeaturedPosts
      posts={posts}
      heading={heading}
      button={button}
      slides_to_show={slides_to_show}
      top_spacer={top_spacer}
      bottom_spacer={bottom_spacer}
      card={card}
      className={classNames(
        "custom-block featured-posts",
        props.className
      )}
      id={props.id}
    />
  );
}
