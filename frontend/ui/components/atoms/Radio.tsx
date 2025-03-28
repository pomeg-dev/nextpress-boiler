"use client";

import React, { useState } from "react";
import classNames from "classnames";
import Pill from "./Pill";

type RadioProps = {
  label: string;
  value: string;
  name?: string;
  type?: "radio" | "pill";
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
};

const Radio: React.FC<RadioProps> = ({ 
  label,
  value,
  name = "radio",
  type = "radio",
  checked = false,
  disabled = false,
  className,
  onChange,
}) => {
  const handleRadioChange = () => {
    if (onChange) {
      onChange(value);
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
      {type === "radio" ? (
        <>
          <div className="relative">
            <input 
              type="radio" 
              className="sr-only" 
              checked={checked}
              value={value}
              name={name}
              onChange={handleRadioChange}
              disabled={disabled}
            />

            <div 
              className={classNames(
                "w-4 h-4 border-2 border-primary rounded-full flex items-center justify-center transition-colors",
                checked 
                  ? 'bg-white' 
                  : 'bg-transparent group-hover/label:bg-primary/15'
              )}
            >
              {checked && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          </div>

          {label && (
            <span className="ml-2 text-sm font-[500] leading-none">{label}</span>
          )}
        </>
      ) : (
        <div className="relative w-full">
          <input 
            type="radio" 
            className="sr-only" 
            checked={checked}
            value={value}
            name={name}
            onChange={handleRadioChange}
            disabled={disabled}
          />
          <Pill
            size="lg"
            style={checked ? "accent" : "high-contrast"}
            className="w-full justify-center !rounded-md"
          >
            {label}
          </Pill>
        </div>
      )}
    </label>
  );
};

export default Radio;