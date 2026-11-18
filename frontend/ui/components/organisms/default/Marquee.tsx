"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { BlockOptions } from "@pomeg-dev/nextpress-client/types";
import BlockWrapper from "./BlockWrapper";

type MarqueeProps = {
  items?: string[];
  speed?: "slow" | "medium" | "fast";
  direction?: "left" | "right";
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

const DURATIONS = { slow: "60s", medium: "40s", fast: "24s" };

// A ticker strip. The track repeats the items twice and slides by half its
// width. It pauses on hover and with the button; under reduced motion it
// does not move (theme.scss `.marquee-track`).
const Marquee: React.FC<MarqueeProps> = ({
  items = [],
  speed = "medium",
  direction = "left",
  blockOptions,
  className,
  id,
}) => {
  const [paused, setPaused] = useState(false);
  if (items.length === 0) return null;

  // Repeat short lists so one copy is wider than the viewport.
  const copies = Math.max(1, Math.ceil(8 / items.length));
  const run = Array.from({ length: copies }, () => items).flat();

  const group = (hidden: boolean) => (
    <ul className="marquee-group" aria-hidden={hidden || undefined}>
      {run.map((text, index) => (
        <li key={index} className="marquee-item">
          {text}
          <span className="marquee-mark" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={classNames("marquee-block", className)}
      id={id}
      style={{ "--marquee-duration": DURATIONS[speed] ?? DURATIONS.medium } as React.CSSProperties}
    >
      <div className="marquee-viewport">
        <div className={classNames("marquee-track", direction === "right" && "is-reversed", paused && "is-paused")}>
          {group(false)}
          {group(true)}
        </div>
      </div>
      <button
        type="button"
        className="marquee-toggle label"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? "Play" : "Pause"}
        <span className="sr-only"> scrolling text</span>
      </button>
    </BlockWrapper>
  );
};

export default Marquee;
