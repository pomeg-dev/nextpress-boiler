import classNames from "classnames";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";
import { PaletteSwitcher } from "@ui/components/lazy";

export function PaletteSwitcherBlock(props: any) {
  const {
    heading,
    intro,
    presets,
  } = props.data;

  return (
    <PaletteSwitcher
      heading={heading}
      intro={intro}
      presets={presets || []}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block palette-switcher", props.className)}
      id={props.id}
    />
  );
}
