"use client";

import type { Meta, StoryObj } from '@storybook/react';
import SelectInput from '../../molecules/SelectInput';

const meta: Meta<typeof SelectInput> = {
  title: 'Components/Molecules/SelectInput',
  component: SelectInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { 
      control: 'text',
      description: 'Label text for the select field'
    },
    name: {
      control: 'text',
      description: 'Select field name attribute'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the select'
    },
    optional_text: {
      control: 'text',
      description: 'Optional text displayed next to the label'
    },
    helper_text: {
      control: 'text',
      description: 'Helper text displayed below the select'
    },
    helper_type: {
      control: { type: 'select' },
      options: ['default', 'validation error', 'guidance red', 'guidance green'],
      description: 'Type of helper message'
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled'
    },
    options: {
      control: 'object',
      description: 'Array of select options'
    }
  },
};

export default meta;
type Story = StoryObj<typeof SelectInput>;

// Common options for stories
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' }
];

const categoryOptions = [
  { value: '', label: '-- Select Category --', disabled: true },
  { value: 'tech', label: 'Technology' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance' },
  { value: 'edu', label: 'Education' }
];

export const Default: Story = {
  args: {
    label: 'Country',
    name: 'country',
    placeholder: 'Select a country',
    options: countryOptions
  },
};

export const WithOptionalText: Story = {
  args: {
    label: 'Language',
    name: 'language',
    optional_text: 'Optional',
    placeholder: 'Select preferred language',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'zh', label: 'Chinese' }
    ]
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Subscription Plan',
    name: 'plan',
    placeholder: 'Select a plan',
    helper_text: 'You can change your plan anytime',
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'premium', label: 'Premium' },
      { value: 'enterprise', label: 'Enterprise' }
    ]
  },
};

export const WithValidationError: Story = {
  args: {
    label: 'Category',
    name: 'category',
    placeholder: 'Select a category',
    helper_text: 'Please select a valid category',
    helper_type: 'validation error',
    options: categoryOptions
  },
};

export const WithGuidanceGreen: Story = {
  args: {
    label: 'Payment Method',
    name: 'paymentMethod',
    placeholder: 'Select payment method',
    helper_text: 'Secure payment options available',
    helper_type: 'guidance green',
    options: [
      { value: 'cc', label: 'Credit Card' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'bank', label: 'Bank Transfer' }
    ]
  },
};

export const Required: Story = {
  args: {
    label: 'Department',
    name: 'department',
    placeholder: 'Select your department',
    required: true,
    options: [
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'support', label: 'Customer Support' }
    ]
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: 'Service Type',
    name: 'serviceType',
    placeholder: 'Select service type',
    options: [
      { value: 'standard', label: 'Standard' },
      { value: 'express', label: 'Express' },
      { value: 'premium', label: 'Premium (Coming Soon)', disabled: true },
      { value: 'vip', label: 'VIP (Coming Soon)', disabled: true }
    ]
  },
};

export const Disabled: Story = {
  args: {
    label: 'Region',
    name: 'region',
    placeholder: 'Select region',
    disabled: true,
    value: 'west',
    options: [
      { value: 'north', label: 'North' },
      { value: 'south', label: 'South' },
      { value: 'east', label: 'East' },
      { value: 'west', label: 'West' }
    ]
  },
};