"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  Field,
  TextArea,
  TextInput,
} from "@/components/form";
import {
  CONTACT_ERRORS,
  CONTACT_PRIVACY_LINK_LABEL,
  CONTACT_PRIVACY_NOTE,
  PRIVACY_PATH,
  SUBMIT_IDLE_LABEL,
  SUBMIT_PENDING_LABEL,
  SUCCESS_HEADING,
  SUCCESS_MESSAGE,
} from "@/lib/contact/copy";
import { isVerifiedContactSuccess } from "@/lib/contact/response";
import {
  CONTACT_LIMITS,
  isContactHoneypotTripped,
  validateContactInput,
} from "@/lib/contact/validation";

const FIELD_FOCUS_ORDER = ["name", "email", "phone", "message"] as const;

type ContactField = (typeof FIELD_FOCUS_ORDER)[number];

const FIELD_CONTROL_IDS: Record<ContactField, string> = {
  name: "contact-name",
  email: "contact-email",
  phone: "contact-phone",
  message: "contact-message",
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  companyWebsite: string;
};

const EMPTY_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  companyWebsite: "",
};

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const submittingRef = useRef(false);
  const [focusTarget, setFocusTarget] = useState<"error" | "success" | null>(
    null,
  );

  useEffect(() => {
    if (focusTarget === "success") {
      successRef.current?.focus();
      setFocusTarget(null);
      return;
    }

    if (focusTarget === "error") {
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
        setFocusTarget(null);
        return;
      }

      const firstInvalid = FIELD_FOCUS_ORDER.find((field) => fieldErrors[field]);
      if (firstInvalid) {
        document.getElementById(FIELD_CONTROL_IDS[firstInvalid])?.focus();
      }
      setFocusTarget(null);
    }
  }, [focusTarget, fieldErrors]);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    setSuccess(false);

    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      companyWebsite: values.companyWebsite,
    };

    if (isContactHoneypotTripped(payload)) {
      setFormError(CONTACT_ERRORS.validation);
      submittingRef.current = false;
      setSubmitting(false);
      setFocusTarget("error");
      return;
    }

    const clientResult = validateContactInput(payload);
    if (!clientResult.ok) {
      setFieldErrors(clientResult.fieldErrors);
      setFormError(CONTACT_ERRORS.validation);
      submittingRef.current = false;
      setSubmitting(false);
      setFocusTarget("error");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await response.json();

      if (isVerifiedContactSuccess(response.ok, data)) {
        setSuccess(true);
        setFocusTarget("success");
        return;
      }

      const body =
        data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      const nextFieldErrors =
        body.fieldErrors && typeof body.fieldErrors === "object"
          ? (body.fieldErrors as Record<string, string>)
          : {};
      const summaryErrors = { ...nextFieldErrors };
      delete summaryErrors.companyWebsite;
      setFieldErrors(summaryErrors);
      setFormError(
        typeof body.error === "string" ? body.error : CONTACT_ERRORS.unexpected,
      );
    } catch {
      setFormError(CONTACT_ERRORS.unexpected);
    }

    submittingRef.current = false;
    setSubmitting(false);
    setFocusTarget("error");
  }

  if (success) {
    return (
      <Card>
        <h2
          ref={successRef}
          id="contact-success-heading"
          className="contact-success-heading"
          tabIndex={-1}
        >
          {SUCCESS_HEADING}
        </h2>
        <Alert variant="success">{SUCCESS_MESSAGE}</Alert>
      </Card>
    );
  }

  const showErrorSummary = Boolean(formError || Object.keys(fieldErrors).length);
  const linkedErrors = FIELD_FOCUS_ORDER.filter((field) => fieldErrors[field]);

  return (
    <Card>
      <form
        className="contact-form"
        noValidate
        aria-busy={submitting}
        onSubmit={onSubmit}
      >
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-company-website">Company website</label>
          <input
            id="contact-company-website"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={values.companyWebsite}
            onChange={(event) => updateField("companyWebsite", event.target.value)}
          />
        </div>

        {showErrorSummary ? (
          <div
            ref={errorSummaryRef}
            id="contact-errors"
            className="contact-error-summary"
            tabIndex={-1}
          >
            <Alert variant="error">
              <p>{formError ?? CONTACT_ERRORS.validation}</p>
              {linkedErrors.length > 0 ? (
                <ul className="contact-error-list">
                  {linkedErrors.map((field) => (
                    <li key={field}>
                      <a href={`#${FIELD_CONTROL_IDS[field]}`}>
                        {fieldErrors[field]}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Alert>
          </div>
        ) : null}

        <Field label="Name" htmlFor="contact-name" error={fieldErrors.name}>
          <TextInput
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-required="true"
            maxLength={CONTACT_LIMITS.name}
            value={values.name}
            error={Boolean(fieldErrors.name)}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </Field>

        <Field label="Email" htmlFor="contact-email" error={fieldErrors.email}>
          <TextInput
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            maxLength={CONTACT_LIMITS.email}
            value={values.email}
            error={Boolean(fieldErrors.email)}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </Field>

        <Field
          label="Phone (optional)"
          htmlFor="contact-phone"
          error={fieldErrors.phone}
        >
          <TextInput
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone}
            value={values.phone}
            error={Boolean(fieldErrors.phone)}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </Field>

        <Field
          label="Message"
          htmlFor="contact-message"
          error={fieldErrors.message}
        >
          <TextArea
            id="contact-message"
            name="message"
            required
            aria-required="true"
            maxLength={CONTACT_LIMITS.message}
            rows={6}
            value={values.message}
            error={Boolean(fieldErrors.message)}
            onChange={(event) => updateField("message", event.target.value)}
          />
        </Field>

        <p className="contact-privacy">
          {CONTACT_PRIVACY_NOTE}{" "}
          <Link href={PRIVACY_PATH} className="text-link">
            {CONTACT_PRIVACY_LINK_LABEL}
          </Link>
          .
        </p>

        <Button type="submit" variant="primary" block disabled={submitting}>
          {submitting ? SUBMIT_PENDING_LABEL : SUBMIT_IDLE_LABEL}
        </Button>
      </form>
    </Card>
  );
}
