"use client";

import cn from "classnames";
import { getMenuByLocation } from "lib/wp/menus";
import Link from "next/link";
import { useState } from "react";

export function footerNav(props: any) {
  // const menu = await getMenuByLocation("header_nav");
  // const menuItems = menu.items;
  // return (
  //   <nav className="flex gap-[10px]">
  //     {menuItems.map((item: any) => (
  //       <Link href={item.url} key={item.id}>
  //         {item.title}
  //       </Link>
  //     ))}
  //   </nav>
  // );

  return (
    <nav className="flex gap-[10px] items-center justify-center">
      <ServicesDropdown />
      <BookACallButton />
    </nav>
  );
}

export function ServicesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <div
        className="relative z-[40]"
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => setOpen(false)}
      >
        <a>Services</a>
        <div
          className={cn(
            "absolute top-[100%] right-0  bg-white w-auto h-auto transition-transform duration-200 origin-top z-40 rounded-[20px] p-[20px]",
            open ? "scale-100" : "scale-0"
          )}
        >
          {/* blurred overlay fixed full screen */}
          {/* three columns with vertical lists */}
          <div className="flex gap-[20px]">
            <div>
              <h3>Column 1</h3>
              <ul>
                <li>Service 1</li>
                <li>Service 2</li>
                <li>Service 3</li>
              </ul>
            </div>
            <div>
              <h3>Column 2</h3>
              <ul>
                <li>Service 4</li>
                <li>Service 5</li>
                <li>Service 6</li>
              </ul>
            </div>
            <div>
              <h3>Column 3</h3>
              <ul>
                <li>Service 7</li>
                <li>Service 8</li>
                <li>Service 9</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function BookACallButton() {
  return (
    <Link href="/book-a-call">
      <button className="bg-blue px-[20px] py-[8px]">Book a Call</button>
    </Link>
  );
}
