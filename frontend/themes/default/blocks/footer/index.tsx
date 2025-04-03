"use client";

import { getNavItems } from "@/utils/menus";
import Footer from "@ui/components/organisms/default/Footer";

export function FooterBlock(props: any) {
  const {
    logo,
    style,
    background_image,
    background_colour,
    footer_nav,
    menus,
    copyright
  } = props.data;

  let navItems = null;
  if (footer_nav && menus) {
    navItems = getNavItems(footer_nav, menus);
  }

  if (logo) {
    logo.src = logo.url;
    logo.className = "w-full pt-8";
  }

  if (background_image) {
    background_image.src = background_image.url;
    background_image.className = "absolute h-full w-full object-cover";
    background_image.blurDataURL = background_image.sizes?.thumbnail ?? background_image.url;
  }

  return (
    <Footer
      style={style}
      logo={logo}
      background_image={background_image}
      background_colour={background_colour}
      menu_items={navItems}
      copyright={copyright}
    />
  );
}