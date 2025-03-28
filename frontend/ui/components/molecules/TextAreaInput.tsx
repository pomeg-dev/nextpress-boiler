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
          <textarea
            ref={ref}
            id={name}
            name={name}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            onChange={handleChange}
            value={value}
            className={classNames(
              "font-[450] w-full p-3 rounded-md transition-colors bg-white border resize-y",
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
            {...rest}
          />
        </div>
        
        <div className="flex items-start justify-between">
          {helper_text &&
            <InputHelper name={name} type={helper_type} label={helper_text} />
          }
          
          {(showCharCount || maxLength) && (
            <p className="!mb-0 text-xs text-primary/60">
              {charCount}{maxLength ? `/${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default TextAreaInput;