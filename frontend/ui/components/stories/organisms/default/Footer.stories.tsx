import type { Meta, StoryObj } from "@storybook/react";
import Footer from "@ui/components/organisms/default/Footer";

const logoPlaceholder = {
  src: "https://fakeimg.pl/1680x200",
  width: 160,
  height: 20,
  className: "w-full pt-8",
  alt: "Logo",
  blurImage: "https://fakeimg.pl/160x20",
};

const imagePlaceholder = {
  src: "https://picsum.photos/800/600",
  alt: "Placeholder alt",
  width: 800,
  height: 600,
  className: "absolute h-full w-full object-cover",
};

const menuPlaceholder = [
  {
    title: "Privacy Policy",
    url: "#",
  },
  {
    title: "Cookie Policy",
    url: "#",
  },
  {
    title: "Terms & Conditions",
    url: "#",
  },
  {
    title: "Corporate Compliance",
    url: "#",
  },
];

const meta: Meta<typeof Footer> = {
  title: "Components/Organisms/Default/Footer",
  component: Footer,
  tags: ["autodocs"],
  args: {
    style: "solid",
    logo: logoPlaceholder,
    menu_items: menuPlaceholder,
    copyright: "© Copyright 2025",
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Solid: Story = {
  args: {
    style: "solid",
    logo: logoPlaceholder,
    background_colour: "#00203D",
    menu_items: menuPlaceholder,
    copyright: "© Copyright 2025",
  },
  globals: {
    viewportWidth: "100%",
  },
};

export const Image: Story = {
  args: {
    style: "image",
    logo: logoPlaceholder,
    background_image: imagePlaceholder,
    menu_items: menuPlaceholder,
    copyright: "© Copyright 2025",
  },
  globals: {
    viewportWidth: "100%",
  },
};