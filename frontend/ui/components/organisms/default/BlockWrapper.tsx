import React from "react";
import classNames from "classnames";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";

type BlockWrapperProps = {
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
  as?: "section" | "div" | "header" | "footer";
  style?: React.CSSProperties;
  children: React.ReactNode;
};

// Block Settings padding values (ACF group_69d607b467ad1) → spacing tokens.
// "" (default) leaves the block's own spacing; "0" removes it.
const SPACING_TOKENS: Record<string, string> = {
  "0": "0",
  xs: "var(--space-xs)",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
  margin: "var(--space-margin)",
  section: "var(--space-section)",
  header: "var(--space-header)",
};

const spacing = (value?: number | string) =>
  value === undefined || value === null || value === "" ? undefined : SPACING_TOKENS[String(value)];

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  blockOptions,
  className,
  id,
  as: Tag = "section",
  style,
  children
}) => {
  // Every block gets a colour theme so nested blocks never inherit the wrong one.
  const themeOverride = blockOptions?.theme_override;
  const theme = themeOverride && themeOverride !== "mission" ? themeOverride : "light";

  // The option wins over the block's own spacer fields when set.
  const paddingTop = spacing(blockOptions?.padding_top);
  const paddingBottom = spacing(blockOptions?.padding_bottom);

  return (
    <Tag
      className={classNames("block-wrapper relative", className)}
      id={id}
      data-theme={theme}
      style={{
        ...style,
        ...(paddingTop !== undefined && { paddingTop }),
        ...(paddingBottom !== undefined && { paddingBottom }),
      }}
    >
      {children}
    </Tag>
  );
};

export default BlockWrapper;
