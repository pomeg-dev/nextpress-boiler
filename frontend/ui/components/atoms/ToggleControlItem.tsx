import React, { ReactNode, useState } from "react";
import classNames from "classnames";

export type ToggleControlItemProps = {
  size?: "md" | "sm";
  className?: string;
  children?: ReactNode;
  index?: number;
  activeIndex?: number;
  active?: boolean;
  onClick?: (index: number) => void;
};

const ToggleControlItem: React.FC<ToggleControlItemProps> = ({ 
  size = "md", 
  className,
  children,
  index = 0,
  activeIndex = 0,
  active = false,
  onClick
}) => {
  // Handle styles.
  const padding = [];
  padding.push(["px-[1em] py-[0.75em]"]);

  const sizeClasses = [];
  switch (size) {
    case "md":
      sizeClasses.push(['text-base']);
      break;
    case "sm":
      sizeClasses.push(['text-xs']);
      break;
  }

  const finalClasses = [...sizeClasses, ...padding];

  return (
    <div
      className={classNames(
        "toggle-control-item relative inline-flex w-fit items-center gap-2 antialiased leading-none z-[1] rounded-full cursor-pointer transition-colors",
        finalClasses,
        (activeIndex === index || active) && "active",
        className,
      )}
      onClick={() => onClick ? onClick(index) : undefined}
    >
      {children}
    </div>
  );
};

export default ToggleControlItem;
