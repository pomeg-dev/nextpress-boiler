import type { Meta, StoryObj } from "@storybook/react";
import Stats from "@ui/components/organisms/default/Stats";

const statPlaceholder = `<h2>100+</h2><p>Et ex nostrud in inani commodo inimicus omnium novum</p>`;

const meta: Meta<typeof Stats> = {
  title: "Components/Organisms/Default/Stats",
  component: Stats,
  tags: ["autodocs"],
  args: {
    stats: [
      { content: statPlaceholder },
      { content: statPlaceholder },
      { content: statPlaceholder },
      { content: statPlaceholder },
    ],
    columns: 4,
    top_spacer: "xl",
    bottom_spacer: "xl",
  },
};

export default meta;

type Story = StoryObj<typeof Stats>;

export const Default: Story = {};