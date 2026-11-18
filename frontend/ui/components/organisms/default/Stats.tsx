import React from "react";
import Parser from "html-react-parser";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import BlockWrapper, { ownSpacing } from "./BlockWrapper";

type StatsProps = {
  stats?: { content: string}[];
  columns?: number;
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Figures on a hairline grid. Each stat's first element is the figure.
const Stats: React.FC<StatsProps> = ({
  stats,
  columns = 4,
  top_spacer = "xl",
  bottom_spacer = "xl",
  blockOptions,
  className,
  id,
}) => {
  const cols = Math.min(Math.max(Number(columns) || 4, 1), 8);

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{
        paddingTop: ownSpacing(top_spacer, blockOptions?.padding_top),
        paddingBottom: ownSpacing(bottom_spacer, blockOptions?.padding_bottom),
      }}
    >
      <div className="container">
        {stats && stats.length > 0 && (
          <ul
            className="stats-grid"
            style={{ "--cols": cols, "--cols-md": Math.min(cols, 3) } as React.CSSProperties}
          >
            {stats.map((stat, index) => (
              <li key={index} className="stat flow">
                {Parser(stat.content ?? "")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </BlockWrapper>
  );
};

export default Stats;
