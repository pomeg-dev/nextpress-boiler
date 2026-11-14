"use client";

import { ImageProps } from "@pomeg-dev/nextpress-client/types";
import { getNavItems } from "@pomeg-dev/nextpress-client";
import Header from "@ui/components/organisms/default/Header";
import { useEffect, useState } from "react";

export function HeaderBlock(props: any) {
  const {
    logo,
    header_nav,
    menus
  } = props.data;

  let navItems = null;
  if (header_nav && menus) {
    navItems = getNavItems(header_nav, menus);
  }

  let logoAtts: ImageProps = {src: "", alt: ""};
  if (logo) {
    logoAtts.src = logo.url;
    logoAtts.alt = logo.alt;
    logoAtts.width = logo.width;
    logoAtts.height = logo.height;
    logoAtts.className = "my-xs w-[160px]";
    logoAtts.blurImage = logo.sizes?.thumbnail ?? undefined;
  }

  return (
    <Header
      logo={logoAtts}
      menu_items={navItems || undefined}
      className="w-full"
    />
  );
}
