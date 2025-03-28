import type { Meta, StoryObj } from '@storybook/react';
import RadioCard from '../../atoms/RadioCard';

const meta: Meta<typeof RadioCard> = {
  title: 'Components/Atoms/RadioCard',
  component: RadioCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RadioCard>;

export const Default: Story = {
  args: {
    label: "This is a radio card",
    description: "This is a description",
    value: "my-button",
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "This is a radio card",
    description: "This is a description",
    value: "my-button",
    checked: true,
  },
};