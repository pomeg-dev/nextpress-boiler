"use client";

import cn from "classnames";
import PostCard from "@ui/components/molecules/PostCard";

// The card's shape while its post loads: image, category pill, title lines.
const PostCardSkeleton = () => (
  <div className="post-card-skeleton flex h-full flex-col bg-surface-raised" aria-hidden="true">
    <div className="skeleton-block aspect-[3/2] w-full" />
    <div className="flex flex-col gap-2 p-sm">
      <div className="skeleton-block h-[1.4em] w-11/12" />
      <div className="skeleton-block h-[1.4em] w-2/3" />
    </div>
  </div>
);

export function PostsList({ posts, skeletons = 0, pending = false }: {
  posts: any[];
  skeletons?: number;
  // A request is in flight: the posts shown are about to change.
  pending?: boolean;
}) {
  return (
    <div className="archive-posts" aria-busy={pending}>
      <div
        className={cn(
          "relative my-lg grid w-full grid-cols-1 items-stretch gap-x-sm gap-y-md md:grid-cols-2 lg:grid-cols-3",
          "transition-opacity duration-[var(--dur-fast)]",
          pending && !skeletons && "opacity-60"
        )}
      >
        {posts.map((post: any) => (
          <div className="archive-post-item flex flex-col" key={post.id}>
            <PostCard post={post} href={post.path} />
          </div>
        ))}
        {Array.from({ length: skeletons }, (_, index) => (
          <div className="archive-post-item flex flex-col" key={`skeleton-${index}`}>
            <PostCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
