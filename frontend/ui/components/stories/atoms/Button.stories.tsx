import type { Meta, StoryObj } from "@storybook/react";
import Button from "../../atoms/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    linkItem: { title: "Click me" }
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    size: "xl",
    style: "primary",
    special: true,
  },
};

export const Secondary: Story = {
  args: {
    size: "xl",
    style: "secondary",
    special: true,
  },
};

export const Card: Story = {
  args: {
    size: "xl",
    style: "card",
    special: true,
  },
};

export const HighContrast: Story = {
  args: {
    size: "xl",
    style: "high-contrast",
    special: true,
  },
  globals: {
    colorScheme: 'dark',
  },
};

export const NoFill: Story = {
  args: {
    size: "xl",
    style: "no-fill",
  },
};
