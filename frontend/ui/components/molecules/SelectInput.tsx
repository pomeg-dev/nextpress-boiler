"use client";

import React, { SelectHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import InputHelper from '../atoms/InputHelper';
import { ChevronDown } from '@ui/icons/icon-loader';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  name: string;
  label?: string;
  optional_text?: string;
  placeholder?: string;
  helper_text?: string;
  helper_type?: "default" | "validation error" | "guidance red" | "guidance green";
  required?: boolean;
  options: SelectOption[];
  defaultValue?: string;
  className?: string;
  onChange?: (e?: any) => void;
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ 
    name = "SelectInput", 
    label, 
    optional_text, 
    placeholder, 
    helper_text, 
    helper_type = "default", 
    required = false, 
    disabled = false,
    options = [],
    defaultValue,
    className,
    onChange,
    ...rest
  }, ref) => {
    const isError = (helper_type === "validation error" || helper_type === "guidance red")
      ? true : false;

    const handleChange = (event: any) => {
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <div className={classNames("field", className)}>
        {label && (
          <label 
            htmlFor={name} 
            className={classNames("field-label", disabled && "opacity-40")}
          >
            <span>
              {label}
              {required && <span className="field-required" aria-hidden="true">*</span>}
            </span>
            {optional_text &&
              <span className="field-optional">{optional_text}</span>
            }
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={name}
            name={name}
            className={classNames("field-control", "appearance-none pr-10", isError && "is-invalid")}
            aria-invalid={isError || undefined}
            aria-describedby={
              helper_text ? `${name}-description` : undefined
            }
            required={required}
            disabled={disabled}
            defaultValue={defaultValue || undefined}
            onChange={handleChange}
            {...rest}
          >
            {placeholder && (
              <option value="">{placeholder}</option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown />
          </div>
        </div>
        
        {helper_text && (
          <InputHelper name={name} type={helper_type} label={helper_text} />
        )}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export default SelectInput;