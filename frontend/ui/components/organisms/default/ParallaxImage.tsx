import React from "react";
import classNames from "classnames";
import { BlockOptions, ImageProps, LinkItemProps } from "@pomeg-dev/nextpress-client/types";
import Image from "next/image";
import Link from "next/link";
import BlockWrapper from "./BlockWrapper";

type ButtonProps = {
  link: LinkItemProps;
};

type ParallaxImageProps = {
  image?: ImageProps;
  style?: "container" | "break-out";
  parallax?: boolean;
  heading?: string;
  links?: ButtonProps[];
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// The image drifts with a CSS scroll-driven animation (theme.scss
// `.parallax-media.is-moving`). Without support, with reduced motion or with
// the toggle off, it is static.
const ParallaxImage: React.FC<ParallaxImageProps> = ({
  image,
  style = "break-out",
  parallax = true,
  heading,
  links,
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
        paddingTop: "var(--space-xl)",
        paddingBottom: "var(--space-xl)",
      }}
    >
      <div className={style === "container" ? "container" : undefined}>
        <div
          className={classNames(
            "parallax-frame scrim relative flex aspect-4/5 flex-col items-center justify-center gap-md overflow-clip px-margin py-lg md:aspect-3/2 lg:aspect-21/9",
            style === "container" && "rounded-md"
          )}
          data-theme="overlay"
        >
          {image?.src && (
            <div className={classNames("parallax-media absolute inset-x-0 top-[-10%] h-[120%]", parallax && "is-moving")}>
              <Image
                src={image.src}
                alt={image.alt ?? ""}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          {heading && (
            <h2 className="heading-xl relative z-1 max-w-[18ch] text-center text-balance">{heading}</h2>
          )}
          {items.length > 0 && (
            <ul className="relative z-1 flex flex-wrap items-center justify-center gap-x-md gap-y-xs">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-x-md">
                  {index !== 0 && <span className="size-2 bg-accent-fill" aria-hidden="true" />}
                  <Link
                    href={item.link.url || "#"}
                    target={item.link.target || undefined}
                    className={classNames("parallax-link", heading ? "heading-md" : "heading-lg")}
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
