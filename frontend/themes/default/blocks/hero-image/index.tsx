import classNames from "classnames";
import { ImageProps } from "@pomeg-dev/nextpress-client/types";
import HeroImage from "@ui/components/organisms/default/HeroImage";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function HeroImageBlock(props: any) {
  const {
    image,
    label,
    heading,
    content,
    buttons,
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
    }

  return (
    <HeroImage
      image={imageAtts}
      label={label}
      heading={heading}
      content={content}
      buttons={buttons}
      background_colour={background_colour}
      text_colour={text_colour}
      background_tint={background_tint}
      blockOptions={getBlockOptions(props.data)}
      className={classNames(
        "custom-block hero-image",
        props.className
      )}
      id={props.id}
    />
  );
}
