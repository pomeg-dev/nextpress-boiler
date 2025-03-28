"use client";

import type { Meta, StoryObj } from '@storybook/react';
import TextAreaInput from '../../molecules/TextAreaInput';

const meta: Meta<typeof TextAreaInput> = {
  title: 'Components/Molecules/TextAreaInput',
  component: TextAreaInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { 
      control: 'text',
      description: 'Label text for the textarea field'
    },
    name: {
      control: 'text',
      description: 'Textarea field name attribute'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    optional_text: {
      control: 'text',
      description: 'Optional text displayed next to the label'
    },
    helper_text: {
      control: 'text',
      description: 'Helper text displayed below the textarea'
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
    rows: {
      control: 'number',
      description: 'Number of visible text lines'
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters allowed'
    },
    showCharCount: {
      control: 'boolean',
      description: 'Whether to show character count'
    }
  },
};

export default meta;
type Story = StoryObj<typeof TextAreaInput>;

export const Default: Story = {
  args: {
    label: 'Description',
    name: 'description',
    placeholder: 'Enter a detailed description',
    rows: 4
  },
};

export const WithOptionalText: Story = {
  args: {
    label: 'Comments',
    name: 'comments',
    optional_text: 'Optional',
    placeholder: 'Add any additional comments',
    rows: 3
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Feedback',
    name: 'feedback',
    placeholder: 'Please provide your feedback',
    helper_text: 'Your feedback helps us improve our service',
    rows: 4
  },
};

export const WithValidationError: Story = {
  args: {
    label: 'Bio',
    name: 'bio',
    placeholder: 'Tell us about yourself',
    helper_text: 'Bio must be at least 50 characters',
    helper_type: 'validation error',
    rows: 4
  },
};

export const WithGuidanceGreen: Story = {
  args: {
    label: 'Project Summary',
    name: 'projectSummary',
    placeholder: 'Summarize your project',
    helper_text: 'Perfect length for a summary',
    helper_type: 'guidance green',
    rows: 3
  },
};

export const WithCharacterCount: Story = {
  args: {
    label: 'Cover Letter',
    name: 'coverLetter',
    placeholder: 'Write your cover letter',
    maxLength: 500,
    showCharCount: true,
    rows: 6
  },
};

export const Required: Story = {
  args: {
    label: 'Message',
    name: 'message',
    placeholder: 'Enter your message',
    required: true,
    rows: 4
  },
};

export const Disabled: Story = {
  args: {
    label: 'System Notes',
    name: 'systemNotes',
    placeholder: 'System notes',
    disabled: true,
    value: 'These are automated system notes that cannot be edited.',
    rows: 3
  },
};