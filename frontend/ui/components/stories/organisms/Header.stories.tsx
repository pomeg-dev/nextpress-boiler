import type { Meta, StoryObj } from "@storybook/react";
import Header from "../../organisms/Header";

const logoPlaceholder = {
  src: "https://fakeimg.pl/160x20",
  width: 160,
  height: 20,
  className: "my-xs w-[160px]",
  alt: "Logo",
  blurImage: "https://fakeimg.pl/160x20",
};

const menuPlaceholder = [
  {
    title: "Home",
    url: "http://localhost/oraportal/",
  },
  {
    title: "Shop",
    url: "#",
  },
  {
    title: "Learn",
    url: "#",
  },
  {
    title: "Loyalty & Rewards",
    url: "#",
  },
];

const meta: Meta<typeof Header> = {
  title: "Components/Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  args: {
    alt_header: false,
    logo: logoPlaceholder,
    logo_alt: logoPlaceholder,
    menu_items: menuPlaceholder,
    enable_login: true,
    enable_cart: true,
    username: "User",
    alignment: "center",
    style: "glass",
    className: "w-full"
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  globals: {
    colorScheme: "image",
    viewportWidth: "100%",
  },
};

export const Alt: Story = {
  args: {
    alt_header: true,
  },
  globals: {
    colorScheme: "image",
    viewportWidth: "100%",
  },
};

export const Solid: Story = {
  args: {
    style: "solid",
    alignment: "right",
    enable_login: false,
    enable_cart: false,
  },
  globals: {
    colorScheme: "image",
    viewportWidth: "100%",
  },
};