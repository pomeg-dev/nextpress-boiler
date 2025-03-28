import type { Meta, StoryObj } from "@storybook/react";
import Pill from "../../atoms/Pill";

const meta: Meta<typeof Pill> = {
  title: "Components/Atoms/Pill",
  component: Pill,
  tags: ["autodocs"],
  args: {
    children: "Pill content"
  },
};

export default meta;

type Story = StoryObj<typeof Pill>;

export const Primary: Story = {
  args: {
    size: "lg",
    style: "primary",
  },
};

export const Card: Story = {
  args: {
    size: "lg",
    style: "card",
  },
};

export const Accent: Story = {
  args: {
    size: "lg",
    style: "accent",
  },
};

export const HighContrast: Story = {
  args: {
    size: "lg",
    style: "high-contrast",
  },
  globals: {
    colorScheme: 'dark',
  },
};

export const NoFill: Story = {
  args: {
    size: "lg",
    style: "no-fill",
  },
};

export const Invert: Story = {
  args: {
    size: "lg",
    style: "inverted",
  },
};
