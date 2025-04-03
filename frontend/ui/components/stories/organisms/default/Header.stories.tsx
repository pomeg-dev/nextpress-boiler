import type { Meta, StoryObj } from "@storybook/react";
import Header from "@ui/components/organisms/default/Header";

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
  title: "Components/Organisms/Default/Header",
  component: Header,
  tags: ["autodocs"],
  args: {
    logo: logoPlaceholder,
    menu_items: menuPlaceholder,
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