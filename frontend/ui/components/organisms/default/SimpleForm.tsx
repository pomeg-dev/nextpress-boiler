"use client";

import React, { FormEvent, ReactNode } from 'react';
import classNames from 'classnames';
import Button from '../../atoms/Button';

export interface FormProps {
  id: string;
  title?: string;
  description?: string;
  bordered?: boolean;
  className?: string;
  children: ReactNode;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const SimpleForm: React.FC<FormProps> = ({
  id,
  title,
  description,
  bordered = false,
  className,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  isSubmitting = false,
  disabled = false,
  onSubmit,
  onCancel,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting || disabled) return;
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form 
      id={id}
      className={classNames(
        "flex flex-col space-y-6 w-full max-w-2xl",
        bordered && "border border-gray-200 rounded-lg p-6",
        className
      )}
      onSubmit={handleSubmit}
    >
      {title && (
        <div className="space-y-2">
          <h2 className="text-xl font-[600]">{title}</h2>
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button
          type='submit'
          disabled={isSubmitting || disabled}
        >
          {isSubmitting ? "Submitting..." : submitText}
        </Button>
        
        {onCancel && (
          <Button
            type='button'
            style='high-contrast'
            onClick={handleCancel}
            disabled={isSubmitting || disabled}
          >
            {cancelText}
          </Button>
        )}
      </div>
    </form>
  );
};

export default SimpleForm;