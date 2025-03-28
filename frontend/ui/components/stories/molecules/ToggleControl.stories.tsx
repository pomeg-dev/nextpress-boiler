import type { Meta, StoryObj } from "@storybook/react";
import ToggleControl from "../../molecules/ToggleControl";

const toggleItemsPlaceholder = [
  {
    children: "Item 1",
  },
  {
    children: "Item 2",
  },
  {
    children: "Item 3",
  },
  {
    children: "Item 4",
  },
  {
    children: "Item 5",
  }
];

const meta: Meta<typeof ToggleControl> = {
  title: "Components/Molecules/ToggleControl",
  component: ToggleControl,
  tags: ["autodocs"],
  args: {
    items: toggleItemsPlaceholder,
    overflow: 2,
  },
};

export default meta;

type Story = StoryObj<typeof ToggleControl>;

export const Default: Story = {
};

export const Dark: Story = {
  globals: {
    colorScheme: 'dark',
  },
};