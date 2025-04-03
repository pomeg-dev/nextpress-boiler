import React, { ReactNode } from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { ButtonProps, ImageProps } from "@/lib/types";
import Button from "../../atoms/Button";
import Pill from "../../atoms/Pill";
import Image from "next/image";

type HeroImageProps = {
  image?: ImageProps;
  label?: string;
  heading?: string;
  content?: string;
  buttons?: ButtonProps[];
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  background_colour?: string;
  text_colour?: string;
  background_tint?: boolean;
  className?: string;
  id?: string;
};

const HeroImage: React.FC<HeroImageProps> = ({
  image,
  label,
  heading,
  content,
  buttons,
  bottom_spacer = "xl",
  background_colour,
  text_colour,
  background_tint,
  className,
  id,
}) => {
  return (
    <div
      className={classNames(
        "break-out overflow-hidden text-white relative",
        className,
      )}
      id={id}
      style={{
        ...(text_colour ? { color: text_colour } : {}),
        ...(background_colour ? { backgroundColor: background_colour } : {})
      }}
    >
      {image && image.src &&
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width ?? 800}
          height={image.width ?? 600}
          className={image.className ?? "absolute left-0 top-0 h-full w-full object-cover"}
          blurDataURL={image.blurImage ?? image.src}
          placeholder="blur"
        />
      }
      {background_tint &&
        <div className="tint pointer-events-none absolute left-0 top-0 h-full w-full bg-secondary opacity-10"></div>
      }
      <div className={classNames(
        "container h-[98vh] flex flex-col items-stretch justify-end gap-md pt-8 relative",
        `pb-${bottom_spacer}`
      )}>
        <section className="flex flex-col justify-end">
          {label && (
            <Pill
              size="lg"
              style="no-fill"
              className="mb-4 !text-white"
            >
              {label}
            </Pill>
          )}
          {heading && (
            <div className="max-w-[1000px] [&_h1]:!text-heading-3xl">{Parser(heading)}</div>
          )}
          {content && (
            <div className="mb-8 mt-0 max-w-[600px] text-heading-md">
              {Parser(content)}
            </div>
          )}
          {(buttons && buttons.length > 0) &&
            <div className="flex flex-wrap gap-4">
              {buttons.map((item: ButtonProps, index: number) => (
                <Button
                  key={index}
                  linkItem={item.link}
                  style={index === 0 ? "high-contrast" : "secondary"}
                  special={index === 0 && true}
                  circular={true}
                  className={index !== 0 ? "!text-white hover:!text-primary" : ""}
                />
              ))}
            </div>
          }
        </section>
      </div>
    </div>
  );
};

export default HeroImage;