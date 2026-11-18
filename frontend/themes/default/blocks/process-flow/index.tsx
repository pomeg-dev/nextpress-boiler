import classNames from "classnames";
import ProcessFlow from "@ui/components/organisms/default/ProcessFlow";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function ProcessFlowBlock(props: any) {
  const {
    heading,
    intro,
    steps,
  } = props.data;

  return (
    <ProcessFlow
      heading={heading}
      intro={intro}
      steps={steps || []}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block process-flow", props.className)}
      id={props.id}
    />
  );
}
