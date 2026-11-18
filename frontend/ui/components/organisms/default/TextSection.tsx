import React from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type TextSectionProps = {
  content_a?: string;
  content_b?: string;
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  alignment?: "row" | "row-reverse" | "col";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Column A is the statement, column B the supporting copy.
const PLACEMENT = {
  row: ["md:col-span-7", "md:col-span-4 md:col-start-9"],
  "row-reverse": ["md:col-span-7 md:col-start-6", "md:col-span-4 md:col-start-1 md:row-start-1"],
  col: ["md:col-span-10", "md:col-span-6 md:col-start-7"],
};

const TextSection: React.FC<TextSectionProps> = ({
  content_a,
  content_b,
  top_spacer = "xl",
  bottom_spacer = "xl",
  alignment = "row",
  blockOptions,
  className,
  id,
}) => {
  const [placeA, placeB] = PLACEMENT[alignment] ?? PLACEMENT.row;

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{
        paddingTop: ownSpacing(top_spacer, blockOptions?.padding_top),
        paddingBottom: ownSpacing(bottom_spacer, blockOptions?.padding_bottom),
      }}
    >
      <div className={classNames(
        "container grid gap-md md:grid-cols-12 md:gap-x-md",
        alignment === "col" ? "md:gap-y-lg" : "md:items-end"
      )}>
        {content_a && (
          <div className={classNames("statement flow", placeA)}>{Parser(content_a)}</div>
        )}
        {content_b && (
          <div className={classNames("flow measure text-muted", placeB)}>{Parser(content_b)}</div>
        )}
      </div>
    </BlockWrapper>
  );
};

export default TextSection;
