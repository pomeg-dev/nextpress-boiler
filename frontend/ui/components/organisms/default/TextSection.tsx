import React, { ReactNode } from "react";
import classNames from "classnames";
import Parser from "html-react-parser";

type TextSectionProps = {
  content_a?: string;
  content_b?: string;
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  alignment?: "row" | "row-reverse" | "col";
  className?: string;
  id?: string;
};

const TextSection: React.FC<TextSectionProps> = ({
  content_a,
  content_b,
  top_spacer = "xl",
  bottom_spacer = "xl",
  alignment = "row",
  className,
  id,
}) => {
  return (
    <div
      className={classNames(
        "container flex flex-col md:gap-[10%] justify-between",
        `pb-${bottom_spacer}`,
        `pt-${top_spacer}`,
        `md:flex-${alignment}`,
        alignment === 'col' ? "items-start" : "items-end",
        className
      )}
      id={id}
      data-bg="white"
    >
      {content_a &&
        <div className="flex-[45%] [&_p]:text-lg [&_p]:font-[500]">
          {Parser(content_a)}
        </div>
      }
      {content_b &&
        <div className="flex-[45%] [&_p]:text-lg [&_p]:font-[500]">
          {Parser(content_b)}
        </div>
      }
    </div>
  );
};

export default TextSection;