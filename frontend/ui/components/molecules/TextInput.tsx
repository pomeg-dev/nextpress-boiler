"use client";

import React, { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import InputHelper from '../atoms/InputHelper';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  name: string;
  label?: string;
  optional_text?: string;
  placeholder?: string;
  helper_text?: string;
  helper_type?: "default" | "validation error" | "guidance red" | "guidance green";
  required?: boolean;
  className?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ 
    name = "TextInput", 
    label, 
    optional_text, 
    placeholder, 
    helper_text, 
    helper_type = "default", 
    required = false, 
    className,
    disabled = false,
    onChange,
    value,
    ...rest 
  }, ref) => {
    const isError = (helper_type === "validation error" || helper_type === "guidance red")
      ? true : false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
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
          <input
            ref={ref}
            id={name}
            name={name}
            placeholder={placeholder}
            className={classNames(
              "font-[450] w-full p-3 rounded-md transition-colors bg-white border",
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
            onChange={handleChange}
            value={value}
            {...rest}
          />
        </div>
        
        {helper_text && (
          <InputHelper name={name} type={helper_type} label={helper_text} />
        )}
      </div>
    );
  }
);

export default TextInput;