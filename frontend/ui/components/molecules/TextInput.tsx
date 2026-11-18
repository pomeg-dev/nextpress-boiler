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
          <input
            ref={ref}
            id={name}
            name={name}
            placeholder={placeholder}
            className={classNames("field-control",  isError && "is-invalid")}
            aria-invalid={isError || undefined}
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