import React from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { BlockOptions, ButtonProps, ImageProps } from "@pomeg-dev/nextpress-client/types";
import Image from "next/image";
import Button from "../../atoms/Button";
import BlockWrapper from "./BlockWrapper";

type DeckHeroProps = {
  heading?: string;
  content?: string;
  buttons?: ButtonProps[];
  images?: ImageProps[];
  chipLabels?: string[];
  blockOptions?: BlockOptions;
  className?: string;
  id?: string;
};

// The Home signature: image chips riveted at one corner that fan open on load
// (theme.scss `.deck`). Each chip carries a code strip.
const DeckHero: React.FC<DeckHeroProps> = ({
  heading,
  content,
  buttons,
  images = [],
  chipLabels = [],
  blockOptions,
  className,
  id,
}) => {
  const chips = images.slice(0, 6);
  const count = chips.length;

  return (
    <BlockWrapper blockOptions={blockOptions} className={classNames("overflow-x-clip", className)} id={id}>
      <div className="container grid items-end gap-lg pt-lg pb-section lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:pb-xl">
        <div className="flow relative z-[2] lg:col-span-7">
          {heading && <div className="flow">{Parser(heading)}</div>}
          {content && <p className="body-lg measure text-muted">{content}</p>}
          {buttons && buttons.length > 0 && (
            <div className="mt-md! flex flex-wrap gap-xs">
              {buttons.map((item: ButtonProps, index: number) => (
                <Button
                  key={index}
                  linkItem={item.link}
                  size="lg"
                  style={index === 0 ? "primary" : "secondary"}
                  iconRight={index === 0 ? "ArrowRight" : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {count > 0 && (
          <div className="deck lg:col-span-5" style={{ "--count": count } as React.CSSProperties}>
            {chips.map((image, index) => (
              <figure
                key={index}
                className="deck-chip chip"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt ?? ""}
                    fill
                    priority={index === count - 1}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    className="object-cover"
                    {...(image.blurImage && { placeholder: "blur", blurDataURL: image.blurImage })}
                  />
                </div>
                <figcaption className="chip-strip">
                  <span>{chipLabels[index] || `NP–${String(index + 1).padStart(2, "0")}`}</span>
                  <span className="size-2.5 bg-accent-fill" aria-hidden="true" />
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </BlockWrapper>
  );
};

export default DeckHero;
