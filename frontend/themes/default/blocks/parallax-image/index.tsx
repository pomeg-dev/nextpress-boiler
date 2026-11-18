"use client";

import { ImageProps } from "@pomeg-dev/nextpress-client/types";
import ParallaxImage from "@ui/components/organisms/default/ParallaxImage";
import classNames from "classnames";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function ParallaxImageBlock(props: any) {
  const {
    style,
    image,
    links,
    top_spacer,
    bottom_spacer,
  } = props.data;

  let imageAtts: ImageProps = { src: "", alt: ""};
  if (image) {
    imageAtts.src = image.url;
    imageAtts.alt = image.alt;
    imageAtts.width = image.width;
    imageAtts.height = image.height;
    imageAtts.blurImage = image.sizes?.thumbnail ?? undefined;
  }

  return (
    <ParallaxImage
      image={imageAtts}
      style={style}
      links={links}
      top_spacer={top_spacer}
      bottom_spacer={bottom_spacer}
      blockOptions={getBlockOptions(props.data)}
      className={classNames(
        "custom-block parallax-image",
        props.className
      )}
      id={props.id}
    />
  );
}