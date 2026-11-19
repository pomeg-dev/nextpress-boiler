"use client";

import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';
import InputHelper from '../atoms/InputHelper';

export interface TextAreaInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  name: string;
  label?: string;
  optional_text?: string;
  placeholder?: string;
  helper_text?: string;
  helper_type?: "default" | "validation error" | "guidance red" | "guidance green";
  required?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ 
    name = "TextAreaInput", 
    label, 
    optional_text, 
    placeholder, 
    helper_text, 
    helper_type = "default", 
    required = false, 
    className,
    disabled = false,
    rows = 4,
    maxLength,
    showCharCount = false,
    onChange,
    value,
    ...rest 
  }, ref) => {
    const [charCount, setCharCount] = React.useState<number>(
      typeof value === 'string' ? value.length : 0
    );

    const isError = (helper_type === "validation error" || helper_type === "guidance red")
      ? true : false;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (showCharCount || maxLength) {
        setCharCount(e.target.value.length);
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
          <textarea
            ref={ref}
            id={name}
            name={name}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            onChange={handleChange}
            value={value}
            className={classNames("field-control", "resize-y", isError && "is-invalid")}
            aria-invalid={isError || undefined}
            aria-describedby={
              helper_text ? `${name}-description` : undefined
            }
            required={required}
            disabled={disabled}
            {...rest}
          />
        </div>
        
        <div className="flex items-start justify-between">
          {helper_text &&
            <InputHelper name={name} type={helper_type} label={helper_text} />
          }
          
          {(showCharCount || maxLength) && (
            <p className="label ml-auto text-muted">
              {charCount}{maxLength ? `/${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextAreaInput.displayName = "TextAreaInput";

export default TextAreaInput;