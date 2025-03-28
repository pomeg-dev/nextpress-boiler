"use client";

import React, { useState } from "react";
import classNames from "classnames";
import Radio from "../atoms/Radio";
import InputHelper from "../atoms/InputHelper";

type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type RadioGroupProps = {
  name: string;
  options: RadioOption[];
  label?: string;
  required?: boolean;
  helper_text?: string;
  helper_type?: "default" | "validation error" | "guidance red" | "guidance green";
  defaultValue?: string;
  direction?: "horizontal" | "vertical";
  type?: "radio" | "pill";
  className?: string;
  onChange?: (value: string) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  label,
  required = false,
  helper_text, 
  helper_type = "default", 
  defaultValue = "",
  direction = "vertical",
  type = "radio",
  className,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={classNames(
      "flex flex-col gap-2",
      className
    )}>
      {label && (
        <label 
          htmlFor={name} 
          className={classNames(
            "font-[500] leading-none flex justify-between items-center",
          )}
        >
          <span>
            {label}
            {required && <span className="ml-1 text-red">*</span>}
          </span>
        </label>
      )}
      <div 
        className={classNames(
          "radio-wrapper flex",
          direction === "horizontal" 
            ? (type === "pill") ? "flex-row gap-2" : "flex-row gap-4" 
            : "flex-col gap-2",
        )}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            type={type}
            label={option.label}
            value={option.value}
            checked={selectedValue === option.value}
            disabled={option.disabled}
            onChange={handleChange}
          />
        ))}
      </div>
      {helper_text &&
        <InputHelper name={name} type={helper_type} label={helper_text} />
      }
    </div>
  );
};

export default RadioGroup;