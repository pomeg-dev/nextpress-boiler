"use client";

import React, { useState } from "react";
import classNames from "classnames";
import Checkbox from "../atoms/Checkbox";
import InputHelper from "../atoms/InputHelper";

type CheckboxOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type CheckboxGroupProps = {
  name: string;
  options: CheckboxOption[];
  label?: string;
  required?: boolean;
  helper_text?: string;
  helper_type?: "default" | "validation error" | "guidance red" | "guidance green";
  defaultValues?: string[];
  direction?: "horizontal" | "vertical";
  type?: "checkbox" | "pill";
  className?: string;
  onChange?: (values: string[]) => void;
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  label,
  required = false,
  helper_text, 
  helper_type = "default", 
  defaultValues = [],
  direction = "vertical",
  type = "checkbox",
  className,
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);

  const handleChange = (checked: boolean, value?: string) => {
    if (!value) return;
    
    let newValues;
    if (checked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter(v => v !== value);
    }
    
    setSelectedValues(newValues);
    
    if (onChange) {
      onChange(newValues);
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
          "flex",
          direction === "horizontal" 
            ? (type === "pill") ? "flex-row gap-2" : "flex-row gap-4" 
            : "flex-col gap-2",
        )}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            type={type}
            label={option.label}
            value={option.value}
            checked={selectedValues.includes(option.value)}
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

export default CheckboxGroup;