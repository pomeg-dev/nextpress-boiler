import React, { ReactNode } from "react";
import classNames from "classnames";
import Button from "../atoms/Button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "@ui/icons/icon-loader";

type SliderNavigationProps = {
  prevHidden?: boolean;
  nextHidden?: boolean;
  handlePrev?: () => void;
  handleNext?: () => void;
  className?: string;
};

const SliderNavigation: React.FC<SliderNavigationProps> = ({
  prevHidden,
  nextHidden,
  handlePrev,
  handleNext,
  className
}) => {
  return (
    <div className={classNames(
      "slider-navigation flex gap-[10px]",
      className
    )}>
      <div className="prev">
        <Button
          type="button"
          style="secondary"
          circular={true}
          onClick={() => handlePrev ? handlePrev() : undefined}
          className="group/prev pointer-events-auto !p-2"
        >
          <span>
            <ChevronLeft width={30} height={25} className="relative transition-transform duration-300 group-hover/prev:translate-x-[-4px]" />
          </span>
        </Button>
      </div>
      <div
        className="next"
      >
        <Button
          type="button"
          style="secondary"
          circular={true}
          onClick={() => handleNext ? handleNext() : undefined}
          className="group/next pointer-events-auto !p-2"
        >
          <span>
            <ChevronRight width={30} height={25} className="relative transition-transform duration-300 group-hover/next:translate-x-[4px]" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SliderNavigation;