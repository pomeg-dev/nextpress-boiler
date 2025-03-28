"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import { MobileNav } from "./components/MobileNav";

export function Header(props: any) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <>
      <header
        className={cn(
          // styles.header,
          "header z-[60] mx-auto flex w-full container items-center justify-between px-[20px] py-[20px]"
        )}
      >
        <Link
          href="/"
          className="logo flex items-start justify-start text-[20px] font-[600] tracking-[1px]"
        >
          {props?.data?.logo &&
            <Image
              src={props.data.logo.url}
              width={200}
              height={80}
              alt={props.data.logo.alt}
            />
          }
          LOGO
        </Link>
        <nav className="header__nav hidden select-none items-center justify-center gap-[20px] font-[500] uppercase tracking-[.02em] antialiased md:flex">
          <button className="">Nav CTA</button>
        </nav>
        <button
          className={cn("md:hidden flex", mobileNavOpen && "open")}
          id="nav-icon3"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          MENU
        </button>
      </header>
      <MobileNav
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />
    </>
  );
}
