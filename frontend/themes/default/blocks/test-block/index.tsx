"use client";

import Stats from "@ui/components/organisms/default/Stats";
import classNames from "classnames";

export function StatsBlock(props: any) {
  const {
    stats,
    columns,
    top_spacer,
    bottom_spacer,
  } = props.data;

  return (
    <Stats
      stats={stats}
      columns={columns}
      top_spacer={top_spacer}
      bottom_spacer={bottom_spacer}
      className={classNames(
        "custom-block stats",
        props.className
      )}
      id={props.id}
    />
  );
}