import React from "react";
import classNames from "classnames";
import { Cards, LinkItemProps, Post } from "@/lib/types";
import Parser from "html-react-parser";
import PostCard from "../../molecules/PostCard";
import Button from "../../atoms/Button";

type FeaturedPostsProps = {
  posts: Post[];
  card: Cards;
  heading?: string;
  button?: LinkItemProps;
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  className?: string;
  id?: string;
};

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  posts,
  card = "PostCard",
  heading,
  button,
  top_spacer = "xl",
  bottom_spacer = "xl",
  className,
  id,
}) => {
  const componentMap: Record<string, React.ElementType> = {
    PostCard,
  };

  const DynamicComponent = ({ componentName, data }: { componentName: string; data: any }) => {
    const SelectedComponent = componentMap[componentName];
    if (!SelectedComponent) return <div>Invalid component name: {componentName}</div>;
    return <SelectedComponent post={data} />;
  };

  // Adapt the column count to how many posts there are so 1–2 posts don't leave
  // empty cells. Static class strings keep them detectable by the CSS scanner.
  const mdColsClass =
    ({ 1: "md:grid-cols-1", 2: "md:grid-cols-2" } as Record<number, string>)[posts.length] ??
    "md:grid-cols-3";

  return (
    <div className={classNames("break-out overflow-hidden", className)} id={id}>
      <div
        className={classNames(
          "container w-full max-w-full max-h-screen min-h-0 min-w-0",
          `pb-${bottom_spacer}`,
          `pt-${top_spacer}`
        )}
      >
        <div className="flex flex-wrap items-end justify-between">
          {heading && <div className="heading text-primary">{Parser(heading)}</div>}
          <div className="flex gap-2.5">
            {button && <Button linkItem={button} style="secondary" size="md" circular={true} />}
          </div>
        </div>
        <div className={classNames("mt-4 grid grid-cols-1 gap-4", mdColsClass)}>
          {posts.map((post: any, i: number) => {
            return (
              <div className="featured-posts-item" key={post.ID}>
                <DynamicComponent componentName={post?.card || card} data={post} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;
