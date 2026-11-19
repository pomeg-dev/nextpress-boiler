import React from "react";
import Parser from "html-react-parser";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import BlockWrapper from "./BlockWrapper";

type StatsProps = {
  stats?: { content: string}[];
  columns?: number;
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// Figures on a hairline grid. Each stat's first element is the figure.
const Stats: React.FC<StatsProps> = ({
  stats,
  columns = 4,
  blockOptions,
  className,
  id,
}) => {
  const cols = Math.min(Math.max(Number(columns) || 4, 1), 8);
  // Tablet: 3 across only when it divides evenly, else 2 (no 3 + 1 orphan).
  const colsMd = cols < 3 ? cols : cols % 3 === 0 ? 3 : 2;

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{
        paddingTop: "var(--space-xl)",
        paddingBottom: "var(--space-xl)",
      }}
    >
      <div className="container">
        {stats && stats.length > 0 && (
          <ul
            className="stats-grid"
            style={{ "--cols": cols, "--cols-md": colsMd } as React.CSSProperties}
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
