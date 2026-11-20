import { getNavItems } from "@pomeg-dev/nextpress-client";
import Parser from "html-react-parser";
import Footer from "@ui/components/organisms/default/Footer";
import { parseNavItems } from "@ui/utils/nav";
import { acfImage } from "@ui/utils/image";

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

  return (
    <Footer
      style={style}
      logo={acfImage(logo)}
      background_image={acfImage(background_image)}
      background_colour={background_colour}
      menu_items={parseNavItems(navItems)}
      copyright={copyright ? Parser(copyright) : undefined}
    />
  );
}