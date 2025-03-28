"use client";

import type { Meta, StoryObj } from '@storybook/react';
import TextInput from '../../molecules/TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Molecules/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Input field name attribute'
    },
    label: { 
      control: 'text',
      description: 'Label text for the input field'
    },
    optional_text: { 
      control: 'text',
      description: 'Optional label text for the input field'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    helper_text: {
      control: 'text',
      description: 'Helper text displayed below the input'
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled'
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'tel', 'url'],
      description: 'Input type'
    }
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    optional_text: "Optional",
    placeholder: 'Enter your email address',
    type: 'email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    name: 'username',
    placeholder: 'Enter your username',
    helper_text: 'Your username must be 4-15 characters long',
    helper_type: "default"
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    helper_text: 'Password must be at least 8 characters',
    helper_type: "validation error",
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    name: 'fullName',
    placeholder: 'Enter your full name',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Subscription ID',
    name: 'subscriptionId',
    placeholder: 'Subscription ID',
    disabled: true,
    value: 'SUB-12345',
  },
};