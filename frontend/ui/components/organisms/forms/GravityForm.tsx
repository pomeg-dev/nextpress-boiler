"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Button from "@ui/components/atoms/Button";
import InputHelper from "@ui/components/atoms/InputHelper";
import RadioGroup from "@ui/components/molecules/RadioGroup";
import SelectInput from "@ui/components/molecules/SelectInput";
import TextAreaInput from "@ui/components/molecules/TextAreaInput";
import TextInput from "@ui/components/molecules/TextInput";
import CheckboxGroup from "@ui/components/molecules/CheckboxGroup";
import { useRouter } from "next/navigation";
import Parser from "html-react-parser";
import { trackGA4Event } from "@pomeg-dev/nextpress-client/analytics";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const REQUIRED_MESSAGE = "This field is required.";
const NETWORK_MESSAGE = "We couldn't send the form. Check your connection and try again.";
const SERVER_MESSAGE = "Some fields need attention. Check the messages below each field.";

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

// Gravity Forms REST keys: multi-input fields post one key per input
// (`input_6_1`), everything else posts `input_<id>`.
const inputKey = (inputId: string | number) => `input_${String(inputId).replace(".", "_")}`;

function toSubmission(data: Record<string, any>, fields: any[]) {
  const payload: Record<string, any> = {};
  fields.forEach((field) => {
    const value = data[`input_${field.id}`];
    if (field.type === "checkbox" && Array.isArray(value)) {
      field.choices?.forEach((choice: any, index: number) => {
        if (value.includes(choice.value)) {
          payload[inputKey(field.inputs?.[index]?.id ?? `${field.id}.${index + 1}`)] = choice.value;
        }
      });
    } else if (field.type === "consent") {
      if (value) {
        payload[inputKey(`${field.id}.1`)] = "1";
        payload[inputKey(`${field.id}.2`)] = field.checkboxLabel ?? "";
      }
    } else if (value !== undefined && value !== "") {
      payload[`input_${field.id}`] = value;
    }
  });
  return payload;
}

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
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const formErrorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setError,
    setFocus,
  } = useForm();

  const fields: any[] = gfData?.fields ?? [];
  const required = (field: any) => field.isRequired ? (field.errorMessage || REQUIRED_MESSAGE) : false;

  // Move focus to the result so keyboard and screen reader users hear it.
  useEffect(() => {
    if (confirmationMessage) confirmationRef.current?.focus();
  }, [confirmationMessage]);

  useEffect(() => {
    if (formError) formErrorRef.current?.focus();
  }, [formError]);

  async function onSubmit(data: any) {
    setFormError(null);
    let res: any;
    try {
      const response = await fetch(
        `${API_URL}/wp-json/gf/v2/forms/${gfData.id}/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toSubmission(data, fields)),
        }
      );
      res = await response.json();
    } catch (e) {
      setFormError(NETWORK_MESSAGE);
      return;
    }

    // Field errors from Gravity Forms: show each under its field.
    if (res?.is_valid === false) {
      const messages: Record<string, string> = res.validation_messages ?? {};
      const ids = Object.keys(messages);
      ids.forEach((id) => {
        setError(`input_${id}`, { type: "server", message: messages[id] });
      });
      if (ids.length > 0) {
        setFocus(`input_${ids[0]}`);
      } else {
        setFormError(SERVER_MESSAGE);
      }
      return;
    }

    if (res?.confirmation_redirect) {
      window.location.href = res.confirmation_redirect;
      return;
    }

    if (!res?.confirmation_message && res?.is_valid !== true) {
      setFormError(NETWORK_MESSAGE);
      return;
    }

    setConfirmationMessage(res.confirmation_message || "Thank you. Your message has been sent.");
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
  };

  if (confirmationMessage) {
    return (
      <div className="gravity-form">
        <div
          ref={confirmationRef}
          tabIndex={-1}
          role="status"
          className="gf-confirmation flow"
        >
          {Parser(confirmationMessage)}
        </div>
      </div>
    );
  }

  return (
    <div className="gravity-form">
      <form
        noValidate
        aria-busy={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        className={classNames(
          "gf-form grid gap-x-sm gap-y-md",
          two_columns ? "md:grid-cols-2 grid-cols-1" : "grid-cols-12",
        )}
      >
        {displayTitle && gfData?.title && (
          <h3 className="col-span-12 heading-sm">
            {Parser(gfData.title)}
          </h3>
        )}

        {formError && (
          <div
            ref={formErrorRef}
            tabIndex={-1}
            role="alert"
            className="gf-form-error col-span-12"
          >
            {formError}
          </div>
        )}

        {fields.map((field: any, i: number) => {
          const name = `input_${field.id}`;
          const fieldError = errors[name];
          const helperType = fieldError ? "validation error" : "default";
          const helperText = fieldError?.message?.toString() || field.description || '';

          // Check if this field has a matching paramField
          const fieldClass = "gf-" + slugify(field.label ?? "");
          const matchingParam = paramFields?.find(param => param.class === fieldClass);
          const defaultValue = field.defaultValue || matchingParam?.value || '';

          return (
            <div
              className={classNames(
                "gf-field-wrapper",
                fieldClass,
                "flex flex-col col-span-12",
                field.layoutGridColumnSpan === 12
                  ? "md:col-span-12"
                  : field.layoutGridColumnSpan === 6
                    ? "md:col-span-6"
                    : field.layoutGridColumnSpan === 4
                      ? "md:col-span-4"
                      : "col-span-12",
                two_columns && field.type !== "consent" && "col-span-1!",
                two_columns && field.type === "consent" && "col-span-1! md:col-span-2!",
                field.type === 'hidden' && "hidden",
              )}
              key={i}
            >
              {(() => {
                switch (field.type) {
                  case "text":
                  case "number":
                  case "email":
                  case "phone": {
                    const patterns: Record<string, { value: RegExp; message: string }> = {
                      email: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Enter an email address like name@example.com.",
                      },
                      phone: {
                        value: /^[0-9+\-() ]+$/,
                        message: "Enter a phone number using digits, spaces, + ( ) or -.",
                      },
                    };
                    const types: Record<string, string> = { email: "email", phone: "tel", number: "number", text: "text" };
                    const autoComplete: Record<string, string> = { email: "email", phone: "tel" };
                    return (
                      <Controller
                        control={control}
                        name={name}
                        rules={{ required: required(field), pattern: patterns[field.type] }}
                        defaultValue={defaultValue}
                        render={({ field: formField }) => (
                          <TextInput
                            ref={formField.ref}
                            name={name}
                            label={field.label}
                            placeholder={field.placeholder}
                            required={field.isRequired}
                            helper_text={helperText}
                            helper_type={helperType}
                            type={types[field.type]}
                            autoComplete={autoComplete[field.type] ?? (/name/i.test(field.label) ? "name" : undefined)}
                            onChange={formField.onChange}
                            onBlur={formField.onBlur}
                            value={formField.value || ''}
                          />
                        )}
                      />
                    );
                  }
                  case "textarea":
                    return (
                      <Controller
                        control={control}
                        name={name}
                        rules={{ required: required(field) }}
                        defaultValue={defaultValue}
                        render={({ field: formField }) => (
                          <TextAreaInput
                            ref={formField.ref}
                            name={name}
                            label={field.label}
                            placeholder={field.placeholder}
                            required={field.isRequired}
                            helper_text={helperText}
                            helper_type={helperType}
                            onChange={formField.onChange}
                            onBlur={formField.onBlur}
                            value={formField.value || ''}
                            rows={field.size === "small" ? 3 : field.size === "large" ? 8 : 5}
                            maxLength={field.maxLength || undefined}
                            showCharCount={field.maxLength ? true : false}
                          />
                        )}
                      />
                    );
                  case "checkbox": {
                    const checkboxOptions = field.choices.map((choice: any) => ({
                      label: choice.text,
                      value: choice.value,
                      disabled: false
                    }));

                    return (
                      <Controller
                        control={control}
                        name={name}
                        rules={{ required: required(field) }}
                        defaultValue={defaultValue || []}
                        render={({ field: formField }) => (
                          <CheckboxGroup
                            name={name}
                            options={checkboxOptions}
                            label={field.label}
                            required={field.isRequired}
                            helper_text={helperText}
                            helper_type={helperType}
                            direction={field.isInline ? "horizontal" : "vertical"}
                            type={field.inputType === "pill" ? "pill" : "checkbox"}
                            defaultValues={formField.value || []}
                            onChange={(values) => formField.onChange(values)}
                          />
                        )}
                      />
                    );
                  }
                  case "radio":
                  case "survey": {
                    if (field.type === "survey" && field.inputType !== "likert") return null;
                    const radioOptions = field.choices.map((choice: any) => ({
                      label: choice.text,
                      value: choice.value,
                      disabled: false
                    }));

                    return (
                      <Controller
                        control={control}
                        name={name}
                        rules={{ required: required(field) }}
                        defaultValue={defaultValue}
                        render={({ field: formField }) => (
                          <RadioGroup
                            name={name}
                            options={radioOptions}
                            label={field.label}
                            required={field.isRequired}
                            helper_text={helperText}
                            helper_type={helperType}
                            direction={field.type === "survey" || field.isInline ? "horizontal" : "vertical"}
                            type={field.inputType === "pill" ? "pill" : "radio"}
                            defaultValue={formField.value || ''}
                            onChange={(value) => formField.onChange(value)}
                          />
                        )}
                      />
                    );
                  }
                  case "select": {
                    const selectOptions = field.choices.map((choice: any) => ({
                      value: choice.value,
                      label: choice.text,
                    }));

                    return (
                      <Controller
                        control={control}
                        name={name}
                        rules={{ required: required(field) }}
                        defaultValue={defaultValue}
                        render={({ field: formField }) => (
                          <SelectInput
                            ref={formField.ref}
                            name={name}
                            label={field.label}
                            options={selectOptions}
                            placeholder={field.placeholder}
                            required={field.isRequired}
                            helper_text={helperText}
                            helper_type={helperType}
                            onChange={(e) => formField.onChange(e.target.value)}
                            onBlur={formField.onBlur}
                            value={formField.value}
                          />
                        )}
                      />
                    );
                  }
                  case "date":
                  case "datepicker":
                    return (
                      <div className="field">
                        <label htmlFor={name} className="field-label">
                          <span>
                            {field.label}
                            {field.isRequired && <span className="field-required" aria-hidden="true">*</span>}
                          </span>
                        </label>
                        <input
                          id={name}
                          type="date"
                          className={classNames("field-control", fieldError && "is-invalid")}
                          aria-invalid={fieldError ? true : undefined}
                          aria-describedby={helperText ? `${name}-description` : undefined}
                          aria-required={field.isRequired || undefined}
                          {...register(name, { required: required(field) })}
                        />
                        {helperText && <InputHelper name={name} type={helperType} label={helperText} />}
                      </div>
                    );
                  case "consent":
                    return (
                      <div className={classNames("field", centered && "items-center")}>
                        <div className="field-consent">
                          <input
                            type="checkbox"
                            id={name}
                            aria-invalid={fieldError ? true : undefined}
                            aria-describedby={helperText ? `${name}-description` : undefined}
                            aria-required={field.isRequired || undefined}
                            {...register(name, { required: required(field) })}
                          />
                          <label htmlFor={name}>
                            {field.checkboxLabel || field.label}
                            {field.isRequired && <span className="field-required" aria-hidden="true">*</span>}
                          </label>
                        </div>
                        {helperText && <InputHelper name={name} type={helperType} label={helperText} />}
                      </div>
                    );
                  case "hidden":
                    return (
                      <input
                        type="hidden"
                        {...register(name)}
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
        })}

        <div className={classNames(
          "buttons col-span-12 flex flex-wrap gap-xs",
          two_columns && "md:col-span-2",
          centered && "justify-center"
        )}>
          <Button
            type="submit"
            size="lg"
            style="primary"
            iconRight={isSubmitting ? undefined : "ArrowRight"}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : (gfData?.button?.text || "Send message")}
          </Button>
          {backButton &&
            <Button
              type="button"
              onClick={() => router.back()}
              size="lg"
              style="no-fill"
            >
              {typeof backButton === 'string' ? backButton : "Back"}
            </Button>
          }
        </div>
      </form>
    </div>
  );
}
