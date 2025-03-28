import React, { ReactNode } from "react";
import Link from "next/link";
import classNames from "classnames";
import { linkFilter } from "@/utils/url";
import * as Icons from '../../icons/icon-loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type IconNames = keyof typeof Icons;
type ButtonProps = {
  type?: "link" | "button" | "submit";
  linkItem?: { url?: string; target?: string; title?: string; };
  size?: "xl" | "lg" | "md" | "sm";
  style?: "primary" | "secondary" | "card" | "high-contrast" | "no-fill";
  disabled?: boolean;
  circular?: boolean;
  special?: boolean;
  iconLeft?: IconNames;
  iconRight?: IconNames;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
};

const Button: React.FC<ButtonProps> = ({ 
  type = "link",
  linkItem,
  size = "xl", 
  style = "primary", 
  disabled = false, 
  circular = false, 
  special = false, 
  iconLeft,
  iconRight,
  onClick,
  className,
  children,
}) => {
  if (special) {
    circular = true;
    iconRight = "ArrowRight";
    iconLeft = undefined;
  }

  let iconOnly = false;
  if (!linkItem && !children) {
    iconOnly = true;
    circular = true;
    iconRight = iconRight 
      ? iconRight 
      : (iconLeft) ? iconLeft : "ChevronDown";
    iconLeft = undefined;
  }

  // Handle styles.
  let padding = special 
    ? ["pl-[1.25em]", "pr-[0.3em]", "py-[0.3em]"] 
    : (style === "no-fill") ? [] : ["py-[1em]", "px-[1.25em]"];
  if (iconOnly) {
    padding = ["p-[0.3em]"];
  }

  const sizeClasses = [];
  switch (size) {
    case "xl":
      sizeClasses.push(['text-lg']);
      break;
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
  finalClasses.push(circular ? ["rounded-full"] : (style === "no-fill") ? [] : ["rounded-md"]);
  finalClasses.push(special ? ["special"] : []);

  // Handle Icons.
  const iconWrapperClasses = "icon-wrapper transition-colors flex h-[2.4em] w-[2.4em] items-center justify-center rounded-full";
  const IconLeft = iconLeft ? Icons[iconLeft] : undefined;
  const IconRight = iconRight ? Icons[iconRight] : undefined;

  // Handle onClick.
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    } else if (onClick) {
      onClick();
    }
  };

  const isLink = type === "link";
  const commonProps = {
    className: classNames(
      "group button inline-flex w-fit items-center antialiased transition-colors leading-none relative overflow-hidden z-[1]",
      style,
      style === "no-fill" ? "gap-2" : "gap-4",
      finalClasses,
      className,
      disabled && "disabled opacity-50 cursor-not-allowed pointer-events-none"
    ),
    onClick: handleClick,
  };

  return isLink ? (
    <Link
      href={linkItem && linkItem.url ? linkFilter(linkItem.url, API_URL) : ''}
      target={linkItem && linkItem.target}
      {...commonProps}
    >
      {!special && IconLeft && 
        <IconLeft width="1.5em" height="1.5em" />
      }
      {linkItem?.title}
      {children}
      {special && IconRight ? (
        <div className={classNames(iconWrapperClasses)}>
          <IconRight width="1.5em" height="1.5em" />
        </div>
      ) : (
        IconRight && <IconRight width="1.5em" height="1.5em" />
      )}
    </Link>
  ) : (
    <button type={type} disabled={disabled} {...commonProps}>
      {!special && IconLeft && 
        <IconLeft width="1.5em" height="1.5em" />
      }
      {linkItem?.title}
      {children}
      {special && IconRight ? (
        <div className={classNames(iconWrapperClasses)}>
          <IconRight width="1.5em" height="1.5em" />
        </div>
      ) : (
        IconRight && <IconRight width="1.5em" height="1.5em" />
      )}
    </button>
  );
};

export default Button;
