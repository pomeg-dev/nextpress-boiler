"use client";

import TextSection from "@ui/components/organisms/default/TextSection";
import classNames from "classnames";

export function TextSectionBlock(props: any) {
  const {
    content_a,
    content_b,
    top_spacer,
    bottom_spacer,
    alignment
  } = props.data;

  return (
    <TextSection
      content_a={content_a}
      content_b={content_b}
      top_spacer={top_spacer}
      bottom_spacer={bottom_spacer}
      alignment={alignment}
      className={classNames(
        "custom-block text-section",
        props.className
      )}
      id={props.id}
    />
  );
}