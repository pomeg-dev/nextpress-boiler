import type { Meta, StoryObj } from '@storybook/react';
import Radio from '../../atoms/Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Atoms/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: "This is a radio button",
    value: "my-button",
    disabled: false,
    checked: true,
  },
};