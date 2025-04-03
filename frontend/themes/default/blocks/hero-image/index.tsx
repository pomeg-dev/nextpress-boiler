"use client";

import classNames from "classnames";
import { ImageProps } from "@/lib/types";
import HeroImage from "@ui/components/organisms/default/HeroImage";

export function HeroImageBlock(props: any) {
  const {
    image,
    label,
    heading,
    content,
    buttons,
    bottom_spacer,
    background_colour,
    text_colour,
    background_tint
  } = props.data;

  let imageAtts: ImageProps = { src: "", alt: ""};
    if (image) {
      imageAtts.src = image.url;
      imageAtts.alt = image.alt;
      imageAtts.width = image.width;
      imageAtts.height = image.height;
      imageAtts.className = "absolute left-0 top-0 h-full w-full object-cover";
      imageAtts.blurImage = image.sizes?.thumbnail ?? undefined;
    }

  return (
    <HeroImage
      image={imageAtts}
      label={label}
      heading={heading}
      content={content}
      buttons={buttons}
      bottom_spacer={bottom_spacer}
      background_colour={background_colour}
      text_colour={text_colour}
      background_tint={background_tint}
      className={classNames(
        "custom-block hero-image",
        props.className
      )}
      id={props.id}
    />
  );
}