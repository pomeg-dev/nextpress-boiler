"use client";

import { getNavItems } from "@pomeg-dev/nextpress-client";
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
  }

  if (background_image) {
    background_image.src = background_image.url;
    background_image.blurImage = background_image.sizes?.thumbnail ?? undefined;
  }

  return (
    <Footer
      style={style}
      logo={logo}
      background_image={background_image}
      background_colour={background_colour}
      menu_items={navItems || undefined}
      copyright={copyright}
    />
  );
}