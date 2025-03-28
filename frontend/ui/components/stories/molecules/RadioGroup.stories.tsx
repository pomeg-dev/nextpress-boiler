import type { Meta, StoryObj } from '@storybook/react';
import RadioGroup from '../../molecules/RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Molecules/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    options: { control: 'object' },
    label: { control: 'text' },
    required: { control: 'boolean' },
    helper_text: {
      control: 'text',
      description: 'Helper text displayed below the textarea'
    },
    helper_type: {
      control: { type: 'select' },
      options: ['default', 'validation error', 'guidance red', 'guidance green'],
      description: 'Type of helper message'
    },
    defaultValue: { control: 'text' },
    direction: { 
      control: { type: 'select' }, 
      options: ['vertical', 'horizontal'] 
    },
    onChange: { action: 'changed' },
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

const colorOptions = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Orange', value: 'orange', disabled: true },
];

export const Default: Story = {
  args: {
    name: 'color-preference',
    options: colorOptions,
    defaultValue: 'red',
    direction: 'vertical',
    label: "Title",
  },
};

export const Horizontal: Story = {
  args: {
    name: 'color-preference',
    options: colorOptions,
    defaultValue: 'blue',
    direction: 'horizontal',
    label: "Title",
  },
};

export const Pill: Story = {
  args: {
    name: 'color-preference',
    options: colorOptions,
    defaultValue: 'blue',
    direction: 'horizontal',
    type: "pill",
    label: "Title",
  },
};