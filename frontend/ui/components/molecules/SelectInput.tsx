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
      <div className={classNames("flex flex-col space-y-2 w-full min-w-[300px]", className)}>
        {label && (
          <label 
            htmlFor={name} 
            className={classNames(
              "font-[500] leading-none flex justify-between items-center",
              disabled && "opacity-20"
            )}
          >
            <span>
              {label}
              {required && <span className="ml-1 text-red">*</span>}
            </span>
            {optional_text &&
              <span className='font-[400] text-primary/80'>{optional_text}</span>
            }
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={name}
            name={name}
            className={classNames(
              "font-[450] w-full p-3 pr-8 rounded-md transition-colors bg-white border appearance-none",
              "focus:outline-none focus:border-primary",
              "hover:border-primary/40",
              disabled && "opacity-40 cursor-not-allowed",
              isError ? "border-red" : "border-transparent",
            )}
            aria-invalid={!!helper_text}
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

export default SelectInput;