import React from "react";
import classNames from "classnames";
import { BlockOptions, ImageProps } from "@pomeg-dev/nextpress-client/types";
import Image from "next/image";
import BlockWrapper from "./BlockWrapper";

type TimelineItem = {
  marker?: string;
  title?: string;
  text?: string;
  image?: ImageProps;
};

type TimelineProps = {
  heading?: string;
  intro?: string;
  items?: TimelineItem[];
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// The heading column sticks while the stages run down a rail. Markers are
// the editor's own (a date, a week, a stage name), set as data.
const Timeline: React.FC<TimelineProps> = ({
  heading,
  intro,
  items = [],
  blockOptions,
  className,
  id,
}) => {
  return (
    <BlockWrapper
      blockOptions={blockOptions}
      className={className}
      id={id}
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
    >
      <div className="container grid gap-lg lg:grid-cols-12 lg:gap-x-md">
        {(heading || intro) && (
          <div className="flow lg:sticky lg:top-[calc(var(--header-h)+var(--space-md))] lg:col-span-4 lg:self-start">
            {heading && <h2>{heading}</h2>}
            {intro && <p className="body-lg text-muted">{intro}</p>}
          </div>
        )}
        {items.length > 0 && (
          <ol className="timeline-rail lg:col-span-7 lg:col-start-6">
            {items.map((item, index) => (
              <li key={index} className="timeline-item">
                <p className="label timeline-marker">{item.marker}</p>
                <div className={classNames("grid gap-sm", item.image?.src && "md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]")}>
                  <div className="flow">
                    {item.title && <h3 className="heading-md">{item.title}</h3>}
                    {item.text && <p className="text-muted">{item.text}</p>}
                  </div>
                  {item.image?.src && (
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt ?? ""}
                        fill
                        sizes="(min-width: 768px) 14rem, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </BlockWrapper>
  );
};

export default Timeline;
