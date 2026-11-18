import classNames from "classnames";
import DeckHero from "@ui/components/organisms/default/DeckHero";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";
import { acfImage } from "@ui/utils/image";

export function DeckHeroBlock(props: any) {
  const {
    heading,
    content,
    buttons,
    images,
    chip_labels,
  } = props.data;

  return (
    <DeckHero
      heading={heading}
      content={content}
      buttons={buttons}
      images={(images || []).map(acfImage).filter(Boolean)}
      chipLabels={(chip_labels || []).map((item: { text?: string }) => item?.text ?? "")}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block deck-hero", props.className)}
      id={props.id}
    />
  );
}
