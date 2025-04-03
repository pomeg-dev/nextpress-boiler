import type { Meta, StoryObj } from "@storybook/react";
import TextAndImage from "@ui/components/organisms/default/TextAndImage";

const contentPlaceholder = `<h2><span class="text-heading-xl">This is a heading <span class="text-gradient-primary">with highlighted text</span></span></h2>
<p>Et ex nostrud in inani commodo inimicus omnium novum volumus officiis oportere liber. Et ex nostrud in inani commodo inimicus omnium novum volumus officiis.</p>`;

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

const meta: Meta<typeof TextAndImage> = {
  title: "Components/Organisms/Default/TextAndImage",
  component: TextAndImage,
  tags: ["autodocs"],
  args: {
    style: "narrative",
    flipped: false,
    page_margin: true,
    content: contentPlaceholder,
    image: imagePlaceholder,
    buttons: placeholderButtons,
    label: "This is a label",
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export default meta;

type Story = StoryObj<typeof TextAndImage>;

export const Narrative: Story = {
  args: {
    style: "narrative",
    content: contentPlaceholder,
    image: imagePlaceholder,
    buttons: placeholderButtons,
    label: "This is a label",
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export const Standard: Story = {
  args: {
    style: "standard",
    page_margin: true,
    content: contentPlaceholder,
    image: imagePlaceholder,
    buttons: placeholderButtons,
    label: "This is a label",
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export const Card: Story = {
  args: {
    style: "card",
    page_margin: false,
    content: contentPlaceholder,
    image: imagePlaceholder,
    buttons: placeholderButtons,
    label: "This is a label",
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export const CenteredCard: Story = {
  args: {
    style: "centered-card",
    page_margin: false,
    content: contentPlaceholder,
    image: imagePlaceholder,
    buttons: placeholderButtons,
    label: "This is a label",
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export const Wide: Story = {
  args: {
    style: "wide",
    flipped: true,
    content: contentPlaceholder,
    image: imagePlaceholder,
    image_tags: [
      { text: "Lorem ipsum"},
      { text: "Lorem ipsum"},
      { text: "Lorem ipsum"},
    ],
    buttons: placeholderButtons,
    label: "This is a label",
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};