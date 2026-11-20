import React from "react";
import { Post } from "@pomeg-dev/nextpress-client/types";
import Image from "next/image";
import Link from "next/link";
import Parser from "html-react-parser";
import Button from "../atoms/Button";
import Pill from "../atoms/Pill";

type PostCardProps = {
  post: Post,
  href?: string,
};

// A chip: image over a raised panel. Categories and the label sit on the image.
// With `href`, the title links to the post and stretches over the whole card
// (theme.scss `.post-card-link`); the card's own buttons stay above it.
const PostCard: React.FC<PostCardProps> = ({
  post,
  href,
}) => {
  const categories = (post.category_names ?? []).filter((category: string) => category !== "Uncategorized");
  // Posts have no ACF description: their excerpt stands in.
  const description = post.acf_data?.description || post.excerpt;

  return (
    <div className="post-card relative flex h-full w-full flex-col bg-surface-raised text-fg">
      {post.image && (
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          {(post.acf_data.label || categories.length > 0) && (
            <div className="pointer-events-none absolute left-xs top-xs z-10 flex flex-wrap gap-2">
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
            sizes="(min-width: 1080px) 30vw, (min-width: 720px) 46vw, 92vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flow flex flex-1 flex-col p-sm">
        <h3 className="heading-md">
          {href ? <Link href={href} className="post-card-link">{post.title}</Link> : post.title}
        </h3>
        {post.acf_data.subtitle && (
          <p className="body-sm font-medium text-secondary">
            {post.acf_data.subtitle}
          </p>
        )}
        {description && (
          <div className="flow text-muted">
            {Parser(description)}
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
            className="relative z-1 mt-auto! self-start"
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
            className="relative z-1 mt-auto! self-start"
          >
            Download now
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
