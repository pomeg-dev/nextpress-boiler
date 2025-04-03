"use client";

import { ImageProps } from "@/lib/types";
import TextAndImage from "@ui/components/organisms/default/TextAndImage";
import classNames from "classnames";

export function TextAndImageBlock(props: any) {
  const {
    style,
    flipped,
    page_margin,
    image,
    image_tags,
    label,
    content,
    buttons,
    top_spacer,
    bottom_spacer,
  } = props.data;

  let imageAtts: ImageProps = { src: "", alt: ""};
  if (image) {
    imageAtts.src = image.url;
    imageAtts.alt = image.alt;
    imageAtts.width = image.width;
    imageAtts.height = image.height;
    imageAtts.className = "h-full w-full object-cover";
    imageAtts.blurImage = image.sizes?.thumbnail ?? undefined;
  }

  return (
    <TextAndImage
      style={style}
      flipped={flipped}
      page_margin={page_margin}
      image={imageAtts}
      image_tags={image_tags}
      label={label}
      content={content}
      buttons={buttons}
      top_spacer={top_spacer}
      bottom_spacer={bottom_spacer}
      className={classNames(
        "custom-block text-and-image",
        props.className
      )}
      id={props.id}
    />
  );
}