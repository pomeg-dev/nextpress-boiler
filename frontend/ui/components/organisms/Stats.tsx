import React, { ReactNode } from "react";
import classNames from "classnames";
import Parser from "html-react-parser";

type StatsProps = {
  stats?: { content: string}[];
  columns?: 1 | 2 | 3 | 4;
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  className?: string;
  id?: string;
};

const Stats: React.FC<StatsProps> = ({
  stats,
  columns = 4,
  top_spacer = "xl",
  bottom_spacer = "xl",
  className,
  id,
}) => {
  const getGridClass = (columns: number) => {
    return `flex flex-col md:grid grid-cols-${columns} gap-8`; 
  };

  return (
    <div
      className={classNames(
        "container",
        `pb-${bottom_spacer}`,
        `pt-${top_spacer}`,
        className
      )}
      id={id}
      data-bg="white"
    >
      {stats &&
        <div
          className={getGridClass(columns)}
        >
          {stats.map((stat: any, index: number) => (
            <div
              key={index}
            >
              {Parser(stat.content)}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Stats;