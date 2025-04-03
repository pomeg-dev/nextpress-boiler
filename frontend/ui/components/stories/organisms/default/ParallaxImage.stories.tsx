import type { Meta, StoryObj } from "@storybook/react";
import ParallaxImage from "@ui/components/organisms/default/ParallaxImage";

const imagePlaceholder = {
  src: "https://picsum.photos/800/600",
  alt: "Placeholder alt",
  width: 800,
  height: 600,
};

const placeholderButtons = [
  {
    "link": {
      "title": "Primary Button",
      "url": "#",
      "target": ""
    }
  },
  {
    "link": {
      "title": "Secondary Button",
      "url": "#",
      "target": ""
    }
  }
];

const meta: Meta<typeof ParallaxImage> = {
  title: "Components/Organisms/Default/ParallaxImage",
  component: ParallaxImage,
  tags: ["autodocs"],
  args: {
    image: imagePlaceholder,
    links: placeholderButtons,
    style: "break-out",
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export default meta;

type Story = StoryObj<typeof ParallaxImage>;

export const Container: Story = {
  args: {
    style: "container",
  },
  globals: {
    viewportWidth: '100%',
  }
};

export const FullBleed: Story = {
  globals: {
    viewportWidth: '100%',
  }
};