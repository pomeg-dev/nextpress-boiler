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
  alt_header: boolean;
  logo?: ImageProps;
  logo_alt?: ImageProps;
  menu_items?: MenuItemsProps[];
  enable_login?: boolean;
  enable_cart?: boolean;
  username?: string;
  alignment?: "center" | "right";
  style?: "solid" | "glass";
  className?: string;
};

const Header: React.FC<HeaderProps> = ({
  alt_header = false,
  logo,
  logo_alt,
  menu_items,
  enable_login,
  enable_cart,
  username = "User",
  alignment = "right",
  style = "solid",
  className,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // TODO setup login functionality.
  // TODO setup related products and connect cart functionality.
  // These are dummy placeholders for the cart.
  const imagePlaceholder = {
    src: "https://picsum.photos/800/600",
    alt: "Placeholder alt",
    width: 800,
    height: 600,
  };
  const productPlaceholder = {
    title: "This is a product name",
    price: 600,
    currency: "$",
    image: imagePlaceholder,
    product_type: ['Product Type'],
    url: "#",
    attributes: {
      size: "12 boxes per pack",
      subscription: "Every 3 months",
    },
  };

  return (
    <header
      className={classNames(
        "header",
        className,
        alt_header && "header-dark"
      )}
      id="header"
    >
      <div className="container">
        <div
          className={classNames(
            "flex items-center gap-4 h-[64px] justify-between rounded-lg px-4 md:px-md py-4 backdrop-blur-[50px] transition-colors",
            alt_header 
              ? "bg-primary/75 text-white" 
              : (style === "glass") ? "bg-white/10 text-white" : "bg-white text-primary"
          )}
        >
          {logo && (
            <Link href="/" className="max-w-[45%]">
              <Image
                src={alt_header && logo_alt ? logo_alt.src : logo.src}
                width={alt_header && logo_alt ? logo_alt.width : logo.width}
                height={alt_header && logo_alt ? logo_alt.height : logo.height}
                alt={alt_header && logo_alt ? logo_alt.alt : logo.alt}
                className={alt_header && logo_alt ? logo_alt.className : logo.className}
                blurDataURL={alt_header && logo_alt ? logo_alt.blurImage : logo.blurImage}
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
                {enable_login && alignment === "right" &&
                  <li
                    className="flex cursor-pointer gap-2"
                    onClick={() => setLoggedIn(!isLoggedIn)}
                  >
                    <UserIcon width={13} height={14} className="mt-[2px]" fill="white" />
                    {(isLoggedIn && username) ? (
                      <span>{username}</span>
                    ) : (
                      <span>Log In</span>
                    )}
                  </li>
                }
                {enable_cart && alignment === "right" &&
                  <li
                    className="flex cursor-pointer gap-2"
                    onClick={() => setCartOpen(!cartOpen)}
                  >
                    <span>Cart (0)</span>
                  </li>
                }
              </ul>

              <div className="block h-[19px] md:hidden">
                <div onClick={() => setOpen(true)}>
                  <Hamburger width={18} height={17} />
                </div>
              </div>
            </nav>
          )}

          {alignment === "center" &&
            <ul className="hidden gap-8 text-sm md:flex">
              {enable_login &&
                <li
                  className="flex cursor-pointer gap-2"
                  onClick={() => setLoggedIn(!isLoggedIn)}
                >
                  <UserIcon width={13} height={14} className="mt-[2px]" fill="white" />
                  {(isLoggedIn && username) ? (
                    <span>{username}</span>
                  ) : (
                    <span>Log In</span>
                  )}
                </li>
              }
              {enable_cart &&
                <li
                  className="flex cursor-pointer gap-2"
                  onClick={() => setCartOpen(!cartOpen)}
                >
                  <span>Cart (0)</span>
                </li>
              }
            </ul>
          }
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
            {enable_login &&
              <li className="flex items-center gap-2">
                <UserIcon width={29} height={30} />
                {username && <span>{username}</span>}
              </li>
            }
            {enable_cart &&
              <li className="flex gap-2">
                <span>Cart (0)</span>
              </li>
            }
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;