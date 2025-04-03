"use client";

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SimpleForm from '@ui/components/organisms/default/SimpleForm';
import TextInput from '@ui/components/molecules/TextInput';
import SelectInput from '@ui/components/molecules/SelectInput';
import TextAreaInput from '@ui/components/molecules/TextAreaInput';
import RadioGroup from '@ui/components/molecules/RadioGroup';
import CheckboxGroup from '@ui/components/molecules/CheckboxGroup';

const meta: Meta<typeof SimpleForm> = {
  title: 'Components/Organisms/Default/SimpleForm',
  component: SimpleForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SimpleForm>;

// FormWrapper component to handle state
const ContactFormExample = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setFormData(data);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleCancel = () => {
    alert('Form canceled');
  };

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  const contactPreferenceOptions = [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Text Message', value: 'sms' }
  ];

  const interestOptions = [
    { label: 'Product Updates', value: 'product_updates' },
    { label: 'Promotions', value: 'promotions' },
    { label: 'Newsletter', value: 'newsletter' },
    { label: 'Events', value: 'events' }
  ];

  return (
    <div className="space-y-6">
      <SimpleForm
        id="contact-form"
        title="Contact Information"
        description="Please provide your contact details and preferences."
        bordered={true}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        className='bg-primary/5'
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            required
          />
          <TextInput
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            required
          />
        </div>

        <TextInput
          name="email"
          label="Email Address"
          placeholder="Enter your email address"
          type="email"
          required
          helper_text="We'll never share your email with anyone else."
        />

        <TextInput
          name="phone"
          label="Phone Number"
          placeholder="Enter your phone number"
          type="tel"
          optional_text="Optional"
        />

        <SelectInput
          name="country"
          label="Country"
          placeholder="Select your country"
          options={countryOptions}
          required
        />

        <TextAreaInput
          name="address"
          label="Address"
          placeholder="Enter your full address"
          rows={3}
          optional_text="Optional"
        />

        <RadioGroup
          name="contactPreference"
          label="Preferred Contact Method"
          options={contactPreferenceOptions}
          defaultValue="email"
        />

        <CheckboxGroup
          name="interests"
          label="Interests"
          options={interestOptions}
          helper_text="Select all that apply"
          direction="horizontal"
        />
      </SimpleForm>

      {formData && (
        <div className="border-green-200 bg-green-50 mt-6 rounded-md border p-4">
          <h3 className="text-green-800 mb-2 text-lg font-medium">Form Submitted!</h3>
          <pre className="overflow-auto rounded border bg-white p-2 text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const ContactForm: Story = {
  render: () => <ContactFormExample />
};