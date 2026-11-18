import React from "react";
import { Post } from "@pomeg-dev/nextpress-client/types";
import Image from "next/image";
import Parser from "html-react-parser";
import Button from "../atoms/Button";
import Pill from "../atoms/Pill";

type PostCardProps = {
  post: Post,
};

// A chip: image over a raised panel. Categories and the label sit on the image.
const PostCard: React.FC<PostCardProps> = ({
  post,
}) => {
  const categories = (post.category_names ?? []).filter((category: string) => category !== "Uncategorized");

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-fg">
      {post.image && (
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          {(post.acf_data.label || categories.length > 0) && (
            <div className="absolute left-xs top-xs z-10 flex flex-wrap gap-2">
              {categories.map((category: string, i: number) => (
                <Pill key={i} size="sm" style="high-contrast">
                  {category}
                </Pill>
              ))}
              {post.acf_data.label && (
                <Pill size="sm" style="accent">
                  {post.acf_data.label}
                </Pill>
              )}
            </div>
          )}
          <Image
            src={post.image.full}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flow flex flex-1 flex-col p-sm">
        <h3 className="heading-md">{post.title}</h3>
        {post.acf_data.subtitle && (
          <p className="body-sm font-medium text-secondary">
            {post.acf_data.subtitle}
          </p>
        )}
        {post.acf_data.description && (
          <div className="flow text-muted">
            {Parser(post.acf_data.description)}
          </div>
        )}
        {post.acf_data.postscript && (
          <p className="body-sm text-muted">
            {post.acf_data.postscript}
          </p>
        )}
        {post.acf_data.link && !post.acf_data.download && (
          <Button
            linkItem={post.acf_data.link}
            style="secondary"
            size="md"
            iconRight="ArrowRight"
            className="mt-auto! self-start"
          />
        )}
        {post.acf_data.download && (
          <Button
            linkItem={{
              url: post.acf_data.download.url,
              target: "_blank"
            }}
            style="secondary"
            size="md"
            iconRight="ArrowRight"
            className="mt-auto! self-start"
          >
            Download now
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
