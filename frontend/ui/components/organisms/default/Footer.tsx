"use client";

import React from "react";
import classNames from "classnames";
import { ImageProps } from "@pomeg-dev/nextpress-client/types";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@ui/utils/nav";
import { ArrowRight } from "@ui/icons/icon-loader";

type FooterProps = {
  style: "solid" | "image";
  logo?: ImageProps;
  background_image?: ImageProps;
  background_colour?: string;
  menu_items?: NavItem[];
  // Parsed by the block.
  copyright?: React.ReactNode;
  className?: string;
};

const normalise = (path: string) => path.replace(/\/+$/, "") || "/";

const Footer: React.FC<FooterProps> = ({
  logo,
  style = "image",
  background_image,
  background_colour,
  menu_items,
  copyright,
  className
}) => {
  const pathname = normalise(usePathname() || "/");
  const hasImage = style === "image" && !!background_image?.src;

  return (
    <footer
      className={classNames("site-footer relative isolate overflow-hidden", className)}
      data-theme={hasImage ? "overlay" : "dark"}
      style={{
        ...(style === "solid" && background_colour ? { backgroundColor: background_colour } : {}),
      }}
      id="footer"
    >
      {hasImage && (
        <div className="scrim absolute inset-0 -z-10">
          <Image
            src={background_image!.src}
            width={background_image!.width}
            height={background_image!.height}
            alt=""
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="container grid grid-cols-1 gap-lg pt-xl md:grid-cols-12">
        {menu_items && (
          <nav aria-label="Footer" className="md:col-span-7">
            <ul className="footer-nav">
              {menu_items.map((item: NavItem, i: number) => {
                const href = item.url;
                return (
                  <li key={item.ID ?? i}>
                    <Link
                      href={href}
                      target={item.target || undefined}
                      aria-current={normalise(href) === pathname ? "page" : undefined}
                      className="footer-nav-link"
                    >
                      {item.title}
                      <ArrowRight width="0.6em" height="0.6em" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <div className="flex flex-col justify-between gap-md md:col-span-4 md:col-start-9">
          {copyright && (
            <div className="flow body-sm text-muted [&_a]:text-fg">{copyright}</div>
          )}
          <a href="#header" className="button no-fill w-fit gap-2 text-body-sm">
            Back to top
            <ArrowRight width="1em" height="1em" className="-rotate-90" aria-hidden="true" />
          </a>
        </div>
      </div>

      {logo?.src && (
        <div className="container pb-sm pt-xl">
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={logo.alt || ""}
            sizes="100vw"
            className="footer-wordmark h-auto w-full"
            unoptimized={logo.src.endsWith(".svg")}
          />
        </div>
      )}
    </footer>
  );
};

export default Footer;
