"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { WaterDrop } from "@ui/icons/icon-loader";

type RadioCardProps = {
  label: string;
  description?: string;
  name?: string;
  value: string;
  checked?: boolean;
  className?: string;
  onChange?: (value: string) => void;
};

const RadioCard: React.FC<RadioCardProps> = ({ 
  label,
  description,
  name = "RadioCard",
  value,
  checked = false,
  className,
  onChange,
}) => {
  const handleRadioCardChange = () => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <label
      className={classNames(
        "radio-card flex items-center rounded-lg bg-white border-2 border-transparent cursor-pointer p-4 w-full max-w-[470px] transition-colors group/radio",
        className,
        checked 
          ? "relative box-border bg-clip-padding border-[2px] border-transparent shadow-gradient-end after:content-[''] after:absolute after:inset-0 after:-z-10 after:-m-[2px] after:rounded-[inherit] after:bg-gradient-to-r after:from-gradient-primary-start after:to-gradient-primary-end" 
          : "hover:border-primary/30"
      )}
    >
      <div className="relative">
        <input 
          type="radio" 
          className="sr-only" 
          checked={checked}
          value={value}
          name={name}
          onChange={handleRadioCardChange}
        />

        <div 
          className={classNames(
            "relative z-[1] w-[56px] h-[56px] rounded-full flex items-center justify-center transition-colors",
            checked 
              ? "bg-gradient-to-r from-gradient-primary-start to-gradient-primary-end after:content-[''] after:absolute after:w-[calc(100%-2px)] after:h-[calc(100%-2px)] after:top-[1px] after:left-[1px] after:-z-10 after:rounded-[inherit] after:bg-white" 
              : "border border-primary/25 bg-white group-hover/radio:border-primary/40",
          )}
        >
          <WaterDrop active={true} />
        </div>
      </div>

      <div className="ml-5 flex flex-col">
        {label && (
          <span className="mb-1 text-lg font-[500]">{label}</span>
        )}
        {description && (
          <span className="text-sm text-primary/80">{description}</span>
        )}
      </div>
    </label>
  );
};

export default RadioCard;