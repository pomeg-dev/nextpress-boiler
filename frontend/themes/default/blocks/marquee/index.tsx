import classNames from "classnames";
import Marquee from "@ui/components/organisms/default/Marquee";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function MarqueeBlock(props: any) {
  const {
    items,
    speed,
    direction,
  } = props.data;

  return (
    <Marquee
      items={(items || []).map((item: { text?: string }) => item?.text ?? "").filter(Boolean)}
      speed={speed}
      direction={direction}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block marquee", props.className)}
      id={props.id}
    />
  );
}
