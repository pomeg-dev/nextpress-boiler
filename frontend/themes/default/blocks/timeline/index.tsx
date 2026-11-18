import classNames from "classnames";
import Timeline from "@ui/components/organisms/default/Timeline";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";
import { acfImage } from "@ui/utils/image";

export function TimelineBlock(props: any) {
  const {
    heading,
    intro,
    items,
  } = props.data;

  return (
    <Timeline
      heading={heading}
      intro={intro}
      items={(items || []).map((item: any) => ({ ...item, image: acfImage(item?.image) }))}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block timeline", props.className)}
      id={props.id}
    />
  );
}
