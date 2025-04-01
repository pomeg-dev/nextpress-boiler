import React, { ReactNode, useState } from "react";
import classNames from "classnames";
import { ImageProps, MenuItemsProps } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { linkFilter } from "@/utils/url";
import Parser from "html-react-parser";
import { Close, Hamburger, UserIcon } from "@ui/icons/icon-loader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type HeaderProps = {
  logo?: ImageProps;
  menu_items?: MenuItemsProps[];
  className?: string;
};

const Header: React.FC<HeaderProps> = ({
  logo,
  menu_items,
  className,
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <header
      className={classNames(
        "header",
        className,
      )}
      id="header"
    >
      <div className="container">
        <div
          className={classNames(
            "flex items-center gap-4 h-[64px] justify-between rounded-lg px-4 md:px-md py-4 backdrop-blur-[50px] transition-colors bg-white text-primary",
          )}
        >
          {logo && (
            <Link href="/" className="max-w-[45%]">
              <Image
                src={logo.src}
                width={logo.width}
                height={logo.height}
                alt={logo.alt}
                className={logo.className}
                blurDataURL={logo.blurImage}
                placeholder="blur"
              />
            </Link>
          )}

          {menu_items && (
            <nav className="flex">
              <ul className="hidden gap-8 text-sm md:flex">
                {menu_items.map((item: any, index: number) => (
                  <li key={index}>
                    <Link
                      href={linkFilter(item.url, API_URL)}
                      target={item.target}
                      className={classNames(
                        "inline-flex items-center border-b-[1px] border border-transparent hover:border-b-white transition-colors",
                        item.classes
                      )}
                    >
                      {Parser(item.title)}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="block h-[19px] md:hidden">
                <div onClick={() => setOpen(true)}>
                  <Hamburger width={18} height={17} />
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>

      {menu_items && (
        <nav
          className={classNames(
            "mobile-menu fixed flex right-0 top-0 h-screen w-screen bg-white text-[35px] text-primary font-[500] tracking-[-1px] md:hidden px-sm pt-xm pb-lg items-end z-[999] transition-transform",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div
            className="close absolute right-[40px] top-[40px]"
            onClick={() => {
              setOpen(false);
            }}
          >
            <Close width={25} height={25} />
          </div>
          <ul className="flex flex-1 flex-col gap-[20px] leading-tight">
            {menu_items.map(
              (item: any, i: number) => (
                <li key={i}>
                  <Link
                    href={linkFilter(item.url, API_URL)}
                    target={item.target}
                    className={classNames(
                      "flex items-start justify-between border-b-[1px] border border-transparent hover:border-b-white transition-colors",
                      item.classes
                    )}
                  >
                    <span className="w-[calc(100%-34px)]">{Parser(item.title)}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;