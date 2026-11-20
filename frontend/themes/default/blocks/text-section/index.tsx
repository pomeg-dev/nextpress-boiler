import TextSection from "@ui/components/organisms/default/TextSection";
import classNames from "classnames";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function TextSectionBlock(props: any) {
  const {
    content_a,
    content_b,
    alignment
  } = props.data;

  return (
    <TextSection
      content_a={content_a}
      content_b={content_b}
      blockOptions={getBlockOptions(props.data)}
      alignment={alignment}
      className={classNames(
        "custom-block text-section",
        props.className
      )}
      id={props.id}
    />
  );
}