import React from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { BlockOptions, ButtonProps, ImageProps } from "@pomeg-dev/nextpress-client/types";
import Button from "../../atoms/Button";
import Image from "next/image";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type HeroImageProps = {
  image?: ImageProps;
  label?: string;
  heading?: string;
  content?: string;
  buttons?: ButtonProps[];
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  background_colour?: string;
  text_colour?: string;
  background_tint?: boolean;
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Editorial split: the title column against an offset image chip. The label
// is the chip's code strip, never a kicker above the heading.
const HeroImage: React.FC<HeroImageProps> = ({
  image,
  label,
  heading,
  content,
  buttons,
  bottom_spacer = "xl",
  background_colour,
  text_colour,
  background_tint,
  blockOptions,
  className,
  id,
}) => {
  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={classNames("overflow-x-clip", className)}
      id={id}
      style={{
        ...(background_colour && { backgroundColor: background_colour }),
        ...(text_colour && { color: text_colour, "--heading": text_colour, "--fg-muted": text_colour } as React.CSSProperties),
      }}
    >
      <div
        className="container grid gap-lg pt-lg lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:items-end"
        style={{ paddingBottom: ownSpacing(bottom_spacer, blockOptions?.padding_bottom) }}
      >
        <div className="flow lg:col-span-7 lg:pb-lg">
          {heading && <div className="flow">{Parser(heading)}</div>}
          {content && (
            <div className="body-lg measure text-muted">{Parser(content)}</div>
          )}
          {buttons && buttons.length > 0 && (
            <div className="mt-md! flex flex-wrap gap-xs">
              {buttons.map((item: ButtonProps, index: number) => (
                <Button
                  key={index}
                  linkItem={item.link}
                  size="lg"
                  style={index === 0 ? "primary" : "secondary"}
                  iconRight={index === 0 ? "ArrowRight" : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {image?.src && (
          <figure className="chip relative z-[1] lg:col-span-5 lg:col-start-8 lg:translate-y-[var(--space-lg)]">
            <div className={classNames("relative aspect-[4/5] overflow-hidden", background_tint && "img-duotone")}>
              <Image
                src={image.src}
                alt={image.alt ?? ""}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                {...(image.blurImage && { placeholder: "blur", blurDataURL: image.blurImage })}
              />
            </div>
            {label && (
              <figcaption className="chip-strip">
                <span>{label}</span>
                <span className="size-3 bg-accent-fill" aria-hidden="true" />
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </BlockWrapper>
  );
};

export default HeroImage;
