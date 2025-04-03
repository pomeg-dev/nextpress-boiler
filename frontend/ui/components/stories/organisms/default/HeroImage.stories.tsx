import type { Meta, StoryObj } from "@storybook/react";
import HeroImage from "@ui/components/organisms/default/HeroImage";

const headingPlaceholder = `<h1>This is a heading <span class="text-gradient-primary">with highlighted text</span></h1>`;
const contentPlaceholder = `Et ex nostrud in inani commodo inimicus omnium novum volumus officiis oportere liber. Et ex nostrud in inani commodo inimicus omnium novum volumus officiis.`;
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

const meta: Meta<typeof HeroImage> = {
  title: "Components/Organisms/Default/HeroImage",
  component: HeroImage,
  tags: ["autodocs"],
  args: {
    heading: headingPlaceholder,
    content: contentPlaceholder,
    image: imagePlaceholder,
    buttons: placeholderButtons,
    label: "This is a label",
    bottom_spacer: "xl",
    background_tint: true
  },
};

export default meta;

type Story = StoryObj<typeof HeroImage>;

export const Default: Story = {};