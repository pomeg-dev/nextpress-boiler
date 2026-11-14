import React from "react";
import type { BlockComponentProps } from "@pomeg-dev/nextpress-client";
import { BlockParser } from "@/nextpress.blocks";
import classNames from "classnames";
import TabbedContent from "@ui/components/organisms/default/TabbedContent";

// Site override of core/group: renders the brand TabbedContent and defaults the text colour.
const Group: React.FC<BlockComponentProps> = ({ parser, language, ...block }) => {
  const { innerBlocks, innerContent, data } = block;
  const backgroundColor = data?.style?.color?.background || data?.backgroundColor;
  const textColor = data?.style?.color?.text || data?.textColor || "primary";
  let id: string | undefined = undefined;
  if (innerContent?.[0]) {
    const regex = /id=["']([^"']*)["']/;
    const match = regex.exec(innerContent?.[0]);
    id = match ? match[1] : undefined;
  }

  const layoutType = data?.layout?.type;
  const flexWrap = data?.layout?.flexWrap;
  const verticalAlignment = data?.layout?.verticalAlignment;
  const layoutClasses = classNames({
    'flex flex-col md:flex-row': layoutType === 'flex',
    'flex-nowrap': layoutType === 'flex' && flexWrap === 'nowrap',
    'flex-wrap': layoutType === 'flex' && flexWrap === 'wrap',
    'items-center': layoutType === 'flex' && verticalAlignment === 'middle',
    'items-start': layoutType === 'flex' && verticalAlignment === 'top',
    'items-end': layoutType === 'flex' && verticalAlignment === 'bottom',
    'items-stretch': layoutType === 'flex' && verticalAlignment === 'stretch',
    'justify-between': layoutType === 'flex',
    'gap-4': layoutType === 'flex',
    'w-fit': layoutType === 'flex',
  });

  return (
    <div
      id={id}
      className={classNames(
        "core-block group-block relative",
        data?.style?.color?.text && "has-text-color",
        layoutClasses,
        block?.className
      )}
      style={{
        ...(textColor && {
          color: textColor.includes('#') ? textColor : `var(--color-${textColor})`
        }),
      }}
    >
      <TabbedContent />
      {innerBlocks &&
        backgroundColor ? (
          <div
            className="has-background break-out"
            style={{
              backgroundColor: 
                backgroundColor.includes('#') ? backgroundColor : `var(--color-${backgroundColor})`,
            }}
          >
            <div className="container py-8">
              <BlockParser blocks={innerBlocks} language={language} />
            </div>
          </div>
        ) : (
          <BlockParser blocks={innerBlocks} language={language} />
        )
      }
    </div>
  );
};

export default Group;
