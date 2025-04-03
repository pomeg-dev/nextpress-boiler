"use client";

import React from "react";
import classNames from "classnames";
import { ImageProps, MenuItemsProps } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { linkFilter } from "@/utils/url";
import Parser from "html-react-parser";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FooterProps = {
  style: "solid" | "image";
  logo?: ImageProps;
  background_image?: ImageProps;
  background_colour?: string;
  menu_items?: MenuItemsProps[];
  copyright?: string;
  className?: string;
};

const Footer: React.FC<FooterProps> = ({
  logo,
  style = "image",
  background_image,
  background_colour,
  menu_items,
  copyright,
  className
}) => {
  return (
    <footer
      className={classNames(
        "footer",
        className,
        "relative z-[1] overflow-hidden pt-[140px] text-white bg-primary"
      )}
      style={{
        ...(background_colour ? { backgroundColor: background_colour } : {}),
      }}
      id="footer"
    >
      {(style === "image" && background_image) && (
        <div className="absolute left-0 top-0 z-[-1] h-full w-full">
          <Image
            src={background_image.src}
            width={background_image.width}
            height={background_image.height}
            alt={background_image.alt}
            className={background_image.className}
            blurDataURL={background_image.blurImage ?? undefined}
            placeholder={background_image.blurImage ? "blur" : undefined}
          />
        </div>
      )}
      <div className="container flex items-end justify-between">
        {menu_items &&
          <ul className="flex flex-col gap-4 text-base">
            {menu_items.map((item: MenuItemsProps, i: number) => (
              <li key={i}>
                <Link
                  href={linkFilter(item.url, API_URL)}
                  target={item.target}
                  className={classNames(
                    "inline-flex items-center border-b-[1px] border border-transparent hover:border-b-white transition-colors",
                    item.classes
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        }
        {copyright &&
          <div className="max-w-[455px] text-[14px]">{Parser(copyright)}</div>
        }
      </div>
      {logo &&
        <Image
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt={logo.alt}
          className={logo.className}
        />
      }
    </footer>
  );
};

export default Footer;