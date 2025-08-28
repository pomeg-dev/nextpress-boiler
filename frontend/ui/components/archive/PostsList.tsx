"use client";

import Link from "next/link";
import PostCard from "@ui/components/molecules/PostCard";

export function PostsList({ posts }: {
  posts: any;
}) {
  return (
    <div className="archive-posts">
      <div
        className="relative my-[50px] grid w-full grid-cols-1 items-start gap-x-[19px] gap-y-[35px] md:grid-cols-2 lg:grid-cols-3"
      >
        {posts &&
          posts.map((post: any, index: number) => {
            return (
              <div className="archive-post-item flex flex-col" key={index}>
                <Link href={post.path}>
                  <PostCard post={post} />
                </Link>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}