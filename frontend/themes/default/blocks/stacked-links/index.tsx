"use client";

import StackedLinks from "@ui/components/organisms/default/StackedLinks";
import classNames from "classnames";

export function StackedLinksBlock(props: any) {
  const {
    label,
    rows,
    top_spacer,
    bottom_spacer,
  } = props.data;

  return (
    <StackedLinks
      label={label}
      rows={rows}
      top_spacer={top_spacer}
      bottom_spacer={bottom_spacer}
      className={classNames(
        "custom-block stacked-links",
        props.className
      )}
      id={props.id}
    />
  );
}