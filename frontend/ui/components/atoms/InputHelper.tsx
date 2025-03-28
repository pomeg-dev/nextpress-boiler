"use client";

import React from "react";
import classNames from "classnames";
import { Error, Check, Close } from "@ui/icons/icon-loader";

type InputHelperProps = {
  name: string;
  type: "default" | "validation error" | "guidance red" | "guidance green"
  label: string;
  className?: string;
};

const InputHelper: React.FC<InputHelperProps> = ({
  name,
  type = "default",
  label,
  className
}) => {
  const isError = (type === "validation error" || type === "guidance red")
      ? true : false;

  return (
    <p 
      id={`${name}-description`}
      className={classNames(
        "text-sm !mb-0 inline-flex gap-2 items-center",
        isError && "text-red",
        type === "guidance green" && "text-green",
        className
      )}
    >
      {type === "validation error" &&
        <Error fill='red' />
      }
      {type === "guidance red" &&
        <Close fill='red' />
      }
      {type === "guidance green" &&
        <Check />
      }
      {label}
    </p>
  );
};

export default InputHelper;