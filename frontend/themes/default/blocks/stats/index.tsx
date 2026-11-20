import Stats from "@ui/components/organisms/default/Stats";
import classNames from "classnames";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function StatsBlock(props: any) {
  const {
    stats,
    columns,
  } = props.data;

  return (
    <Stats
      stats={stats}
      columns={columns}
      blockOptions={getBlockOptions(props.data)}
      className={classNames(
        "custom-block stats",
        props.className
      )}
      id={props.id}
    />
  );
}