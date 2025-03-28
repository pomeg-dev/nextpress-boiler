"use client";

import React, { ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import ToggleControlItem, { ToggleControlItemProps } from "../atoms/ToggleControlItem";
import { ChevronDown } from "@ui/icons/icon-loader";

type ToggleControlProps = {
  items: ToggleControlItemProps[];
  size?: "md" | "sm";
  className?: string;
  activeIndex?: number;
  overflow?: number;
  onClick?: (index: number) => void;
};

const ToggleControl: React.FC<ToggleControlProps> = ({ 
  items, 
  size = "md",
  className,
  activeIndex,
  overflow = 0,
  onClick
}) => {
  const [showOverflow, setShowOverflow] = useState<boolean>(false);
  const [toggleItems, setToggleItems] = useState<ToggleControlItemProps[]>(items);
  const [overflowItems, setOverflowItems] = useState<ToggleControlItemProps[]>([]);

  useEffect(() => {
    if (overflow && overflow > 0) {
      const allItems = [...items];
      setOverflowItems(allItems.splice(overflow));
      setToggleItems(allItems.splice(0, overflow));
    }
  }, [overflow]);

  return (
    <div
      className={classNames(
        "toggle-control inline-flex w-fit items-center gap-2 antialiased leading-none relative z-[1] rounded-full p-[4px]",
        className,
      )}
    >
      {toggleItems && toggleItems.map((item: ToggleControlItemProps, index: number) => (
        <ToggleControlItem
          key={index}
          size={size}
          index={index}
          activeIndex={activeIndex}
          onClick={onClick}
        >
          {item.children}
        </ToggleControlItem>
      ))}
      {overflow > 0 && overflowItems &&
        <ToggleControlItem
          size={size}
          index={-1}
          onClick={() => setShowOverflow(!showOverflow)}
          className={classNames(
            showOverflow ? "active" : "",
          )}
        >
          More
          <ChevronDown />
          <div className={classNames(
            "toggle-control flex flex-col absolute top-[calc(100%+10px)] ml-[-100px] left-1/2 rounded-lg shadow-lg p-2 gap-2 w-[200px] transition-transform",
            showOverflow ? "scale-100 pointer-events-auto" : "scale-0 pointer-events-none",
          )}>
            {overflowItems.map((ovitem: ToggleControlItemProps, ovindex: number) => {
              const reindex = ovindex + toggleItems.length;
              return (
                <ToggleControlItem
                  key={reindex}
                  size={size}
                  index={reindex}
                  activeIndex={activeIndex}
                  onClick={onClick}
                  className="!w-full !justify-center !rounded-lg"
                >
                  {ovitem.children}
                </ToggleControlItem>
              );
            })}
          </div>
        </ToggleControlItem>
      }
    </div>
  );
};

export default ToggleControl;
