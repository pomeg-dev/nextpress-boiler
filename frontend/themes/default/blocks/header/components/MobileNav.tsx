"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import cn from "classnames";
import { usePathname } from "next/navigation";
import { decode } from "html-entities";
import Image from "next/image";
import { getLastPath } from "@/utils/url";
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export function MobileNav({ mobileNavOpen, setMobileNavOpen }: any) {
  const path = usePathname();

  const mobileNavItems = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Services",
      url: "#",
    },
    {
      title: "Phone",
      url: "tel:018339999999",
    },
    {
      title: "Email",
      url: "mailto:",
    },
  ];

  //onMobileNavOpen, disable scrolling
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileNavOpen]);

  return (
    <>
      <div
        className={cn(
          "mobile-nav fixed h-[100dvh] top-0 bg-white w-full gap-[5px] flex flex-col transition-opacity duration-300 overflow-hidden z-[98]",
          mobileNavOpen ? "opacity-1" : "opacity-0 pointer-events-none delay-0"
        )}
      >
        <nav className="mx-auto flex w-full max-w-screen-3xl flex-row items-center justify-between px-[20px] py-[20px] md:px-[40px] md:py-[40px] lg:px-[50px] xl:px-[70px]">
          <div className="mobile-hamburger flex cursor-pointer items-center justify-center p-[8px] md:hidden">
            <button
              className={cn(
                "bg-[color:var(--header-mobile-hamburger-color)])",
                mobileNavOpen && "open"
              )}
              id="nav-icon3"
              onClick={() => {
                setMobileNavOpen(!mobileNavOpen);
              }}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              BACK
            </button>
          </div>
        </nav>
        <div className="flex h-full flex-col justify-between p-[20px]">
          <ul className={cn("mobile-nav-items flex flex-col")}>
            {mobileNavItems &&
              mobileNavItems.map((n: any, i: number) => {
                const current = getLastPath(n.url) == path;
                return (
                  <li key={i} className="relative flex flex-col">
                    <Link href={n.url}>
                      <div
                        className={cn(
                          "text-[37px] w-auto relative inline-flex font-secondary hover:text-secondary text-[var(--color-primary)] transform transition-transform duration-300",
                          mobileNavOpen
                            ? "translate-x-0"
                            : "translate-x-[-200%]",
                          i == 0 && mobileNavOpen && "delay-[0.1s]",
                          i == 1 && mobileNavOpen && "delay-[0.2s]",
                          i == 2 && mobileNavOpen && "delay-[0.3s]",
                          i == 3 && mobileNavOpen && "delay-[0.4s]",
                          i == 4 && mobileNavOpen && "delay-[0.5s]",
                          i == 5 && mobileNavOpen && "delay-[0.6s]",
                          i == 6 && mobileNavOpen && "delay-[0.7s]",
                          i == 7 && mobileNavOpen && "delay-[0.8s]",
                          current && "current text-primary"
                        )}
                        role="button"
                      >
                        {decode(n.title)}
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}
