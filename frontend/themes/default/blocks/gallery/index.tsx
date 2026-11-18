import classNames from "classnames";
import Gallery from "@ui/components/organisms/default/Gallery";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";
import { acfImage } from "@ui/utils/image";

export function GalleryBlock(props: any) {
  const {
    heading,
    images,
    captions,
    layout,
  } = props.data;

  return (
    <Gallery
      heading={heading}
      images={(images || []).map(acfImage).filter(Boolean)}
      captions={(captions || []).map((item: { text?: string }) => item?.text ?? "")}
      layout={layout}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block gallery", props.className)}
      id={props.id}
    />
  );
}
