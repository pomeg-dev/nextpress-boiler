import type { Meta, StoryObj } from "@storybook/react";
import FloatingTag from "../../atoms/FloatingTag";

const meta: Meta<typeof FloatingTag> = {
  title: "Components/Atoms/FloatingTag",
  component: FloatingTag,
  tags: ["autodocs"],
  args: {
    text: "Lorem ipsum",
    size: "lg",
    style: "glass-light",
    icon: "right",
    state: "open"
  },
};

export default meta;

type Story = StoryObj<typeof FloatingTag>;

export const Default: Story = {};

export const Closed: Story = {
  args: {
    state: "close",
  }
};