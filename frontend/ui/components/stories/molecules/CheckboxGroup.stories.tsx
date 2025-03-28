import type { Meta, StoryObj } from '@storybook/react';
import CheckboxGroup from '../../molecules/CheckboxGroup';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Components/Molecules/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
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
    options: { control: 'object' },
    defaultValues: { control: 'object' },
    direction: { 
      control: { type: 'select' }, 
      options: ['vertical', 'horizontal'] 
    },
    onChange: { action: 'changed' },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const fruitOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Strawberry', value: 'strawberry', disabled: true },
];

export const Default: Story = {
  args: {
    name: 'favorite-fruits',
    options: fruitOptions,
    defaultValues: ['apple', 'orange'],
    direction: 'vertical',
    label: "Select favourite fruit",
  },
};

export const Horizontal: Story = {
  args: {
    name: 'favorite-fruits',
    options: fruitOptions,
    defaultValues: ['banana'],
    direction: 'horizontal',
    label: "Title",
  },
};

export const TypePill: Story = {
  args: {
    name: 'favorite-fruits',
    options: fruitOptions,
    defaultValues: ['banana'],
    direction: 'horizontal',
    label: "Title",
    type: "pill",
  },
};