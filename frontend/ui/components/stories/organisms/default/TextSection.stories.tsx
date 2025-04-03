import type { Meta, StoryObj } from "@storybook/react";
import TextSection from "@ui/components/organisms/default/TextSection";

const contentAPlaceholder = `<h2>This is a heading <span class="text-gradient-primary">with highlighted text</span></h2>`;
const contentBPlaceholder = `<p>Et ex nostrud in inani commodo inimicus omnium novum volumus officiis oportere liber. Et ex nostrud in inani commodo inimicus omnium novum volumus officiis.</p>`;

const meta: Meta<typeof TextSection> = {
  title: "Components/Organisms/Default/TextSection",
  component: TextSection,
  tags: ["autodocs"],
  args: {
    content_a: contentAPlaceholder,
    content_b: contentBPlaceholder,
    top_spacer: "xl",
    bottom_spacer: "xl",
    alignment: "row",
  },
};

export default meta;

type Story = StoryObj<typeof TextSection>;

export const Default: Story = {};