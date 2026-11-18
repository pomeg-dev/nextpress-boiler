import React from "react";
import classNames from "classnames";
import { BlockOptions, ImageProps, LinkItemProps } from "@pomeg-dev/nextpress-client/types";
import Image from "next/image";
import Link from "next/link";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type ButtonProps = {
  link: LinkItemProps;
};

type ParallaxImageProps = {
  image?: ImageProps;
  style?: "container" | "break-out";
  links?: ButtonProps[];
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// The image drifts with a CSS scroll-driven animation (theme.scss
// `.parallax-media`). Without support, or with reduced motion, it is static.
const ParallaxImage: React.FC<ParallaxImageProps> = ({
  image,
  style = "break-out",
  links,
  top_spacer = "xl",
  bottom_spacer = "xl",
  blockOptions,
  className,
  id,
}) => {
  const items = (links ?? []).filter((item) => item?.link?.url);

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={classNames(style, className)}
      id={id}
      style={{
        paddingTop: ownSpacing(top_spacer, blockOptions?.padding_top),
        paddingBottom: ownSpacing(bottom_spacer, blockOptions?.padding_bottom),
      }}
    >
      <div className={style === "container" ? "container" : undefined}>
        <div
          className={classNames(
            "parallax-frame scrim relative flex aspect-[4/5] items-center justify-center overflow-hidden sm:aspect-[3/2] lg:aspect-[21/9]",
            style === "container" && "rounded-md"
          )}
          data-theme="overlay"
        >
          {image?.src && (
            <div className="parallax-media absolute inset-x-0 -top-[10%] h-[120%]">
              <Image
                src={image.src}
                alt={image.alt ?? ""}
                fill
                sizes="100vw"
                className="object-cover"
                {...(image.blurImage && { placeholder: "blur", blurDataURL: image.blurImage })}
              />
            </div>
          )}
          {items.length > 0 && (
            <ul className="relative z-[1] flex flex-wrap items-center justify-center gap-x-md gap-y-xs px-margin">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-x-md">
                  {index !== 0 && <span className="size-2 bg-accent-fill" aria-hidden="true" />}
                  <Link
                    href={item.link.url || "#"}
                    target={item.link.target || undefined}
                    className="parallax-link heading-lg"
                  >
                    {item.link.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
};

export default ParallaxImage;
