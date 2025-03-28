import React, { ReactNode } from "react";
import { Post } from "@/lib/types";
import Image from "next/image";
import Parser from "html-react-parser";
import Button from "../atoms/Button";
import { Bullet } from "@ui/icons/icon-loader";
import Pill from "../atoms/Pill";

type PostCardProps = {
  post: Post,
};

const PostCard: React.FC<PostCardProps> = ({
  post,
}) => {
  const getIcon = (category: string) => {
    let fillColour = "#FFAA00";
    switch (category) {
      case "Downloadable Guide":
        fillColour = "#FFAA00";
        break;
      case "Course":
        fillColour = "#A4DCFF";
        break;
      case "Resource":
        fillColour = "#746FA9";
        break;
    }

    return <Bullet fill={fillColour} />
  };

  return (
    <div className="flex w-full flex-col rounded-lg bg-[#F9FAFB] text-primary">
      {post.image && (
        <div className="relative aspect-[664/442] w-full overflow-hidden rounded-lg md:aspect-auto md:h-[300px] lg:h-[442px]">
          {(post.acf_data.label || post.category_names) && (
            <div className="absolute left-[12px] top-4 z-10 flex gap-2">
              {post.category_names.map((category: string, i: number) => {
                if (category === "Uncategorized") return;
                return (
                  <Pill
                    key={i}
                    size="sm"
                    style="high-contrast"
                    iconLeft={getIcon(category)}
                  >
                    {category}
                  </Pill>
                );
              })}
              {post.acf_data.label && (
                <Pill
                  size="sm"
                  style="high-contrast"
                >
                  {post.acf_data.label}
                </Pill>
              )}
            </div>
          )}
          <Image
            src={post.image.full}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex w-full flex-col overflow-hidden rounded-lg py-4 pl-4 pr-8 md:h-[calc(100%-300px)] lg:h-[calc(100%-442px)]">
        <h3 className="mb-2">{post.title}</h3>
        {post.acf_data.subtitle && (
          <p className="text-sm font-[500] text-[#3A658C]">
            {post.acf_data.subtitle}
          </p>
        )}
        {post.acf_data.description && (
          <div className="my-4 text-base font-[500] [&_ul]:list-disc [&_ul]:pl-4">
            {Parser(post.acf_data.description)}
          </div>
        )}
        {post.acf_data.postscript && (
          <p className="text-base text-[rgba(13,71,124,0.50)]">
            {post.acf_data.postscript}
          </p>
        )}
        {post.acf_data.link && !post.acf_data.download && (
          <Button
            linkItem={post.acf_data.link}
            style="high-contrast"
            size="md"
            special={true}
            className="mt-auto justify-center"
          />
        )}
        {post.acf_data.download && (
          <Button
            linkItem={{
              url: post.acf_data.download.url,
              target: "_blank"
            }}
            style="high-contrast"
            size="md"
            special={true}
            className="mt-auto justify-center"
          >
            Download now
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostCard;