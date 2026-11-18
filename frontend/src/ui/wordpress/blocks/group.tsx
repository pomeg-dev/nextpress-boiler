import React from "react";
import type { BlockComponentProps } from "@pomeg-dev/nextpress-client";
import { BlockParser } from "@/nextpress.blocks";
import classNames from "classnames";
import TabbedContent from "@ui/components/organisms/default/TabbedContent";

// Editor background slug (theme.json) → colour theme in theme.scss.
// A group with one of these backgrounds becomes that colour chip.
const BACKGROUND_THEMES: Record<string, string> = {
  primary: "dark",
  black: "dark-secondary",
  "card-fill": "light-secondary",
  accent: "flare",
  secondary: "flare",
  white: "light",
};

// Site override of core/group: renders the brand TabbedContent hash handler and
// maps the group's background to a colour theme. Top-level groups are page
// sections (styled in theme.scss); nested groups only lay out their children.
const Group: React.FC<BlockComponentProps> = ({ parser, language, ...block }) => {
  const { innerBlocks, innerContent, data } = block;
  const backgroundColor: string | undefined = data?.style?.color?.background || data?.backgroundColor;
  const textColor: string | undefined = data?.style?.color?.text || data?.textColor;
  let id: string | undefined = undefined;
  if (innerContent?.[0]) {
    const regex = /id=["']([^"']*)["']/;
    const match = regex.exec(innerContent?.[0]);
    id = match ? match[1] : undefined;
  }

  const theme = backgroundColor ? BACKGROUND_THEMES[backgroundColor] : undefined;
  // A custom hex background has no theme: paint it and keep the inherited colours.
  const customBackground = backgroundColor && !theme ? backgroundColor : undefined;

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
    'gap-sm': layoutType === 'flex',
    'flow': layoutType !== 'flex',
  });

  return (
    <div
      id={id}
      className={classNames(
        "core-block group-block relative",
        textColor && "has-text-color",
        block?.className
      )}
      data-theme={theme}
      style={{
        ...(customBackground && {
          backgroundColor: customBackground.includes('#') ? customBackground : `var(--color-${customBackground})`,
        }),
        ...(textColor && {
          color: textColor.includes('#') ? textColor : `var(--color-${textColor})`,
        }),
      }}
    >
      <TabbedContent />
      {innerBlocks && (
        <div className={classNames("group-inner", layoutClasses)}>
          <BlockParser blocks={innerBlocks} language={language} />
        </div>
      )}
    </div>
  );
};

export default Group;
