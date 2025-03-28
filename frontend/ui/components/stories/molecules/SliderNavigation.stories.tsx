import type { Meta, StoryObj } from "@storybook/react";
import SliderNavigation from "../../molecules/SliderNavigation";

const meta: Meta<typeof SliderNavigation> = {
  title: "Components/Molecules/SliderNavigation",
  component: SliderNavigation,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<typeof SliderNavigation>;

export const Default: Story = {
};