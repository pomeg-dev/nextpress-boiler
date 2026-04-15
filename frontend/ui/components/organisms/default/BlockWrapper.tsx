
import React from "react";
import classNames from "classnames";
import { BlockOptions } from "@/lib/types";

type BlockWrapperProps = {
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
  children: React.ReactNode;
};

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  blockOptions,
  className,
  id,
  children
}) => {
  // Ensure consistent data-theme attribute between server and client
  const themeOverride = blockOptions?.theme_override;
  const shouldApplyTheme = themeOverride && themeOverride !== "mission";

  return (
    <section
      className={classNames(
        className,
        blockOptions?.padding_top && `!pt-${blockOptions.padding_top}`,
        blockOptions?.padding_bottom && `!pb-${blockOptions.padding_bottom}`
      )}
      id={id}
      {...(shouldApplyTheme && { "data-theme": themeOverride })}
    >
      {children}
    </section>
  );
};

export default BlockWrapper;