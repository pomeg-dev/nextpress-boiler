import Parser from "html-react-parser";
import { linkFilter } from "@pomeg-dev/nextpress-client";
import { MenuItemsProps } from "@pomeg-dev/nextpress-client/types";

// A menu item with its title parsed and its URL made site-relative. Header and
// Footer are client components: doing both in their (server) blocks keeps
// html-react-parser and the package out of the JavaScript every page loads.
export type NavItem = Omit<MenuItemsProps, "title" | "children"> & { title: React.ReactNode };

export const parseNavItems = (items?: MenuItemsProps[] | null): NavItem[] | undefined =>
  // Sub-menus are not rendered: don't send them.
  items?.map(({ children, ...item }) => ({
    ...item,
    title: Parser(item.title),
    url: linkFilter(item.url, process.env.NEXT_PUBLIC_API_URL),
  }));
