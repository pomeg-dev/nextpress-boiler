import React from "react";
import classNames from "classnames";
import { BlockOptions, Cards, LinkItemProps, Post } from "@pomeg-dev/nextpress-client/types";
import Parser from "html-react-parser";
import PostCard from "../../molecules/PostCard";
import Button from "../../atoms/Button";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type FeaturedPostsProps = {
  posts: Post[];
  card: Cards;
  heading?: string;
  button?: LinkItemProps;
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  blockOptions?: BlockOptions;
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
  blockOptions,
  className,
  id,
}) => {
  const componentMap: Record<string, React.ElementType> = {
    PostCard,
  };

  const DynamicComponent = ({ componentName, data }: { componentName: string; data: any }) => {
    const SelectedComponent = componentMap[componentName];
    if (!SelectedComponent) return <div>Invalid component name: {componentName}</div>;
    return <SelectedComponent post={data} href={data?.path} />;
  };

  // Adapt the column count to how many posts there are so 1–2 posts don't leave
  // empty cells. Static class strings keep them detectable by the CSS scanner.
  const mdColsClass =
    ({ 1: "md:grid-cols-1", 2: "md:grid-cols-2" } as Record<number, string>)[posts.length] ??
    "md:grid-cols-3";

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{
        paddingTop: ownSpacing(top_spacer, blockOptions?.padding_top),
        paddingBottom: ownSpacing(bottom_spacer, blockOptions?.padding_bottom),
      }}
    >
      <div className="container">
        <div className="mb-md flex flex-wrap items-end justify-between gap-sm">
          {heading && <div className="flow">{Parser(heading)}</div>}
          {button && <Button linkItem={button} style="secondary" size="md" iconRight="ArrowRight" />}
        </div>
        <div className={classNames("grid grid-cols-1 gap-sm", mdColsClass)}>
          {posts.map((post: any) => (
            <div className="featured-posts-item" key={post.id}>
              <DynamicComponent componentName={post?.card || card} data={post} />
            </div>
          ))}
        </div>
      </div>
    </BlockWrapper>
  );
};

export default FeaturedPosts;
