"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import classNames from "classnames";
import Button from "@ui/components/atoms/Button";
import RadioGroup from "@ui/components/molecules/RadioGroup";
import SelectInput from "@ui/components/molecules/SelectInput";
import TextAreaInput from "@ui/components/molecules/TextAreaInput";
import TextInput from "@ui/components/molecules/TextInput";
import CheckboxGroup from "@ui/components/molecules/CheckboxGroup";
import { useRouter } from "next/navigation";
import Parser from "html-react-parser";
import { trackGA4Event } from "@/lib/ga4";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const slugify = (text: string): string => {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
};

type ParamProps = {
  class: string,
  value: string,
};

export type GravityFormProps = {
  gfData: any;
  two_columns?: boolean;
  centered?: boolean;
  displayTitle?: boolean;
  onSuccess?: () => void;
  paramFields?: ParamProps[];
  backButton?: boolean | string;
};

export function GravityForm({
  gfData,
  two_columns = false,
  displayTitle = false,
  centered = false,
  onSuccess,
  paramFields = [],
  backButton = false,
}: GravityFormProps) {
  const router = useRouter();
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  async function onSubmit(data: any) {
    try {
      const response = await fetch(
        `${API_URL}/wp-json/gf/v2/forms/${gfData.id}/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      if (res.confirmation_message) {
        setConfirmationMessage(res.confirmation_message);
      } else if (res.confirmation_redirect) {
        window.location.href = res.confirmation_redirect;
      }
      reset();

      // Send event to GA4
      trackGA4Event("form_submission", {
        event_category: "form",
        form_id: gfData.id,
      });

      // Call optional success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="gravity-form">
      {confirmationMessage ? (
        <div dangerouslySetInnerHTML={{ __html: confirmationMessage }} />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classNames(
            "gf-form grid gap-[8px]",
            two_columns ? "md:grid-cols-2 grid-cols-1" : "grid-cols-12",
          )}
        >
          {displayTitle && gfData?.title && (
            <h3 className="col-span-12 text-heading-sm">
              {Parser(gfData.title)}
            </h3>
          )}
          {gfData &&
            gfData.fields &&
            gfData.fields.map((field: any, i: number) => {
              const fieldError = errors[`input_${field.id}`];
              const helperType = fieldError ? "validation error" : "default";
              const helperText = fieldError?.message?.toString() || field.description || '';

              // Check if this field has a matching paramField
              const fieldClass = "gf-" + slugify(field.label);
              const matchingParam = paramFields?.find(param => param.class === fieldClass);
              const defaultValue = field.defaultValue || matchingParam?.value || '';

              return (
                <div
                  className={classNames(
                    "gf-field-wrapper",
                    fieldClass,
                    "mb-4 flex flex-col col-span-12",
                    field.layoutGridColumnSpan === 12
                      ? "md:col-span-12"
                      : field.layoutGridColumnSpan === 6
                        ? "md:col-span-6"
                        : field.layoutGridColumnSpan === 4
                          ? "md:col-span-4"
                          : "col-span-12",
                    two_columns && field.type !== "consent" && "!col-span-1",
                    two_columns && field.type === "consent" && "!col-span-1 md:!col-span-2",
                    field.type === 'hidden' && "hidden",
                  )}
                  key={i}
                >
                  {(() => {
                    switch (field.type) {
                      case "text":
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ required: field.isRequired }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <TextInput
                                name={`input_${field.id}`}
                                label={field.label}
                                placeholder={field.placeholder}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                onChange={formField.onChange}
                                value={formField.value || ''}
                              />
                            )}
                          />
                        );
                      case "number":
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ required: field.isRequired }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <TextInput
                                name={`input_${field.id}`}
                                label={field.label}
                                placeholder={field.placeholder}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                onChange={formField.onChange}
                                value={formField.value || ''}
                                type="number"
                              />
                            )}
                          />
                        );
                      case "email":
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ 
                              required: field.isRequired,
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                              }
                            }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <TextInput
                                name={`input_${field.id}`}
                                label={field.label}
                                placeholder={field.placeholder}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                type="email"
                                onChange={formField.onChange}
                                value={formField.value || ''}
                              />
                            )}
                          />
                        );
                      case "phone":
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ 
                              required: field.isRequired,
                              pattern: {
                                value: /^[0-9+\-() ]+$/,
                                message: "Invalid phone number"
                              }
                            }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <TextInput
                                name={`input_${field.id}`}
                                label={field.label}
                                placeholder={field.placeholder}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                type="tel"
                                onChange={formField.onChange}
                                value={formField.value || ''}
                              />
                            )}
                          />
                        );
                      case "textarea":
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ required: field.isRequired }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <TextAreaInput
                                name={`input_${field.id}`}
                                label={field.label}
                                placeholder={field.placeholder}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                onChange={formField.onChange}
                                value={formField.value || ''}
                                rows={field.size || 5}
                                maxLength={field.maxLength || undefined}
                                showCharCount={field.maxLength ? true : false}
                              />
                            )}
                          />
                        );
                      case "checkbox":
                        const checkboxOptions = field.choices.map((choice: any) => ({
                          label: choice.text,
                          value: choice.value,
                          disabled: false
                        }));
                        
                        const checkboxType = field.inputType === "pill" ? "pill" : "checkbox";
                        const checkboxDirection = field.isInline ? "horizontal" : "vertical";
                        
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ required: field.isRequired }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <CheckboxGroup
                                name={`input_${field.id}`}
                                options={checkboxOptions}
                                label={field.label}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                direction={checkboxDirection}
                                type={checkboxType}
                                defaultValues={formField.value || []}
                                onChange={(values) => formField.onChange(values)}
                              />
                            )}
                          />
                        );
                      case "radio":
                        const radioOptions = field.choices.map((choice: any) => ({
                          label: choice.text,
                          value: choice.value,
                          disabled: false
                        }));
                        
                        const radioType = field.inputType === "pill" ? "pill" : "radio";
                        const direction = field.isInline ? "horizontal" : "vertical";
                        
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ required: field.isRequired }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <RadioGroup
                                name={`input_${field.id}`}
                                options={radioOptions}
                                label={field.label}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                direction={direction}
                                type={radioType}
                                defaultValue={formField.value || ''}
                                onChange={(value) => formField.onChange(value)}
                              />
                            )}
                          />
                        );
                      case "select":
                        const selectOptions = field.choices.map((choice: any) => ({
                          value: choice.value,
                          label: choice.text,
                        }));
                        
                        return (
                          <Controller
                            control={control}
                            name={`input_${field.id}`}
                            rules={{ required: field.isRequired }}
                            defaultValue={defaultValue}
                            render={({ field: formField }) => (
                              <SelectInput
                                name={`input_${field.id}`}
                                label={field.label}
                                options={selectOptions}
                                placeholder={field.placeholder}
                                required={field.isRequired}
                                helper_text={helperText}
                                helper_type={helperType}
                                onChange={(e) => formField.onChange(e.target.value)}
                                value={formField.value}
                              />
                            )}
                          />
                        );
                      case "date":
                      case "datepicker":
                        return (
                          <>
                            <input
                              type="date"
                              {...register(`input_${field.id}`, { required: field.isRequired })}
                              required={field.isRequired}
                            />
                            {fieldError && (
                              <span className="mt-1 text-sm text-red">
                                {fieldError.message?.toString()}
                              </span>
                            )}
                          </>
                        );
                      case "consent":
                        return (
                          <div className={classNames(
                            "mt-[10px] flex items-center gap-2",
                            centered && "justify-center"
                          )}>
                            <input
                              type="checkbox"
                              id={`input_${field.id}`}
                              {...register(`input_${field.id}`, { required: field.isRequired })}
                              checked={field.value}
                              required={field.isRequired}
                            />
                            <label
                              htmlFor={`input_${field.id}`}
                              className="leading-tight"
                            >
                              {field.checkboxLabel}
                            </label>
                            {fieldError && (
                              <span className="mt-1 text-sm text-red">
                                {fieldError.message?.toString()}
                              </span>
                            )}
                          </div>
                        );
                      case "survey":
                        if (field.inputType === "likert") {
                          const radioOptions = field.choices.map((choice: any) => ({
                            label: choice.text,
                            value: choice.value,
                            disabled: false
                          }));

                          return (
                            <Controller
                              control={control}
                              name={`input_${field.id}`}
                              rules={{ required: field.isRequired }}
                              defaultValue={defaultValue}
                              render={({ field: formField }) => (
                                <RadioGroup
                                  name={`input_${field.id}`}
                                  options={radioOptions}
                                  label={field.label}
                                  required={field.isRequired}
                                  helper_text={helperText}
                                  helper_type={helperType}
                                  direction="horizontal"
                                  type="radio"
                                  defaultValue={formField.value || ''}
                                  onChange={(value) => formField.onChange(value)}
                                />
                              )}
                            />
                          );
                        }
                        return null;
                      case "hidden":
                        return (
                          <input
                            type="hidden"
                            {...register(`input_${field.id}`)}
                            value={defaultValue}
                          />
                        );
                      case "html":
                        return (
                          <div
                            dangerouslySetInnerHTML={{ __html: field?.content }}
                            className={field?.cssClass}
                          />
                        );
                    }
                  })()}
                </div>
              );
            })
          }

          <div className="buttons">
            <Button
              type="submit"
              onClick={(e?: any) => {
                e?.preventDefault();
                handleSubmit(onSubmit)();
              }}
              className={classNames(
                two_columns && "col-span-1 md:col-span-2",
                centered && "mx-auto"
              )}
              size="md"
              style="tertiary"
            >
              {gfData?.button?.text || "Submit"}
            </Button>
            {backButton &&
              <Button
                type="button"
                onClick={(e?: any) => {
                  e?.preventDefault();
                  router.back();
                }}
                className={classNames(
                  two_columns && "col-span-1 md:col-span-2",
                  centered && "mx-auto col-span-12"
                )}
                size="md"
                style="no-fill"
              >
                {typeof backButton === 'string' ? backButton : "Back"}
              </Button>
            }
          </div>
        </form>
      )}
    </div>
  );
}