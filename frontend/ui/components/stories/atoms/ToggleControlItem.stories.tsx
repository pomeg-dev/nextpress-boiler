import type { Meta, StoryObj } from "@storybook/react";
import ToggleControlItem from "../../atoms/ToggleControlItem";

const meta: Meta<typeof ToggleControlItem> = {
  title: "Components/Atoms/ToggleControlItem",
  component: ToggleControlItem,
  tags: ["autodocs"],
  args: {
    children: "Item content",
    size: "md",
    index: 0,
    activeIndex: 0,
    active: false,
  },
};

export default meta;

type Story = StoryObj<typeof ToggleControlItem>;

export const Default: Story = {
};

export const Dark: Story = {
  globals: {
    colorScheme: 'dark',
  },
};