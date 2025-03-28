"use client"

import React, { ReactNode, useState } from "react";
import classNames from "classnames";
import { Check, Plus } from "../../icons/icon-loader";

type FloatingTagProps = {
  text: string;
  size?: "lg" | "md" | "sm";
  style?: "glass-light" | "glass-dark" | "solid";
  icon?: "left" | "right";
  state?: "open" | "close";
  className?: string;
};

const FloatingTag: React.FC<FloatingTagProps> = ({
  text,
  size = "lg", 
  style = "glass-light",
  icon = "left",
  state = "open",
  className,
}) => {
  const [open, setOpen] = useState(state === "open");

  // Handle styles.
  const padding = [];
  padding.push(["py-[0.75em]"]);
  if (!open) {
    padding.push(["px-[0.75em]"]);
  } else if (icon === "left") {
    padding.push(["pl-[0.75em]", "pr-[1em]"]);
  } else if (icon === "right") {
    padding.push(["pr-[0.75em]", "pl-[1em]"]);
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
  switch (style) {
    case "glass-light":
      finalClasses.push(['bg-white/50']);
      break;
    case "glass-dark":
      finalClasses.push(['bg-dark/10']);
      break;
    case "solid":
      finalClasses.push(['bg-white']);
      break;
  }

  if (!open) {
    finalClasses.push(["cursor-pointer"]);
  }

  return (
    <div
      className={classNames(
        "floating-tag inline-flex w-fit items-center gap-2 antialiased leading-none overflow-hidden rounded-full backdrop-blur-[25px] text-primary font-[500]",
        style,
        finalClasses,
        className,
      )}
      onClick={() => setOpen(true)}
    >
      {open ? (
        <>
          {icon === "left" && 
            <div className={classNames(
              "rounded-full p-[4px]",
              style === "solid" ? "bg-primary/5" : "bg-white",
            )}>
              <Check width="1em" height="1em" />
            </div>
          }
          {text}
          {icon === "right" && 
            <div className={classNames(
              "rounded-full p-[4px]",
              style === "solid" ? "bg-primary/5" : "bg-white",
            )}>
              <Check width="1em" height="1em" />
            </div>
          }
        </>
      ) : (
        <div className={classNames(
          "rounded-full p-[4px]",
          style === "solid" ? "bg-primary/5" : "bg-white",
        )}>
          <Plus width="1em" height="1em" />
        </div>
      )}
    </div>
  );
};

export default FloatingTag;
