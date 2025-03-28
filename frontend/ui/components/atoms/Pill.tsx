import React, { ReactNode } from "react";
import classNames from "classnames";
import * as Icons from '../../icons/icon-loader';

type IconNames = keyof typeof Icons;
type PillProps = {
  size?: "lg" | "md" | "sm";
  style?: "primary" | "card" | "accent" | "high-contrast" | "no-fill" | "inverted";
  iconLeft?: IconNames | React.ReactElement;
  iconRight?: IconNames | React.ReactElement;
  className?: string;
  children?: ReactNode;
};

const Pill: React.FC<PillProps> = ({ 
  size = "lg", 
  style = "primary",
  iconLeft,
  iconRight,
  className,
  children,
}) => {
  // Handle styles.
  const padding = [];
  padding.push(["py-[0.75em]"]);
  if (iconLeft && !iconRight) {
    padding.push(["pl-[0.75em]", "pr-[1em]"]);
  } else if (iconRight && !iconLeft) {
    padding.push(["pr-[0.75em]", "pl-[1em]"]);
  } else if (iconLeft && iconRight) {
    padding.push(["px-[0.75em]"]);
  } else if (style === "no-fill") {
    padding.push(["px-[4px]"]);
  } else {
    padding.push(["px-[1em]"]);
  }

  const sizeClasses = [];
  switch (size) {
    case "lg":
      sizeClasses.push(['text-base']);
      break;
    case "md":
      sizeClasses.push(['text-sm']);
      break;
    case "sm":
      sizeClasses.push(['text-xs']);
      break;
  }

  const finalClasses = [...sizeClasses, ...padding];

  // Handle Icons.
  const IconLeft = typeof iconLeft === "string" && iconLeft in Icons 
    ? Icons[iconLeft] 
    : React.isValidElement(iconLeft)
      ? iconLeft
      : undefined;
  const IconRight = typeof iconRight === "string" && iconRight in Icons 
    ? Icons[iconRight] 
    : React.isValidElement(iconRight)
      ? iconRight
      : undefined;

  return (
    <div
      className={classNames(
        "pill inline-flex w-fit items-center gap-2 antialiased leading-none relative z-[1] overflow-hidden rounded-full",
        style,
        finalClasses,
        className,
      )}
    >
      {IconLeft &&
        (React.isValidElement(IconLeft) ? (
          IconLeft
        ) : (
          <IconLeft width="1em" height="1em" />
        ))
      }
      {children}
      {IconRight &&
        (React.isValidElement(IconRight) ? (
          IconRight
        ) : (
          <IconRight width="1em" height="1em" />
        ))
      }
    </div>
  );
};

export default Pill;
