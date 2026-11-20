"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ImageProps } from "@pomeg-dev/nextpress-client/types";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavItem } from "@ui/utils/nav";
import { ArrowRight } from "@ui/icons/icon-loader";

type HeaderProps = {
  logo?: ImageProps;
  menu_items?: NavItem[];
  className?: string;
};

const isCta = (item: NavItem) => item.classes?.includes("is-cta");

const normalise = (path: string) => path.replace(/\/+$/, "") || "/";

// Hide while scrolling down, return on scroll up. Never hidden near the top.
function useHeaderVisibility(locked: boolean) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        if (!locked) setHidden(y > 240 && y > last);
        last = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [locked]);

  return { hidden: hidden && !locked, scrolled };
}

const Logo: React.FC<{ logo: ImageProps }> = ({ logo }) => (
  <Image
    src={logo.src}
    width={logo.width}
    height={logo.height}
    alt={logo.alt || "Home"}
    className="h-7 w-auto md:h-8"
    priority
    unoptimized={logo.src?.endsWith(".svg")}
  />
);

const Header: React.FC<HeaderProps> = ({
  logo,
  menu_items,
  className,
}) => {
  const [isOpen, setOpen] = useState(false);
  const { hidden, scrolled } = useHeaderVisibility(isOpen);
  const pathname = normalise(usePathname() || "/");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const links = menu_items?.filter((item) => !isCta(item)) ?? [];
  const cta = menu_items?.find(isCta);
  const isActive = (item: NavItem) => normalise(item.url) === pathname;

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock page scroll, close on Escape, keep focus in the panel.
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const focusables = () => [
      ...(toggleRef.current ? [toggleRef.current] : []),
      ...Array.from(panel?.querySelectorAll<HTMLElement>("a[href]") ?? []),
    ];
    focusables()[1]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <header
      className={classNames("site-header", className, hidden && "is-hidden", scrolled && "is-scrolled")}
      data-theme="light"
      id="header"
    >
      <div className="container flex h-header items-center justify-between gap-md">
        {logo?.src && (
          <Link href="/" className="relative z-[2] -my-2 flex min-h-11 items-center">
            <Logo logo={logo} />
          </Link>
        )}

        {menu_items && (
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-md">
              {links.map((item, index) => (
                <li key={item.ID ?? index}>
                  <Link
                    href={item.url}
                    target={item.target || undefined}
                    aria-current={isActive(item) ? "page" : undefined}
                    className="nav-link"
                  >
                    <span className="nav-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {item.title}
                  </Link>
                </li>
              ))}
              {cta && (
                <li>
                  <Link href={cta.url} target={cta.target || undefined} className="button gap-2 px-4 text-body-sm">
                    {cta.title}
                    <ArrowRight width="1.1em" height="1.1em" />
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        {menu_items && (
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle relative z-[2] md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => (isOpen ? close() : setOpen(true))}
          >
            <span>{isOpen ? "Close" : "Menu"}</span>
            <span className="menu-toggle-icon" aria-hidden="true" />
          </button>
        )}
      </div>

      {menu_items && (
        <div
          ref={panelRef}
          id="mobile-menu"
          className={classNames("mobile-menu md:hidden", isOpen && "is-open")}
          data-theme="dark"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          aria-hidden={!isOpen}
        >
          <nav aria-label="Main" className="container flex h-full flex-col justify-between py-md">
            <ul className="flex flex-col">
              {links.map((item, i) => (
                <li key={item.ID ?? i} style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={item.url}
                    target={item.target || undefined}
                    aria-current={isActive(item) ? "page" : undefined}
                    className="mobile-menu-link"
                    onClick={() => close(false)}
                  >
                    <span className="nav-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            {cta && (
              <Link
                href={cta.url}
                target={cta.target || undefined}
                className="button w-full gap-3 px-5 py-4 text-body-lg"
                onClick={() => close(false)}
              >
                {cta.title}
                <ArrowRight width="1.2em" height="1.2em" />
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
