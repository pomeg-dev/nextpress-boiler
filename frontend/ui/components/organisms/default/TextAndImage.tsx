import React from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { BlockOptions, ImageProps, LinkItemProps } from "@pomeg-dev/nextpress-client/types";
import Button from "../../atoms/Button";
import Image from "next/image";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type ButtonProps = {
  link: LinkItemProps;
};

type TextAndImageProps = {
  style?: "narrative" | "card" | "centered-card" | "standard" | "wide";
  flipped?: boolean;
  page_margin?: boolean;
  image?: ImageProps;
  image_tags?: { text: string }[];
  label?: string;
  content?: string;
  buttons?: ButtonProps[];
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Per style: grid placement of the image and text columns (default and
// flipped), and the image ratio. The image always comes first on mobile.
const LAYOUTS = {
  narrative: {
    image: ["md:col-span-6", "md:col-span-6 md:col-start-7"],
    text: ["md:col-span-5 md:col-start-8", "md:col-span-5 md:col-start-1"],
    ratio: "aspect-[4/5]", align: "md:items-end",
  },
  standard: {
    image: ["md:col-span-6", "md:col-span-6 md:col-start-7"],
    text: ["md:col-span-5 md:col-start-8", "md:col-span-5 md:col-start-1"],
    ratio: "aspect-[3/2]", align: "md:items-center",
  },
  wide: {
    image: ["md:col-span-7", "md:col-span-7 md:col-start-6"],
    text: ["md:col-span-4 md:col-start-9", "md:col-span-4 md:col-start-1"],
    ratio: "aspect-[5/6]", align: "md:items-start",
  },
  card: {
    image: ["md:col-span-6", "md:col-span-6 md:col-start-7"],
    text: ["md:col-span-5 md:col-start-8", "md:col-span-5 md:col-start-1"],
    ratio: "aspect-[3/2]", align: "md:items-center",
  },
  // Stacked: centred text over a strip-ratio image. Flipping does not apply.
  "centered-card": {
    image: ["md:col-span-12", "md:col-span-12"],
    text: ["md:col-span-8 md:col-start-3", "md:col-span-8 md:col-start-3"],
    ratio: "aspect-[21/9]", align: "",
  },
};

const TextAndImage: React.FC<TextAndImageProps> = ({
  style = "narrative",
  flipped = false,
  page_margin = true,
  image,
  image_tags,
  label,
  content,
  buttons,
  top_spacer = "xl",
  bottom_spacer = "xl",
  blockOptions,
  className,
  id,
}) => {
  const layout = LAYOUTS[style] ?? LAYOUTS.narrative;
  const isCard = style === "card" || style === "centered-card";
  const isCentered = style === "centered-card";
  // Narrative and wide images take the section's duotone; hover shows colour.
  const isDuotone = style === "narrative" || style === "wide";
  const side = flipped && !isCentered ? 1 : 0;
  const hasImage = Boolean(image?.src);
  const tags = (image_tags ?? []).filter((tag) => tag?.text);
  const hasStrip = Boolean(label) || tags.length > 0;

  const figure = hasImage && image && (
    <figure className={classNames("chip", layout.image[side], isCentered ? "md:row-start-2" : "md:row-start-1")}>
      <div className={classNames(
        "relative overflow-hidden",
        layout.ratio,
        isDuotone && "img-duotone is-revealable"
      )}>
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          fill
          sizes={isCentered ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover"
          {...(image.blurImage && { placeholder: "blur", blurDataURL: image.blurImage })}
        />
      </div>
      {hasStrip && (
        <figcaption className="chip-strip">
          <span>{label}</span>
          {tags.length > 0 && (
            <ul className="flex flex-wrap justify-end gap-x-sm gap-y-1" aria-label="Tags">
              {tags.map((tag, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="size-2 bg-accent-fill" aria-hidden="true" />
                  {tag.text}
                </li>
              ))}
            </ul>
          )}
        </figcaption>
      )}
    </figure>
  );

  const text = (
    <div className={classNames(
      "flow md:row-start-1",
      layout.text[side],
      isCentered && "text-center",
    )}>
      {content && <div className="flow">{Parser(content)}</div>}
      {buttons && buttons.length > 0 && (
        <div className={classNames("mt-md! flex flex-wrap gap-xs", isCentered && "justify-center")}>
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
      {/* Without an image there is no chip strip: the label closes the text. */}
      {label && !hasImage && (
        <p className="label mt-md! border-t border-rule pt-xs text-muted">{label}</p>
      )}
    </div>
  );

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
      <div className={page_margin || !isCard ? "container" : "px-margin"}>
        <div className={classNames(
          "grid gap-lg md:grid-cols-12 md:gap-x-md",
          layout.align,
          isCard && "rounded-md bg-surface-raised p-md md:p-lg",
        )}>
          {figure}
          {text}
        </div>
      </div>
    </BlockWrapper>
  );
};

export default TextAndImage;
