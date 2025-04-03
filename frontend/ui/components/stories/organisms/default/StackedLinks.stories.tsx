import type { Meta, StoryObj } from "@storybook/react";
import StackedLinks from "@ui/components/organisms/default/StackedLinks";

const meta: Meta<typeof StackedLinks> = {
  title: "Components/Organisms/Default/StackedLinks",
  component: StackedLinks,
  tags: ["autodocs"],
  args: {
    label: "Lorem ipsum",
    rows: [
      { 
        link: {
          url: "#",
          title: "Click me",
        }, 
        description: "Et ex nostrud in inani commodo inimicus omnium novum"
      },
      { 
        link: {
          url: "#",
          title: "Click me",
        }, 
        description: "Et ex nostrud in inani commodo inimicus omnium novum"
      },
      { 
        link: {
          url: "#",
          title: "Click me",
        }, 
        description: "Et ex nostrud in inani commodo inimicus omnium novum"
      },
    ],
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export default meta;

type Story = StoryObj<typeof StackedLinks>;

export const Default: Story = {};