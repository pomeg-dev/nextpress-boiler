"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { Check, Close } from "@ui/icons/icon-loader";

type CheckboxCardProps = {
  label: string;
  description?: string;
  name?: string;
  value: string;
  checked?: boolean;
  state?: "default" | "error" | "success",
  className?: string;
  onChange?: (value: string) => void;
};

const CheckboxCard: React.FC<CheckboxCardProps> = ({ 
  label,
  description,
  name = "CheckboxCard",
  value,
  checked = false,
  state = "default",
  className,
  onChange,
}) => {
  const handleCheckboxCardChange = () => {
    if (onChange) {
      onChange(value);
    }
  };

  let labelClasses = checked 
    ? "relative box-border bg-clip-padding border-transparent shadow-gradient-end after:content-[''] after:absolute after:inset-0 after:-z-10 after:-m-[2px] after:rounded-[inherit] after:bg-gradient-to-r after:from-gradient-primary-start after:to-gradient-primary-end" 
    : "border-[2px] border-transparent hover:border-primary/30";
  let iconClasses = checked 
    ? "bg-gradient-to-r from-gradient-primary-start to-gradient-primary-end after:content-[''] after:absolute after:w-[calc(100%-2px)] after:h-[calc(100%-2px)] after:top-[1px] after:left-[1px] after:-z-10 after:rounded-[inherit] after:bg-white" 
    : "border-[1.5px] border-primary/20 bg-white group-hover/check:border-primary/40";
  
  switch (state) {
    case "error":
      labelClasses = "border-[2px] border-red";
      iconClasses = "border-[1.5px] border-red";
      break;
    case "success":
      labelClasses = "border-[2px] border-green";
      iconClasses = "border-[1.5px] border-green";
      break;
  }

  return (
    <label
      className={classNames(
        "checkbox-card flex items-center rounded-lg bg-white cursor-pointer py-4 px-5 w-full max-w-[470px] transition-colors group/check",
        className,
        labelClasses
      )}
    >
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked}
          value={value}
          name={name}
          onChange={handleCheckboxCardChange}
        />

        <div 
          className={classNames(
            "relative z-[1] w-[36px] h-[36px] rounded-full flex items-center justify-center transition-colors",
            iconClasses
          )}
        >
          {state === "default" &&
            <Check
              width={16} 
              height={16} 
              active={checked} 
              className={classNames(
                !checked && "text-primary/20 group-hover/check:text-primary/40"
              )}
            />
          }
          {state === "error" &&
            <Close
              width={16} 
              height={16} 
              fill="red"
            />
          }
          {state === "success" &&
            <Check
              width={16} 
              height={16} 
              fill="green"
            />
          }
        </div>
      </div>

      <div className="ml-5 flex flex-col">
        {label && (
          <span className="mb-1 text-lg font-[500]">{label}</span>
        )}
        {description && (
          <span className="text-sm text-primary/80">{description}</span>
        )}
      </div>
    </label>
  );
};

export default CheckboxCard;