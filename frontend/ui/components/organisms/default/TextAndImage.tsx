import React, { ReactNode } from "react";
import classNames from "classnames";
import Parser from "html-react-parser";
import { ImageProps, LinkItemProps } from "@/lib/types";
import Button from "../../atoms/Button";
import Pill from "../../atoms/Pill";
import Image from "next/image";
import FloatingTag from "../../atoms/FloatingTag";

type ButtonProps = {
  link: LinkItemProps;
};

type TextAndImageProps = {
  style?: "narrative" | "card" | "centered-card" | "standard" | "wide";
  flipped?: boolean;
  page_margin?: boolean;
  image?: ImageProps;
  image_tags?: { text: string }[];
  label?: string;
  content?: string;
  buttons?: ButtonProps[];
  top_spacer?: "xl" | "lg" | "md" | "0";
  bottom_spacer?: "xl" | "lg" | "md" | "0";
  className?: string;
  id?: string;
};

const TextAndImage: React.FC<TextAndImageProps> = ({
  style = "narrative",
  flipped = false,
  page_margin = true,
  image,
  image_tags,
  label,
  content,
  buttons,
  top_spacer = "xl",
  bottom_spacer = "xl",
  className,
  id,
}) => {
  const wrapperClasses = [];
  wrapperClasses.push(["wrapper flex flex-col before-white after-inherit !text-primary"]);

  const asideClasses = [];
  asideClasses.push(["relative mx-auto w-full overflow-hidden rounded-lg"]);

  const sectionClasses = [];
  sectionClasses.push(["flex flex-[45%] flex-col"]);

  let isCard = false;
  switch (style) {
    case "card":
    case "centered-card":
      isCard = true;
      wrapperClasses.push(["bg-primary/5 p-6 rounded-lg items-center gap-[5%]"]);
      asideClasses.push(["relative aspect-[100/70] flex-[50%]"]);
      sectionClasses.push(["pr-8"]);
      if (style === "centered-card") {
        sectionClasses.push(["items-center text-center"]);
      }
      break;
    case "standard":
      wrapperClasses.push(["items-center gap-[5%]"]);
      asideClasses.push(["aspect-[100/80] flex-[50%]"]);
      sectionClasses.push(["pr-8"]);
      break;
    case "wide":
      wrapperClasses.push(["gap-[10%]"]);
      asideClasses.push(["aspect-[100/120] flex-[45%]"]);
      break;
    case "narrative":
      wrapperClasses.push(["gap-[5%]"]);
      asideClasses.push(["aspect-[100/115] flex-[50%]"]);
      break;
  }

  const randomisePosition = () => {
    const randomPercent = () => Math.floor(Math.random() * 81) + 10;
    return `top-[${randomPercent()}%] left-[${randomPercent()}%]`;
  };

  return (
    <div
      className={classNames(
        `pb-${bottom_spacer}`,
        `pt-${top_spacer}`,
        page_margin ? "container" : "break-out",
        style,
        className,
      )}
      id={id}
      data-bg="white"
    >
      <div className={classNames(
        wrapperClasses,
        flipped ? "md:flex-row-reverse" : "md:flex-row",
      )}>
        {image && (
          <aside className={classNames(
            asideClasses
          )}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 800}
              height={image.width ?? 600}
              className={image.className ?? "h-full w-full object-cover"}
              blurDataURL={image.blurImage ?? image.src}
              placeholder="blur"
            />
            {image_tags &&
              image_tags.map((tag, index) => (
                <FloatingTag
                  key={index}
                  text={tag.text}
                  style="glass-light"
                  className={classNames(
                    "absolute",
                    index === 0 && "top-[15%] left-[10%]",
                    index === 1 && "top-[50%] left-[50%]",
                    index === 2 && "top-[75%] left-[20%]",
                    index > 2 && randomisePosition()
                  )}
                />
              ))
            }
          </aside>
        )}
        <section className={classNames(
          sectionClasses
        )}>
          {label &&
            <Pill
              style={style === "centered-card" ? "card" : "no-fill"}
              size="md"
              className={classNames(
                "mb-2",
                style === "centered-card" && "self-start mb-10"
              )}
            >
              {label}
            </Pill>
          }
          {content && (
            <div className="mb-2 flex flex-col gap-2 [&>*:first-child]:mb-2">
              {Parser(content)}
            </div>
          )}
          {(buttons && buttons.length > 0) &&
            <div className="flex flex-wrap gap-4">
              {buttons.map((item: ButtonProps, index: number) => (
                <Button
                  key={index}
                  linkItem={item.link}
                  style={
                    index === 0 
                      ? "primary" 
                      : (isCard) ? "high-contrast" : "secondary"
                  }
                  circular={true}
                  special={
                    style === "centered-card" && index === 0 
                      ? true : false
                  }
                />
              ))}
            </div>
          }
        </section>
      </div>
    </div>
  );
};

export default TextAndImage;