import type { Meta, StoryObj } from '@storybook/react';
import CheckboxCard from '../../atoms/CheckboxCard';

const meta: Meta<typeof CheckboxCard> = {
  title: 'Components/Atoms/CheckboxCard',
  component: CheckboxCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CheckboxCard>;

export const Default: Story = {
  args: {
    label: "This is a checkbox card",
    description: "This is a description",
    value: "my-button",
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "This is a checkbox card",
    description: "This is a description",
    value: "my-button",
    checked: true,
  },
};

export const Error: Story = {
  args: {
    label: "This is a checkbox card",
    description: "This is a description",
    value: "my-button",
    state: "error",
  },
};

export const Success: Story = {
  args: {
    label: "This is a checkbox card",
    description: "This is a description",
    value: "my-button",
    state: "success",
  },
};