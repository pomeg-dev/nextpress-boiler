"use client";

import StackedLinks from "@ui/components/organisms/default/StackedLinks";
import classNames from "classnames";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function StackedLinksBlock(props: any) {
  const {
    label,
    rows,
  } = props.data;

  return (
    <StackedLinks
      label={label}
      rows={rows}
      blockOptions={getBlockOptions(props.data)}
      className={classNames(
        "custom-block stacked-links",
        props.className
      )}
      id={props.id}
    />
  );
}