import type { Meta, StoryObj } from "@storybook/react";
import InputHelper from "../../atoms/InputHelper";

const meta: Meta<typeof InputHelper> = {
  title: "Components/Atoms/InputHelper",
  component: InputHelper,
  tags: ["autodocs"],
  args: {
    name: "InputHelper",
    type: "default",
    label: "Input helper"
  },
};

export default meta;

type Story = StoryObj<typeof InputHelper>;

export const Default: Story = {
  args: {
    label: "Default helper"
  },
};

export const ValidationError: Story = {
  args: {
    label: "Validation error",
    type: "validation error"
  },
};

export const GuidanceRed: Story = {
  args: {
    label: "Guidance red",
    type: "guidance red"
  },
};

export const GuidanceGreen: Story = {
  args: {
    label: "Guidance green",
    type: "guidance green"
  },
};