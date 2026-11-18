"use client";

import Link from "next/link";
import PostCard from "@ui/components/molecules/PostCard";

export function PostsList({ posts }: {
  posts: any;
}) {
  return (
    <div className="archive-posts">
      <div
        className="relative my-lg grid w-full grid-cols-1 items-stretch gap-x-sm gap-y-md md:grid-cols-2 lg:grid-cols-3"
      >
        {posts &&
          posts.map((post: any, index: number) => {
            return (
              <div className="archive-post-item flex flex-col" key={index}>
                <Link href={post.path} className="block h-full no-underline">
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