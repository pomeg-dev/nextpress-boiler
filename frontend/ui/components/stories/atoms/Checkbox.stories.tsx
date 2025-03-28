import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '../../atoms/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    partial: { control: 'boolean' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Default checkbox',
    value: 'default',
    name: 'default-checkbox',
    checked: false,
    partial: false,
    disabled: false,
  },
};

export const Interactive: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <Checkbox label="Click me to toggle" value="interactive" />
        <p className="text-gray-500 text-sm">This checkbox uses internal state management</p>
      </div>
    );
  },
};