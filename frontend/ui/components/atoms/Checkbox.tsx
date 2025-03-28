"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { Check, Minus } from "@ui/icons/icon-loader";
import Pill from "./Pill";

type CheckboxProps = {
  label: string;
  value: string;
  name?: string;
  type?: "checkbox" | "pill";
  checked?: boolean;
  partial?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (checked: boolean, value?: string) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ 
  label,
  value,
  name = "checkbox",
  type = "checkbox",
  checked: controlledChecked,
  partial = false,
  disabled = false,
  className,
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;
  
  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newCheckedState);
    }
    if (onChange) {
      onChange(newCheckedState, value);
    }
  };

  return (
    <label
      className={classNames(
        "inline-flex items-center min-h-6 group/label",
        disabled ? "opacity-20" : "cursor-pointer",
        className
      )}
    >
      {type === "checkbox" ? (
        <>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isChecked}
              value={value}
              name={name}
              onChange={handleCheckboxChange}
              disabled={disabled}
            />

            <div 
              className={classNames(
                "w-4 h-4 border-2 border-primary rounded-xs flex items-center justify-center transition-colors",
                isChecked 
                  ? 'bg-primary' 
                  : 'bg-transparent group-hover/label:bg-white'
              )}
            >
              {isChecked && (
                partial ? (
                  <Minus fill="white" width={12} height={12} />
                ) : (
                  <Check fill="white" width={12} height={12} />
                )
              )}
            </div>
          </div>

          {label && (
            <span className="ml-2 text-sm font-[500] leading-none">{label}</span>
          )}
        </>
      ) : (
        <div className="relative">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={isChecked}
            value={value}
            name={name}
            onChange={handleCheckboxChange}
            disabled={disabled}
          />
          <Pill
            size="md"
            style={isChecked ? "inverted" : "primary"}
          >
            {label}
          </Pill>
        </div>
      )}
    </label>
  );
};

export default Checkbox;