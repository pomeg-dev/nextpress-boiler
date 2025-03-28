import React, { ReactNode, useState } from "react";
import classNames from "classnames";
import { Minus, Plus } from "@ui/icons/icon-loader";

type QuantitySelectorProps = {
  size?: "lg" | "md" | "sm";
  field_value?: number;
  field_name?: string;
  onClickMinus?: () => void;
  onClickPlus?: () => void;
  onChange?: (e?: any, i?: number) => void;
  className?: string;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  size = "lg",
  field_value,
  field_name = "qty",
  onClickMinus,
  onClickPlus,
  onChange,
  className,
}) => {
  const [fieldValue, setFieldValue] = useState(0);

  const sizeClasses = [];
  switch (size) {
    case "lg":
      sizeClasses.push(['text-lg py-[0.95rem] w-[140px]']);
      break;
    case "md":
      sizeClasses.push(['text-lg py-2 w-[140px]']);
      break;
    case "sm":
      sizeClasses.push(['text-sm py-1 w-[105px]']);
      break;
  }
  
  const handleChange = (event: any, index?: number) => {
    setFieldValue(parseInt(event.target.value));
    if (onChange) {
      onChange(event, index);
    }
  };

  const handleMinus = () => {
    setFieldValue(fieldValue > 0 ? fieldValue - 1 : 0);
    if (onClickMinus) {
      onClickMinus();
    }
  };

  const handlePlus = () => {
    setFieldValue(fieldValue + 1);
    if (onClickPlus) {
      onClickPlus();
    }
  };

  return (
    <div
      className={classNames(
        "quantity-selector relative flex justify-between items-center overflow-hidden rounded-md bg-white",
        sizeClasses,
        className,
      )}
    >
      <div
        className="rounded-l-md rounded-r-none bg-white px-[1em] py-0"
        onClick={handleMinus}
      >
        <Minus
          width={size === "sm" ? "10" : "15"}
          height={size === "sm" ? "11" : "16"}
          fill="#01385D"
          className={classNames(
            (field_value === 0 || (!field_value && fieldValue === 0)) && "opacity-30"
          )}
        />
      </div>

      <input
        type="number"
        value={field_value || fieldValue}
        name={field_name}
        className="w-[26px] bg-white text-center font-[500] text-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        required
        min={0}
        step={1}
        onChange={handleChange}
      />

      <div
        className="rounded-l-none rounded-r-md bg-white px-[1em] py-0"
        onClick={handlePlus}
      >
        <Plus
          width={size === "sm" ? "10" : "15"}
          height={size === "sm" ? "11" : "16"}
          fill="#01385D"
        />
      </div>
    </div>
  );
};

export default QuantitySelector;
