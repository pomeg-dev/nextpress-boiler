import type { Meta, StoryObj } from "@storybook/react";
import QuantitySelector from "../../atoms/QuantitySelector";

const meta: Meta<typeof QuantitySelector> = {
  title: "Components/Atoms/QuantitySelector",
  component: QuantitySelector,
  tags: ["autodocs"],
  args: {
    size: "lg",
  },
};

export default meta;

type Story = StoryObj<typeof QuantitySelector>;

export const Default: Story = {
  args: {
    size: "lg",
  },
};
